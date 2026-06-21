import { REDIRECT_URI, FITBIT, GOOGLE_FIT, isConfigured } from './config';

/* ---------- PKCE / helpers ---------- */
function b64url(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
async function sha256(str) {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
}
function randStr(n = 64) {
  const a = new Uint8Array(n); crypto.getRandomValues(a);
  return b64url(a).slice(0, n);
}
const LS = {
  get: (k) => localStorage.getItem(k),
  set: (k, v) => localStorage.setItem(k, v),
  del: (k) => localStorage.removeItem(k),
};

/* ---------- Start connection ---------- */
export async function connectFitbit() {
  if (!isConfigured(FITBIT)) throw new Error('Falta el Client ID de Fitbit (src/integrations/config.js)');
  const verifier = randStr(64);
  const challenge = b64url(await sha256(verifier));
  const state = randStr(16);
  LS.set('hp_provider', 'fitbit');
  LS.set('fitbit_verifier', verifier);
  LS.set('hp_state', state);
  const u = new URL(FITBIT.authUrl);
  u.search = new URLSearchParams({
    response_type: 'code', client_id: FITBIT.clientId, scope: FITBIT.scope,
    code_challenge: challenge, code_challenge_method: 'S256',
    redirect_uri: REDIRECT_URI, state,
  }).toString();
  window.location.assign(u.toString());
}

export function connectGoogleFit() {
  if (!isConfigured(GOOGLE_FIT)) throw new Error('Falta el Client ID de Google Fit (src/integrations/config.js)');
  const state = randStr(16);
  LS.set('hp_provider', 'googlefit');
  LS.set('hp_state', state);
  const u = new URL(GOOGLE_FIT.authUrl);
  u.search = new URLSearchParams({
    client_id: GOOGLE_FIT.clientId, redirect_uri: REDIRECT_URI,
    response_type: 'token', scope: GOOGLE_FIT.scope, state,
    include_granted_scopes: 'true', prompt: 'consent',
  }).toString();
  window.location.assign(u.toString());
}

/* ---------- Handle the OAuth redirect back into the app ----------
   Returns { provider, token } if a token was obtained, else null. */
export async function handleOAuthRedirect() {
  const provider = LS.get('hp_provider');
  const url = new URL(window.location.href);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));

  // Google Fit (implicit): #access_token=...
  if (hash.get('access_token')) {
    const token = hash.get('access_token');
    LS.set('googlefit_token', token);
    LS.set('googlefit_expires', String(Date.now() + (+hash.get('expires_in') || 3600) * 1000));
    cleanUrl();
    return { provider: 'googlefit', token };
  }

  // Fitbit (auth code + PKCE): ?code=...
  const code = url.searchParams.get('code');
  if (code && provider === 'fitbit') {
    const verifier = LS.get('fitbit_verifier');
    const body = new URLSearchParams({
      client_id: FITBIT.clientId, grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI, code, code_verifier: verifier,
    });
    const res = await fetch(FITBIT.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const data = await res.json();
    cleanUrl();
    if (!data.access_token) throw new Error(data.errors?.[0]?.message || 'Fitbit: no se pudo obtener el token');
    LS.set('fitbit_token', data.access_token);
    if (data.refresh_token) LS.set('fitbit_refresh', data.refresh_token);
    return { provider: 'fitbit', token: data.access_token };
  }
  return null;
}

function cleanUrl() {
  window.history.replaceState({}, document.title, REDIRECT_URI);
}

/* ---------- Fetch today's real data ---------- */
export async function fetchToday(provider) {
  if (provider === 'fitbit') return fetchFitbit();
  if (provider === 'googlefit') return fetchGoogleFit();
  return null;
}

async function fetchFitbit() {
  const token = LS.get('fitbit_token');
  if (!token) return null;
  const h = { Authorization: `Bearer ${token}` };
  const day = new Date().toISOString().slice(0, 10);
  const [actR, hrR] = await Promise.all([
    fetch('https://api.fitbit.com/1/user/-/activities/date/today.json', { headers: h }),
    fetch(`https://api.fitbit.com/1/user/-/activities/heart/date/${day}/1d.json`, { headers: h }),
  ]);
  if (actR.status === 401) { LS.del('fitbit_token'); throw new Error('Fitbit: sesión expirada, reconecta'); }
  const act = await actR.json();
  const hr = await hrR.json().catch(() => ({}));
  const s = act.summary || {};
  const dist = (s.distances || []).find(d => d.activity === 'total')?.distance || 0;
  return {
    steps: s.steps || 0,
    caloriesBurned: s.caloriesOut || 0,
    activeMinutes: (s.fairlyActiveMinutes || 0) + (s.veryActiveMinutes || 0),
    distanceKm: dist,
    hr: hr['activities-heart']?.[0]?.value?.restingHeartRate || null,
  };
}

// Google Health API — reads the user's Fitbit (and Google) data. Defensive
// parsing: data type payloads vary, so we extract the first numeric value of
// each data point regardless of the exact field name (count/beatsPerMinute…).
async function fetchGoogleHealth(token) {
  const today = new Date().toISOString().slice(0, 10);
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' };

  const payload = (dp) => {
    for (const [k, v] of Object.entries(dp)) {
      if (k === 'name' || k === 'dataSource') continue;
      if (v && typeof v === 'object') return v;
    }
    return null;
  };
  const num = (obj) => {
    if (!obj) return null;
    for (const [k, v] of Object.entries(obj)) {
      if (k === 'interval' || k === 'date' || /time|offset/i.test(k)) continue;
      if (typeof v === 'number') return v;
      if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(+v)) return +v;
    }
    return null;
  };
  async function list(kebab, filter) {
    const url = `https://health.googleapis.com/v4/users/me/dataTypes/${kebab}/dataPoints?pageSize=2000&filter=${encodeURIComponent(filter)}`;
    try {
      const res = await fetch(url, { headers });
      if (!res.ok) return null;            // 403/404 → API off or no such type
      return (await res.json()).dataPoints || [];
    } catch { return null; }
  }
  const sum = (pts) => (pts || []).reduce((a, dp) => a + (num(payload(dp)) || 0), 0);
  const lastVal = (pts) => { const a = pts || []; for (let i = a.length - 1; i >= 0; i--) { const n = num(payload(a[i])); if (n != null) return n; } return null; };

  const [stepsP, calP, actP, hrP] = await Promise.all([
    list('steps', `steps.interval.civil_start_time >= "${today}"`),
    list('total-calories', `total_calories.interval.civil_start_time >= "${today}"`),
    list('active-minutes', `active_minutes.interval.civil_start_time >= "${today}"`),
    list('daily-resting-heart-rate', `daily_resting_heart_rate.date >= "${today}"`),
  ]);

  // All null → Health API not enabled / not authorized; let caller fall back.
  if (stepsP == null && calP == null && actP == null && hrP == null) return null;

  return {
    steps: Math.round(sum(stepsP)),
    caloriesBurned: Math.round(sum(calP)),
    activeMinutes: Math.round(sum(actP)),
    hr: lastVal(hrP),
  };
}

async function fetchGoogleFit() {
  const token = LS.get('googlefit_token');
  if (!token) return null;
  if (Date.now() > +LS.get('googlefit_expires')) { LS.del('googlefit_token'); throw new Error('Google: sesión expirada, reconecta'); }
  // Read from Google Health (this is what holds the Fitbit data).
  return await fetchGoogleHealth(token);
}

// Diagnostic: shows the granted scopes + the raw Google Health API responses
// so we can see exactly why data is empty (missing scope / wrong type / no data).
export async function diagnoseHealth() {
  const token = LS.get('googlefit_token');
  if (!token) return 'No hay sesión de Google. Pulsa Conectar primero.';
  const out = [];
  try {
    const ti = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`);
    const tij = await ti.json();
    out.push('PERMISOS CONCEDIDOS:\n' + (tij.scope || tij.error_description || JSON.stringify(tij)));
  } catch (e) { out.push('tokeninfo error: ' + e.message); }

  const today = new Date().toISOString().slice(0, 10);
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' };
  const types = [
    ['steps', 'steps.interval.civil_start_time'],
    ['total-calories', 'total_calories.interval.civil_start_time'],
    ['active-minutes', 'active_minutes.interval.civil_start_time'],
    ['daily-resting-heart-rate', 'daily_resting_heart_rate.date'],
  ];
  for (const [kebab, field] of types) {
    const url = `https://health.googleapis.com/v4/users/me/dataTypes/${kebab}/dataPoints?pageSize=3&filter=${encodeURIComponent(`${field} >= "${today}"`)}`;
    try {
      const res = await fetch(url, { headers });
      const body = await res.text();
      out.push(`${kebab} → HTTP ${res.status}\n${body.slice(0, 400)}`);
    } catch (e) { out.push(`${kebab} → error ${e.message}`); }
  }
  return out.join('\n\n──────────\n\n');
}

export function connectedProvider() {
  if (LS.get('fitbit_token')) return 'fitbit';
  if (LS.get('googlefit_token')) return 'googlefit';
  return null;
}
export function disconnectProvider(p) {
  if (p === 'fitbit') { LS.del('fitbit_token'); LS.del('fitbit_refresh'); }
  if (p === 'googlefit') { LS.del('googlefit_token'); LS.del('googlefit_expires'); }
}

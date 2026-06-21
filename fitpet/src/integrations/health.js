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

async function fetchGoogleFit() {
  const token = LS.get('googlefit_token');
  if (!token) return null;
  if (Date.now() > +LS.get('googlefit_expires')) { LS.del('googlefit_token'); throw new Error('Google Fit: sesión expirada, reconecta'); }
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const body = {
    aggregateBy: [
      { dataTypeName: 'com.google.step_count.delta' },
      { dataTypeName: 'com.google.calories.expended' },
      { dataTypeName: 'com.google.distance.delta' },
    ],
    bucketByTime: { durationMillis: 86400000 },
    startTimeMillis: start.getTime(),
    endTimeMillis: Date.now(),
  };
  const res = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (res.status === 401) { LS.del('googlefit_token'); throw new Error('Google Fit: sesión expirada, reconecta'); }
  const data = await res.json();
  const buckets = data.bucket?.[0]?.dataset || [];
  const sum = (ds) => (ds?.point || []).reduce((a, p) => a + (p.value?.[0]?.fpVal ?? p.value?.[0]?.intVal ?? 0), 0);
  return {
    steps: Math.round(sum(buckets[0])),
    caloriesBurned: Math.round(sum(buckets[1])),
    distanceKm: +(sum(buckets[2]) / 1000).toFixed(2),
    activeMinutes: 0,
    hr: null,
  };
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

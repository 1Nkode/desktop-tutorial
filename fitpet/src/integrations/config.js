/*
  Credenciales OAuth de wearables.
  ── Pega aquí tus Client ID (gratis) y listo: la app se conecta de verdad. ──

  FITBIT  → https://dev.fitbit.com/apps  (tipo "Personal", OAuth 2.0, PKCE)
    Redirect/Callback URL: usa exactamente el valor de REDIRECT_URI de abajo.
  GOOGLE FIT → https://console.cloud.google.com (APIs & Services → Credentials)
    Crea un "OAuth client ID" tipo "Web application" y añade REDIRECT_URI en
    "Authorized redirect URIs" y "Authorized JavaScript origins".
    Habilita la "Fitness API".

  La REDIRECT_URI debe coincidir EXACTAMENTE con la que registres.
*/
export const REDIRECT_URI =
  typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';

export const FITBIT = {
  clientId: '',                 // ← pega tu Fitbit OAuth 2.0 Client ID
  scope: 'activity heartrate profile',
  authUrl: 'https://www.fitbit.com/oauth2/authorize',
  tokenUrl: 'https://api.fitbit.com/oauth2/token',
};

export const GOOGLE_FIT = {
  clientId: '411180146577-l90bb6cq23guutvudmqv52jf2vfjuojc.apps.googleusercontent.com',
  scope: [
    'https://www.googleapis.com/auth/fitness.activity.read',
    'https://www.googleapis.com/auth/fitness.heart_rate.read',
    'https://www.googleapis.com/auth/fitness.location.read',
  ].join(' '),
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
};

export const isConfigured = (p) => !!(p && p.clientId);

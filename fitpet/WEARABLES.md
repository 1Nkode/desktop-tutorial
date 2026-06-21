# Conectar wearables reales (Fitbit y Google Fit)

La app ya trae el flujo OAuth completo. Solo necesitas registrar tu app
(gratis) y pegar tu **Client ID** en `src/integrations/config.js`. No se
necesita servidor ni "client secret" (Fitbit usa PKCE, Google usa token).

## Redirect URI
Usa exactamente la URL donde corre la app, por ejemplo:
- Local: `http://localhost:5173/`
- Producción: `https://tudominio.com/`

(En el código es `REDIRECT_URI` = origin + path actual.)

## Fitbit
1. Entra a https://dev.fitbit.com/apps → **Register an app**.
2. OAuth 2.0 Application Type: **Personal** (o Client).
3. Callback URL: tu REDIRECT_URI.
4. Copia el **OAuth 2.0 Client ID** y pégalo en `config.js` → `FITBIT.clientId`.

## Google Fit
1. https://console.cloud.google.com → crea proyecto.
2. **APIs & Services → Library** → habilita **Fitness API**.
3. **Credentials → Create credentials → OAuth client ID → Web application**.
4. En *Authorized JavaScript origins* y *Authorized redirect URIs* añade tu
   REDIRECT_URI.
5. Copia el **Client ID** (`...apps.googleusercontent.com`) en `config.js`
   → `GOOGLE_FIT.clientId`.
6. En la *OAuth consent screen* añade tu cuenta como **test user** mientras
   la app esté en modo prueba.

## Usar
1. `npm run build` y publica con **HTTPS** (los wearables exigen https; en
   local funciona `http://localhost`).
2. En la app: **Dashboard → Conectar dispositivos → Fitbit / Google Fit**.
3. Inicia sesión y autoriza → vuelve a la app y se sincronizan **pasos,
   calorías, distancia y pulso reales**. El botón ↻ vuelve a sincronizar.

## Notas
- **Android (APK):** ya incluye permiso de INTERNET; no requiere prompt.
- **Apple Health / Garmin / Whoop / Oura / Polar / Coros:** necesitan
  programas de desarrollador propios (y Apple Health requiere código nativo
  iOS). Se añaden igual cuando tengas sus credenciales.
- Sin backend, el token vive en el dispositivo; para refresco automático y
  sync multi-dispositivo hace falta un backend (Supabase/Firebase).

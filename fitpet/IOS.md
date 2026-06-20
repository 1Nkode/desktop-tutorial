# Llevar FitPet a iPhone / iOS

Hay dos formas. La 1 funciona **ya** desde Windows; la 2 (App Store) **necesita una Mac**.

## 1) PWA — instalar en el iPhone hoy (sin Mac)
La app ya es instalable como PWA (pantalla completa, ícono propio).

1. Publica el sitio (cualquiera con HTTPS):
   ```bash
   npm run build      # genera dist/
   ```
   Sube `dist/` a Netlify / Vercel / GitHub Pages (o sirve por HTTPS).
2. En el **iPhone (Safari)** abre la URL → botón **Compartir** → **Añadir a pantalla de inicio**.
3. Se instala como app a pantalla completa.

> Nota: Safari/PWA en iOS **no** soporta Web Bluetooth (pulsómetro) ni el reconocimiento de voz (`SpeechRecognition`). Esas funciones se desactivan solas; el resto funciona.

## 2) App nativa para la App Store — con Capacitor (requiere macOS + Xcode)
Ya está configurado Capacitor (`capacitor.config.json`, deps incluidas).

En una **Mac** con Xcode + CocoaPods:
```bash
npm install
npm run ios:add      # crea la carpeta ios/ (solo la primera vez)
npm run ios:sync     # build web + copia a iOS
npm run ios:open     # abre Xcode
```
En Xcode: elige tu *Team* (firma), un dispositivo/simulador y pulsa ▶️ para correr, o *Product → Archive* para subir a la App Store.

Cada vez que cambies el código web: `npm run ios:sync`.

### Permisos a declarar en Xcode (Info.plist)
- `NSMicrophoneUsageDescription` — para la voz de la mascota.
- `NSCameraUsageDescription` — para el escáner de código de barras (nutrición).
- `NSBluetoothAlwaysUsageDescription` — si usas un plugin nativo de BLE.

### Límites en WKWebView (app nativa)
- **Web Bluetooth** y **SpeechRecognition** no existen en WKWebView. Para tenerlos en nativo hay que usar plugins de Capacitor (p. ej. `@capacitor-community/bluetooth-le`, y un plugin de speech) y adaptar `sensors.js` / `talk.js`.
- Cámara y micro (`getUserMedia`) sí funcionan con los permisos anteriores.

## Marca / IP
Antes de publicar, sustituye los assets de terceros (Talking Tom, modelos 3D de ejemplo) por arte propio o con licencia. "Talking Tom" es marca de Outfit7.

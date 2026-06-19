# FitPet — App móvil (React Native + Expo)

App de deporte y bienestar con mascota virtual gamificada. Versión **móvil nativa** (iOS/Android) construida con Expo, siguiendo el design system de Stitch (tema oscuro, verde neón `#CCFF00` + violeta `#8A8AFF`, glassmorphism).

## Cómo ejecutar

```bash
cd fitpet-mobile
npm install
npx expo start
```

Luego escanea el QR con la app **Expo Go** en tu teléfono, o pulsa `i` (simulador iOS) / `a` (emulador Android).

## Estructura

- `App.js` — navegación por pestañas (Diario · Entreno · Comunidad · Mascota · Perfil)
- `src/theme.js` — colores, tipografía y espaciado del design system
- `src/store/useStore.js` — estado global con Zustand
- `src/components/` — UI reutilizable (Card glassmorphic, Ring SVG, ProgressBar, botones pill, TabBar)
- `src/screens/` — las 5 pantallas principales

## Pantallas

| Pestaña | Contenido |
|---------|-----------|
| **Diario** | Anillo de calorías restantes, macronutrientes, diario de comidas por franja |
| **Entreno** | Sesión activa (timer/BPM/cal), Quick Start, intensidad RPE, zonas de FC |
| **Comunidad** | Stories + feed social con likes/comentarios |
| **Mascota** | Mascota que evoluciona según hábitos, estado de ánimo/fuerza, XP, accesorios |
| **Perfil** | Datos de usuario, stats, dispositivos (Fitbit), menú de ajustes |

## Stack

Expo SDK 56 · React Native 0.85 · React 19 · Zustand · react-native-svg · expo-linear-gradient · expo-blur

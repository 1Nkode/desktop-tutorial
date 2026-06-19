// FitPet design system — dark mode, neon green + violet, glassmorphism
// Derived from the Stitch DESIGN.md spec.

export const colors = {
  // Backgrounds / surfaces
  bg: '#121212',
  surface: '#1C1B1B',
  surfaceHigh: '#24242A',
  surfaceHighest: '#2A2A2A',
  glass: 'rgba(255,255,255,0.06)',
  glassBorder: 'rgba(255,255,255,0.10)',

  // Brand
  primary: '#CCFF00', // neon green — action / strength
  primaryDim: '#AACC00',
  onPrimary: '#121212',
  secondary: '#8A8AFF', // soft violet — community / social
  secondaryDim: '#3A38AB',

  // Text
  text: '#E5E2E1',
  textMuted: '#9A9A95',
  textFaint: '#6E6E6A',

  // Track / semantic
  track: '#2E2E32',
  success: '#CCFF00',
  warning: '#FFC24B',
  error: '#FFB4AB',
  protein: '#CCFF00',
  carbs: '#8A8AFF',
  fat: '#FFA38A',
  fiber: '#C4C9AC',
};

export const radius = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 9999,
};

export const spacing = {
  xs: 4,
  sm: 12,
  md: 20,
  lg: 32,
  xl: 48,
  gutter: 16,
  margin: 20,
};

export const type = {
  display: { fontSize: 40, fontWeight: '800', letterSpacing: -1 },
  h1: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '700' },
  statXl: { fontSize: 40, fontWeight: '800', letterSpacing: -1 },
  body: { fontSize: 15, fontWeight: '400' },
  bodyBold: { fontSize: 15, fontWeight: '600' },
  label: { fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  small: { fontSize: 12, fontWeight: '500' },
};

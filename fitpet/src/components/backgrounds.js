/*
  Animated, unlockable scene backgrounds for the pet's little world.
  Each: { label, cat, css (base gradient), fx (animated layer), unlock (level) }
  fx ∈ none | lights | clouds | rays | bokeh | crowd | snow
  Unlock by effective level (max of user & pet level); legendary ones gate high.
*/
export const BG_CATEGORIES = [
  { id: 'Gimnasio', icon: '🏋️' },
  { id: 'Running', icon: '🏃' },
  { id: 'Deportes', icon: '⚽' },
  { id: 'Bienestar', icon: '🧘' },
  { id: 'Legendario', icon: '👑' },
];

export const BACKGROUNDS = {
  default:    { label: 'Auto',                cat: 'Gimnasio', css: 'linear-gradient(135deg, rgba(194,193,255,0.15), rgba(204,255,0,0.08))', fx: 'none', unlock: 0 },

  // ---- Gimnasio ----
  gym_modern: { label: 'Gym moderno',         cat: 'Gimnasio', css: 'linear-gradient(135deg,#232a3b,#10131c)', fx: 'lights', unlock: 0 },
  gym_muscle: { label: 'Musculación',         cat: 'Gimnasio', css: 'linear-gradient(135deg,#2b2b2b,#111)', fx: 'lights', unlock: 3 },
  gym_power:  { label: 'Powerlifting',        cat: 'Gimnasio', css: 'linear-gradient(135deg,#3a1c1c,#140a0a)', fx: 'none', unlock: 6 },
  gym_old:    { label: 'Old school',          cat: 'Gimnasio', css: 'linear-gradient(135deg,#5a4632,#2a2018)', fx: 'none', unlock: 8 },
  gym_func:   { label: 'Funcional',           cat: 'Gimnasio', css: 'linear-gradient(135deg,#0f3443,#34e89e)', fx: 'lights', unlock: 12 },
  gym_premium:{ label: 'Gym premium',         cat: 'Gimnasio', css: 'linear-gradient(135deg,#1f1c2c,#928dab)', fx: 'bokeh', unlock: 20 },

  // ---- Running ----
  track:      { label: 'Pista atletismo',     cat: 'Running', css: 'linear-gradient(135deg,#b34233,#6a1f17)', fx: 'none', unlock: 0 },
  park:       { label: 'Parque',              cat: 'Running', css: 'linear-gradient(135deg,#56ab2f,#a8e063)', fx: 'clouds', unlock: 2 },
  dawn_city:  { label: 'Ciudad al amanecer',  cat: 'Running', css: 'linear-gradient(135deg,#ff9966,#ff5e62)', fx: 'clouds', unlock: 5 },
  mountain:   { label: 'Ruta de montaña',     cat: 'Running', css: 'linear-gradient(135deg,#4ca1af,#2c3e50)', fx: 'clouds', unlock: 9 },
  trail:      { label: 'Sendero natural',     cat: 'Running', css: 'linear-gradient(135deg,#134e2a,#2db36b)', fx: 'clouds', unlock: 14 },
  marathon:   { label: 'Maratón urbana',      cat: 'Running', css: 'linear-gradient(135deg,#3a6073,#16222a)', fx: 'crowd', unlock: 22 },

  // ---- Deportes ----
  soccer:     { label: 'Campo de fútbol',     cat: 'Deportes', css: 'linear-gradient(135deg,#1d976c,#0b5e3c)', fx: 'crowd', unlock: 0 },
  basket:     { label: 'Cancha básquet',      cat: 'Deportes', css: 'linear-gradient(135deg,#c0763a,#6e3d18)', fx: 'lights', unlock: 4 },
  tennis:     { label: 'Cancha de tenis',     cat: 'Deportes', css: 'linear-gradient(135deg,#2980b9,#1b5276)', fx: 'none', unlock: 7 },
  pool:       { label: 'Piscina olímpica',    cat: 'Deportes', css: 'linear-gradient(135deg,#2bc0e4,#1565c0)', fx: 'bokeh', unlock: 10 },
  boxing:     { label: 'Ring de boxeo',       cat: 'Deportes', css: 'linear-gradient(135deg,#3a1c2b,#120a10)', fx: 'lights', unlock: 16 },
  mma:        { label: 'Octágono MMA',        cat: 'Deportes', css: 'linear-gradient(135deg,#41295a,#2f0743)', fx: 'lights', unlock: 24 },

  // ---- Bienestar ----
  yoga:       { label: 'Estudio de yoga',     cat: 'Bienestar', css: 'linear-gradient(135deg,#d9a7c7,#fffcdc)', fx: 'bokeh', unlock: 0 },
  beach:      { label: 'Playa tropical',      cat: 'Bienestar', css: 'linear-gradient(135deg,#2bc0e4,#eaecc6)', fx: 'clouds', unlock: 3 },
  mountains:  { label: 'Montañas',            cat: 'Bienestar', css: 'linear-gradient(135deg,#606c88,#3f4c6b)', fx: 'snow', unlock: 11 },
  forest:     { label: 'Bosque',              cat: 'Bienestar', css: 'linear-gradient(135deg,#0b3d2e,#1e7d4f)', fx: 'clouds', unlock: 6 },
  wellness:   { label: 'Centro wellness',     cat: 'Bienestar', css: 'linear-gradient(135deg,#3a7bd5,#00d2ff)', fx: 'bokeh', unlock: 18 },

  // ---- Legendario ----
  legend_gym: { label: 'Gym legendario',      cat: 'Legendario', css: 'linear-gradient(135deg,#b8860b,#ffd54f)', fx: 'rays', unlock: 40 },
  stadium:    { label: 'Estadio con fans',    cat: 'Legendario', css: 'linear-gradient(135deg,#1e3c72,#2a5298)', fx: 'crowd', unlock: 50 },
  champion:   { label: 'Escenario campeón',   cat: 'Legendario', css: 'linear-gradient(135deg,#f7971e,#ffd200)', fx: 'rays', unlock: 60 },
  olympia:    { label: 'Olympia Arena',       cat: 'Legendario', css: 'linear-gradient(135deg,#8e2de2,#4a00e0)', fx: 'rays', unlock: 75 },
  futuristic: { label: 'Centro futurista',    cat: 'Legendario', css: 'linear-gradient(135deg,#00c6ff,#0072ff)', fx: 'bokeh', unlock: 90 },
  fitcity:    { label: 'Ciudad fitness',      cat: 'Legendario', css: 'linear-gradient(135deg,#fc466b,#3f5efb)', fx: 'lights', unlock: 100 },
};

export function bgUnlocked(bg, level) {
  return level >= (bg?.unlock ?? 0);
}

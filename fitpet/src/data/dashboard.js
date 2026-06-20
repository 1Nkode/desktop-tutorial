/*
  Modular dashboard catalog. Each widget has metadata; layouts are ordered
  arrays of { id, size } where size is 'half' (1 col) or 'full' (2 cols).
  goalKey points at a stats.* goal the user can edit inline.
*/
export const WIDGET_META = {
  steps:    { label: 'Pasos', icon: '👣', size: 'full', goalKey: 'stepsGoal' },
  hr:       { label: 'Frecuencia cardíaca', icon: '❤️', size: 'half' },
  burned:   { label: 'Calorías quemadas', icon: '🔥', size: 'half' },
  consumed: { label: 'Calorías consumidas', icon: '🍎', size: 'full', goalKey: 'caloriesGoal' },
  water:    { label: 'Hidratación', icon: '💧', size: 'half', goalKey: 'waterGoal' },
  distance: { label: 'Distancia', icon: '📏', size: 'half' },
  active:   { label: 'Tiempo activo', icon: '⏱️', size: 'half', goalKey: 'activeGoal' },
  streak:   { label: 'Racha', icon: '🔥', size: 'half' },
  macros:   { label: 'Macros', icon: '🥗', size: 'full' },
  workouts: { label: 'Entrenamientos', icon: '🏋️', size: 'full' },
  meals:    { label: 'Comidas', icon: '🍽️', size: 'full' },
  weight:   { label: 'Peso corporal', icon: '⚖️', size: 'half', goalKey: 'weightGoal' },
  sleep:    { label: 'Sueño', icon: '😴', size: 'half', goalKey: 'sleepGoal' },
  stats:    { label: 'Estadísticas', icon: '📊', size: 'full' },
  goals:    { label: 'Progreso de objetivos', icon: '🎯', size: 'full' },
  pet:      { label: 'Estado de la mascota', icon: '🐸', size: 'full' },
};

export const ALL_WIDGETS = Object.keys(WIDGET_META);

const w = (id, size) => ({ id, size: size || WIDGET_META[id].size });

export const PRESETS = {
  general: [w('steps'), w('water'), w('burned'), w('pet'), w('streak'), w('sleep')],
  running: [w('steps'), w('distance'), w('hr'), w('burned'), w('active'), w('goals')],
  gym:     [w('workouts'), w('weight', 'half'), w('streak'), w('pet'), w('stats')],
  nutrition:[w('consumed'), w('macros'), w('water'), w('meals')],
};

export const PRESET_INFO = [
  { id: 'general', label: 'General', icon: '✨' },
  { id: 'running', label: 'Running', icon: '🏃' },
  { id: 'gym', label: 'Gym', icon: '🏋️' },
  { id: 'nutrition', label: 'Nutrición', icon: '🥗' },
];

export const DEFAULT_LAYOUT = PRESETS.general;

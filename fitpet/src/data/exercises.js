/* Exercise database grouped by muscle. Users can add custom ones too. */
export const MUSCLES = ['Pecho', 'Espalda', 'Pierna', 'Hombro', 'Brazo', 'Core', 'Cardio'];

export const EXERCISES = [
  { id: 'e1', name: 'Press de banca', muscle: 'Pecho', icon: '🏋️' },
  { id: 'e2', name: 'Press inclinado mancuerna', muscle: 'Pecho', icon: '🏋️' },
  { id: 'e3', name: 'Aperturas', muscle: 'Pecho', icon: '🦋' },
  { id: 'e4', name: 'Fondos', muscle: 'Pecho', icon: '💪' },
  { id: 'e5', name: 'Dominadas', muscle: 'Espalda', icon: '🧗' },
  { id: 'e6', name: 'Remo con barra', muscle: 'Espalda', icon: '🚣' },
  { id: 'e7', name: 'Jalón al pecho', muscle: 'Espalda', icon: '🪢' },
  { id: 'e8', name: 'Peso muerto', muscle: 'Espalda', icon: '🏋️' },
  { id: 'e9', name: 'Sentadilla', muscle: 'Pierna', icon: '🦵' },
  { id: 'e10', name: 'Prensa de pierna', muscle: 'Pierna', icon: '🦵' },
  { id: 'e11', name: 'Extensión de cuádriceps', muscle: 'Pierna', icon: '🦵' },
  { id: 'e12', name: 'Curl femoral', muscle: 'Pierna', icon: '🦵' },
  { id: 'e13', name: 'Elevación de gemelos', muscle: 'Pierna', icon: '🦶' },
  { id: 'e14', name: 'Press militar', muscle: 'Hombro', icon: '🏋️' },
  { id: 'e15', name: 'Elevaciones laterales', muscle: 'Hombro', icon: '🤸' },
  { id: 'e16', name: 'Pájaros', muscle: 'Hombro', icon: '🦅' },
  { id: 'e17', name: 'Curl de bíceps', muscle: 'Brazo', icon: '💪' },
  { id: 'e18', name: 'Curl martillo', muscle: 'Brazo', icon: '🔨' },
  { id: 'e19', name: 'Extensión de tríceps', muscle: 'Brazo', icon: '💪' },
  { id: 'e20', name: 'Press francés', muscle: 'Brazo', icon: '💪' },
  { id: 'e21', name: 'Plancha', muscle: 'Core', icon: '🧘' },
  { id: 'e22', name: 'Crunch abdominal', muscle: 'Core', icon: '🔥' },
  { id: 'e23', name: 'Elevación de piernas', muscle: 'Core', icon: '🔥' },
  { id: 'e24', name: 'Cinta de correr', muscle: 'Cardio', icon: '🏃' },
];

// Seed routine templates (exercise ids + default set count)
export const SEED_ROUTINES = [
  { id: 'rt1', name: 'Push 💥', items: [
    { exerciseId: 'e1', sets: 4 }, { exerciseId: 'e2', sets: 3 }, { exerciseId: 'e14', sets: 3 }, { exerciseId: 'e15', sets: 3 }, { exerciseId: 'e19', sets: 3 },
  ]},
  { id: 'rt2', name: 'Pull 🪢', items: [
    { exerciseId: 'e8', sets: 3 }, { exerciseId: 'e6', sets: 4 }, { exerciseId: 'e7', sets: 3 }, { exerciseId: 'e17', sets: 3 }, { exerciseId: 'e18', sets: 3 },
  ]},
  { id: 'rt3', name: 'Pierna 🦵', items: [
    { exerciseId: 'e9', sets: 4 }, { exerciseId: 'e10', sets: 3 }, { exerciseId: 'e12', sets: 3 }, { exerciseId: 'e13', sets: 4 }, { exerciseId: 'e21', sets: 3 },
  ]},
];

// estimated 1-rep max (Epley)
export const e1rm = (weight, reps) => Math.round((weight || 0) * (1 + (reps || 0) / 30));

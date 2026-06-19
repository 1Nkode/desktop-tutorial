import { create } from 'zustand';

// ---- Seed data (mirrors the Stitch FitPet designs) ----

const initialPet = {
  name: 'Gym Titan',
  level: 42,
  title: 'Beast',
  xp: 680,
  xpToNext: 1000,
  mood: 'motivada', // feliz, motivada, cansada, triste
  physique: 'fuerte', // normal, fit, fuerte, sedentario
  streak: 7,
};

const seedMeals = [
  { id: 1, slot: 'Desayuno', icon: '🍳', name: 'Tostada de Aguacate y Huevo', detail: '1 porción · 15g Proteína', kcal: 420, img: '🥑' },
  { id: 2, slot: 'Almuerzo', icon: '☀️', name: 'Salmón con Brócoli y Arroz', detail: '450g · 42g Proteína', kcal: 680, img: '🍣' },
  { id: 3, slot: 'Snacks', icon: '🌙', name: 'Mix de Frutos Secos', detail: '30g · 5g Proteína', kcal: 150, img: '🥜' },
];

const seedWorkouts = [
  { id: 1, type: 'Running', detail: 'Outdoor Track', icon: '🏃', duration: 35, calories: 320, rpe: 8, date: 'Hoy, 7:30' },
  { id: 2, type: 'Weightlifting', detail: 'Strength Training', icon: '🏋️', duration: 60, calories: 380, rpe: 9, date: 'Ayer, 18:00' },
  { id: 3, type: 'Cycling', detail: 'Road Trip', icon: '🚴', duration: 50, calories: 420, rpe: 6, date: 'Hace 2 días' },
];

const seedFeed = [
  {
    id: 1, user: 'Carlos & Rex', avatar: '🐶', tag: 'Hace 2 horas · Entrenamiento',
    type: 'workout', text: '¡5K hoy! Rex no me dejó parar 🐕 La ruta nocturna es lo mejor. #fresca7',
    stat: '5.2 km · 28 min', likes: 154, comments: 12, liked: false,
  },
  {
    id: 2, user: 'Sofía', avatar: '🥗', tag: 'Hace 3 horas · Nutrición',
    type: 'meal', text: 'Bowl Post-Entreno "Green Power" 💪 Meal para recuperar energía después de una caminata intensa.',
    macro: { p: '24g', c: '12g', f: '45g' }, likes: 98, comments: 7, liked: true,
  },
  {
    id: 3, user: 'Luna & Max', avatar: '🐱', tag: 'Hace 5 horas · Logro',
    type: 'achievement', text: '¡Racha de 7 días desbloqueada! Mi mascota subió a nivel Beast 🏆',
    likes: 212, comments: 24, liked: false,
  },
];

const seedMissions = [
  { id: 1, title: 'Guerrero Madrugador', desc: 'Entrena antes de las 10am', xp: 50, done: true, icon: '🌅' },
  { id: 2, title: 'Héroe de Hidratación', desc: 'Bebe 8 vasos de agua', xp: 20, done: true, icon: '💧' },
  { id: 3, title: 'Maestro de Pasos', desc: 'Camina 10,000 pasos', xp: 40, done: false, progress: 7820, total: 10000, icon: '👟' },
  { id: 4, title: 'Contador de Calorías', desc: 'Registra tus 3 comidas', xp: 30, done: false, progress: 2, total: 3, icon: '🍎' },
];

const seedDevices = [
  { id: 1, name: 'Fitbit Air', tag: 'PRO', sn: 'SN: 4492-FK-99', connected: true, icon: '⌚' },
  { id: 2, name: 'Apple Watch', tag: '', sn: 'Señal débil', connected: false, icon: '⌚' },
];

export const useStore = create((set, get) => ({
  user: {
    name: '1Nk',
    handle: 'wryzt4gkqd@privaterelay.appleid.com',
    account: 'Gratuita',
    weight: 67.2,
    calsIn: 2359,
    calsOut: 186,
    notifications: 51,
    followers: 128,
    following: 94,
  },

  goals: {
    kcalGoal: 2400,
    proteinGoal: 150,
    carbsGoal: 220,
    fatGoal: 70,
    fiberGoal: 30,
    stepsGoal: 10000,
  },

  stats: {
    steps: 7820,
    activeMinutes: 85,
    weeklyActivity: [3, 5, 4, 6, 2, 4, 0],
    hrZones: [
      { zone: 'Zona 4: Anaeróbico', time: '12:30', pct: 0.7, color: '#CCFF00' },
      { zone: 'Zona 3: Aeróbico', time: '24:45', pct: 0.55, color: '#8A8AFF' },
      { zone: 'Zona 2: Quema Grasa', time: '05:00', pct: 0.25, color: '#FFA38A' },
    ],
  },

  pet: initialPet,
  meals: seedMeals,
  workouts: seedWorkouts,
  feed: seedFeed,
  missions: seedMissions,
  devices: seedDevices,

  // Active workout session
  session: { active: false, seconds: 2613, bpm: 142, calories: 312, rpe: 8 },

  // ---- Actions ----
  toggleLike: (postId) => set((s) => ({
    feed: s.feed.map((p) =>
      p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ),
  })),

  addMeal: (meal) => set((s) => ({
    meals: [{ ...meal, id: Date.now() }, ...s.meals],
  })),

  addWorkout: (w) => set((s) => {
    const pet = { ...s.pet, xp: Math.min(s.pet.xp + 25, s.pet.xpToNext) };
    return { workouts: [{ ...w, id: Date.now(), date: 'Justo ahora' }, ...s.workouts], pet };
  }),

  setRpe: (rpe) => set((s) => ({ session: { ...s.session, rpe } })),

  toggleDevice: (id) => set((s) => ({
    devices: s.devices.map((d) => (d.id === id ? { ...d, connected: !d.connected } : d)),
  })),

  completeMission: (id) => set((s) => {
    const m = s.missions.find((x) => x.id === id);
    if (!m || m.done) return {};
    return {
      missions: s.missions.map((x) => (x.id === id ? { ...x, done: true } : x)),
      pet: { ...s.pet, xp: Math.min(s.pet.xp + m.xp, s.pet.xpToNext) },
    };
  }),

  // Derived helpers
  consumedKcal: () => get().meals.reduce((sum, m) => sum + m.kcal, 0),
}));

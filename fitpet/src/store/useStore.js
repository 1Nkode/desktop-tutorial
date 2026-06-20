import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EXERCISES, SEED_ROUTINES, e1rm } from '../data/exercises';
import { DEFAULT_LAYOUT, PRESETS, WIDGET_META } from '../data/dashboard';

const seedRoutines = () => SEED_ROUTINES.map(r => ({ ...r, items: r.items.map(i => ({ ...i })) }));

// Pull the last logged sets for an exercise from history (for prefilling + "previous")
function lastSetsFor(history, exerciseId) {
  for (const session of history) {
    const ex = session.exercises.find(e => {
      const all = EXERCISES;
      const match = all.find(a => a.id === exerciseId);
      return e.name === (match?.name) || e.exerciseId === exerciseId;
    });
    if (ex) return ex.sets;
  }
  return [];
}

const initialStats = {
  caloriesConsumed: 1050,
  caloriesGoal: 2000,
  caloriesBurned: 700,
  steps: 7820,
  stepsGoal: 10000,
  activeMinutes: 85,
  activeGoal: 60,
  water: 6,
  waterGoal: 8,
  weight: 75,
  weightGoal: 72,
  sleep: 7.4,
  sleepGoal: 8,
  weeklyWorkouts: [3, 5, 4, 6, 2, 4, 0],
  weeklyCalories: [1800, 2100, 1950, 2200, 1750, 1900, 1050],
};

const basepet = {
  name: 'Sparky',
  level: 1,
  xp: 0,
  xpToNext: 100,
  mood: 'happy', // happy, motivated, tired, sad
  physique: 'normal', // normal, fit, strong, chubby
  accessories: ['bandana'],
  streak: 3,
  energy: 80,       // 0-100, restored by feeding / rest
  motivation: 75,   // 0-100, restored by playing / training
  cleanliness: 90,  // 0-100, decays over time, restored by bathing
  species: 'frog',  // frog/dog/cat/bear/panda/rabbit/fox/penguin/turtle/lion
  variant: 'natural',
  color: null,      // optional body-color override
  colors: {},       // optional per-part overrides: body, belly, eyes, accent
  background: 'default',
  outfit: { hat: 'none', top: 'polo-blue', bottom: 'none' }, // equippable clothes
  fitness: 60,      // 0-100 slow-moving condition score (drives physique)
  lastEvalDay: null,// last calendar day the fitness score was nudged
};

const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));
const todayKey = () => new Date().toISOString().slice(0, 10);

const mockFeed = [
  {
    id: 1,
    user: 'Maria G.',
    avatar: '🏃‍♀️',
    type: 'workout',
    content: 'Completed 5K run in 28 min! 🔥',
    calories: 320,
    likes: 24,
    comments: [
      { id: 1, user: 'Carlos M.', text: 'Beast! 🔥' },
      { id: 2, user: 'Ana P.', text: 'Great pace 👏' },
    ],
    time: '2h ago',
    liked: false,
  },
  {
    id: 2,
    user: 'Carlos M.',
    avatar: '💪',
    type: 'meal',
    content: 'Healthy lunch: grilled chicken + quinoa + avocado 🥑',
    calories: 480,
    likes: 18,
    comments: [{ id: 1, user: 'Sofia V.', text: 'Looks delicious!' }],
    time: '3h ago',
    liked: true,
  },
  {
    id: 3,
    user: 'Ana P.',
    avatar: '🧘‍♀️',
    type: 'achievement',
    content: 'Hit my 7-day streak! Consistency is key 🏆',
    likes: 42,
    comments: [
      { id: 1, user: 'Maria G.', text: 'So inspiring 🙌' },
      { id: 2, user: 'Luis R.', text: 'Keep it up!' },
    ],
    time: '5h ago',
    liked: false,
  },
  {
    id: 4,
    user: 'Luis R.',
    avatar: '🏋️',
    type: 'workout',
    content: 'Back day done! 4 sets deadlifts, rows, pull-ups 💥',
    calories: 450,
    likes: 31,
    comments: [],
    time: '6h ago',
    liked: false,
  },
  {
    id: 5,
    user: 'Sofia V.',
    avatar: '🌿',
    type: 'meal',
    content: 'Post-workout smoothie: banana, oats, protein, almond milk 🥤',
    calories: 340,
    likes: 15,
    comments: [],
    time: '7h ago',
    liked: false,
  },
];

// Add Instagram-style fields (image, saved, comment replies) to seed posts
const POST_IMG = {
  1: 'https://picsum.photos/seed/run5k/600/600',
  2: 'https://picsum.photos/seed/healthylunch/600/600',
  4: 'https://picsum.photos/seed/backday/600/600',
  5: 'https://picsum.photos/seed/smoothie/600/600',
};
function enrichFeed(list) {
  return list.map(p => ({
    ...p,
    image: POST_IMG[p.id] || null,
    saved: false,
    comments: p.comments.map(c => ({ ...c, replies: c.replies || [] })),
  }));
}

const mockStories = [
  { id: 's1', user: 'Maria G.', avatar: '🏃‍♀️', seen: false, items: [
    { kind: 'workout', text: 'Run matutino 🏃‍♀️', image: 'https://picsum.photos/seed/story1/500/900' },
    { kind: 'pr', text: 'Nuevo PR 5K: 27:40 🏆', image: 'https://picsum.photos/seed/story1b/500/900' },
  ]},
  { id: 's2', user: 'Carlos M.', avatar: '💪', seen: false, items: [
    { kind: 'meal', text: 'Meal prep del domingo 🍱', image: 'https://picsum.photos/seed/story2/500/900' },
  ]},
  { id: 's3', user: 'Ana P.', avatar: '🧘‍♀️', seen: false, items: [
    { kind: 'poll', text: '¿Yoga o pesas hoy?', options: ['Yoga 🧘', 'Pesas 🏋️'] },
  ]},
  { id: 's4', user: 'Luis R.', avatar: '🏋️', seen: true, items: [
    { kind: 'progress', text: 'Semana 8 💥', image: 'https://picsum.photos/seed/story4/500/900' },
  ]},
  { id: 's5', user: 'Sofia V.', avatar: '🌿', seen: true, items: [
    { kind: 'meal', text: 'Smoothie verde 🥤', image: 'https://picsum.photos/seed/story5/500/900' },
  ]},
];

// Hevy-style friend activity feed
const mockFriendActivity = [
  { id: 'a1', user: 'Maria G.', avatar: '🏃‍♀️', kind: 'workout', text: 'completó Push Day', detail: '5 ejercicios · 18 series · 4.2t', time: 'hace 25 min' },
  { id: 'a2', user: 'Carlos M.', avatar: '💪', kind: 'pr', text: 'consiguió un nuevo PR en Press de banca', detail: '100kg × 5', time: 'hace 1h' },
  { id: 'a3', user: 'Ana P.', avatar: '🧘‍♀️', kind: 'streak', text: 'lleva 14 días de racha', detail: '🔥 ¡imparable!', time: 'hace 2h' },
  { id: 'a4', user: 'Luis R.', avatar: '🏋️', kind: 'pet', text: 'evolucionó su rana a nivel Fuerte', detail: '🐸 Lv.12', time: 'hace 3h' },
  { id: 'a5', user: 'Sofia V.', avatar: '🌿', kind: 'achievement', text: 'desbloqueó la insignia "Clean Eater"', detail: '🥗 7 días saludables', time: 'hace 5h' },
  { id: 'a6', user: 'Maria G.', avatar: '🏃‍♀️', kind: 'challenge', text: 'completó el reto 10K Steps', detail: '🏆 +200 XP', time: 'hace 6h' },
];

// Users you can discover & follow
const mockDiscover = [
  { name: 'Maria G.', avatar: '🏃‍♀️', bio: 'Runner · 5K en 27:40', followers: '12.4k' },
  { name: 'Carlos M.', avatar: '💪', bio: 'Powerlifter · Bench 100kg', followers: '8.1k' },
  { name: 'Ana P.', avatar: '🧘‍♀️', bio: 'Yoga & movilidad', followers: '5.6k' },
  { name: 'Luis R.', avatar: '🏋️', bio: 'Hipertrofia · Push/Pull/Legs', followers: '3.2k' },
  { name: 'Sofia V.', avatar: '🌿', bio: 'Nutrición basada en plantas', followers: '2.9k' },
  { name: 'Diego F.', avatar: '🚴', bio: 'Ciclismo & cardio', followers: '1.8k' },
  { name: 'Lucia T.', avatar: '🤸', bio: 'Calistenia', followers: '1.1k' },
];

const mockNotifications = [
  { id: 1, icon: '❤️', text: 'Maria G. liked your workout', time: '5m ago', read: false },
  { id: 2, icon: '💬', text: 'Carlos M. commented: "Nice gains!"', time: '20m ago', read: false },
  { id: 3, icon: '🏆', text: 'You earned the "Iron Will" badge!', time: '1h ago', read: false },
  { id: 4, icon: '👥', text: 'Ana P. started following you', time: '3h ago', read: true },
  { id: 5, icon: '🔥', text: 'You hit a 12-day streak — keep going!', time: '1d ago', read: true },
];

const mockMissions = [
  { id: 1, title: 'Morning Warrior', desc: 'Complete a workout before 10am', xp: 50, done: true, icon: '🌅' },
  { id: 2, title: 'Hydration Hero', desc: 'Drink 8 glasses of water', xp: 20, done: true, icon: '💧' },
  { id: 3, title: 'Step Master', desc: 'Walk 10,000 steps today', xp: 40, done: false, progress: 7820, total: 10000, icon: '👟' },
  { id: 4, title: 'Calorie Counter', desc: 'Log all 3 meals today', xp: 30, done: false, progress: 2, total: 3, icon: '🍎' },
  { id: 5, title: 'Social Butterfly', desc: 'Like 5 posts from friends', xp: 15, done: false, progress: 3, total: 5, icon: '❤️' },
];

const mockBadges = [
  { id: 1, icon: '🔥', name: 'First Burn', desc: 'First workout logged', earned: true },
  { id: 2, icon: '🏃', name: 'Road Runner', desc: '10 cardio sessions', earned: true },
  { id: 3, icon: '💪', name: 'Iron Will', desc: '20 strength sessions', earned: true },
  { id: 4, icon: '🥗', name: 'Clean Eater', desc: '7 days healthy meals', earned: true },
  { id: 5, icon: '🌟', name: 'All-Star', desc: 'Reach level 10', earned: false },
  { id: 6, icon: '⚡', name: 'Lightning', desc: '30-day streak', earned: false },
  { id: 7, icon: '🏆', name: 'Champion', desc: 'Win a weekly challenge', earned: false },
  { id: 8, icon: '🦁', name: 'Beast Mode', desc: '50 workouts total', earned: false },
];

const mockWorkouts = [
  { id: 1, type: 'Running', duration: 35, calories: 320, intensity: 'High', icon: '🏃', date: 'Today, 7:30am' },
  { id: 2, type: 'Weight Training', duration: 60, calories: 380, intensity: 'High', icon: '🏋️', date: 'Yesterday, 6pm' },
  { id: 3, type: 'Yoga', duration: 45, calories: 180, intensity: 'Low', icon: '🧘', date: '2 days ago' },
  { id: 4, type: 'Cycling', duration: 50, calories: 420, intensity: 'Medium', icon: '🚴', date: '3 days ago' },
];

const mockMeals = [
  { id: 1, name: 'Oatmeal + Berries', calories: 380, protein: 12, carbs: 68, fat: 8, time: 'Breakfast', icon: '🥣' },
  { id: 2, name: 'Grilled Chicken Salad', calories: 450, protein: 42, carbs: 18, fat: 14, time: 'Lunch', icon: '🥗' },
  { id: 3, name: 'Protein Shake', calories: 220, protein: 28, carbs: 22, fat: 4, time: 'Snack', icon: '🥤' },
];

// Derives the pet's physique and mood from the user's real activity data.
// physique: based on net calorie balance + workout consistency over the week.
// mood: based on how close the user is to their daily goals + streak.
// Physique evolves SLOWLY: a smoothed "fitness" score (0-100) drifts a small
// amount once per calendar day toward the user's recent activity. Physique is
// just a band on that score, so it takes weeks of sustained habits to change
// — not a few good/bad days.
//   strong   fitness >= 82   (weeks/months of consistency — a real reward)
//   normal   48 .. 82        (default for most users)
//   fit      24 .. 48        (skinny — several weeks of decline)
//   chubby   < 24            (months of prolonged inactivity)
export function evolvePet(pet, stats) {
  const stepRatio = stats.steps / stats.stepsGoal;
  const activeRatio = stats.activeMinutes / stats.activeGoal;
  const calorieRatio = stats.caloriesConsumed / stats.caloriesGoal;
  const workoutDays = stats.weeklyWorkouts.filter(v => v > 0).length;

  let fitness = pet.fitness ?? 60;
  const today = new Date().toISOString().slice(0, 10);

  // Only nudge once per day so repeated interactions don't move it.
  if (pet.lastEvalDay !== today) {
    const activity = (
      Math.min(workoutDays / 5, 1) +
      Math.min(stepRatio, 1) +
      Math.min(activeRatio, 1) +
      Math.min((pet.streak ?? 0) / 14, 1)
    ) / 4; // 0..1
    // around 0.45 = maintenance; above gains, below loses (slowly, capped)
    const nudge = Math.max(-1, Math.min(1.6, (activity - 0.45) * 3.2));
    fitness = Math.max(0, Math.min(100, fitness + nudge));
  }

  let physique;
  if (fitness >= 82) physique = 'strong';
  else if (fitness >= 48) physique = 'normal';
  else if (fitness >= 24) physique = 'fit';      // leaner / declining
  else physique = 'chubby';                       // prolonged abandonment

  // Mood stays responsive day-to-day (it's just an expression, not the body).
  const goalScore = (Math.min(calorieRatio, 1) + Math.min(stepRatio, 1) + Math.min(activeRatio, 1)) / 3;
  let mood;
  if (fitness >= 82 && goalScore >= 0.6) mood = 'motivated';
  else if (goalScore >= 0.55) mood = 'happy';
  else if (workoutDays === 0 && stepRatio < 0.4) mood = 'sad';
  else mood = 'tired';

  return { ...pet, physique, mood, fitness, lastEvalDay: today };
}

// High-level evolution state shown in the UI (driven by the slow fitness band).
// base · strong · neglected · tired · champion
export function petState(pet) {
  const fitness = pet.fitness ?? 60;
  if (pet.level >= 20 || fitness >= 94) return 'champion';  // legendary reward
  if (pet.physique === 'strong') return 'strong';
  if (pet.physique === 'chubby') return 'neglected';        // gordito (prolonged)
  if (pet.physique === 'fit') return 'tired';               // skinny (declining)
  return 'base';                                            // normal (default)
}

// Pet reacts to eating habits: on-target boosts motivation, big overshoot
// lowers it (so the avatar celebrates good days and nudges on bad ones).
function nutritionReact(pet, stats) {
  const ratio = stats.caloriesConsumed / stats.caloriesGoal;
  let motivation = pet.motivation ?? 75;
  if (ratio > 1.25) motivation = Math.max(0, motivation - 8);        // big overshoot
  else if (ratio >= 0.8 && ratio <= 1.05) motivation = Math.min(100, motivation + 6); // on target
  return { ...pet, motivation };
}

// Pet happiness (0-100) derived from care + real habits.
export function petHappiness(pet, stats) {
  const goalScore = Math.min(stats.steps / stats.stepsGoal, 1) * 100;
  const h = (pet.motivation ?? 75) * 0.4 + (pet.energy ?? 80) * 0.2
    + (pet.cleanliness ?? 90) * 0.2 + goalScore * 0.2;
  return Math.round(Math.max(0, Math.min(100, h)));
}

// Applies XP and rolls over into new levels when the bar fills.
function applyXp(pet, amount) {
  let xp = pet.xp + amount;
  let level = pet.level;
  let xpToNext = pet.xpToNext;
  while (xp >= xpToNext) {
    xp -= xpToNext;
    level += 1;
    xpToNext = Math.round(xpToNext * 1.25); // each level needs 25% more XP
  }
  return { ...pet, xp, level, xpToNext };
}

export const useStore = create(persist((set, get) => ({
  // User
  user: {
    name: 'Alex',
    username: 'alex_fit',
    bio: 'En camino a mi mejor versión 🐸',
    goal: 'Ganar músculo 💪',
    avatar: '😄',           // emoji or a data: URL photo
    level: 7,
    xp: 680,
    xpToNext: 1000,
    followers: 128,
    following: 94,
    streak: 12,
    privacy: { showStats: true, showWorkouts: true },
  },

  updateProfile: (patch) => set((state) => ({ user: { ...state.user, ...patch } })),

  // ---------- Customizable dashboard ----------
  dashboardLayout: DEFAULT_LAYOUT.map(w => ({ ...w })),
  dashboardTemplates: {},

  addDashWidget: (id) => set((state) => state.dashboardLayout.some(w => w.id === id) ? {} : ({
    dashboardLayout: [...state.dashboardLayout, { id, size: WIDGET_META[id]?.size || 'half' }],
  })),
  removeDashWidget: (id) => set((state) => ({
    dashboardLayout: state.dashboardLayout.filter(w => w.id !== id),
  })),
  moveDashWidget: (index, dir) => set((state) => {
    const arr = [...state.dashboardLayout];
    const j = index + dir;
    if (j < 0 || j >= arr.length) return {};
    [arr[index], arr[j]] = [arr[j], arr[index]];
    return { dashboardLayout: arr };
  }),
  resizeDashWidget: (id) => set((state) => ({
    dashboardLayout: state.dashboardLayout.map(w => w.id === id ? { ...w, size: w.size === 'full' ? 'half' : 'full' } : w),
  })),
  applyDashPreset: (name) => set(() => ({
    dashboardLayout: (PRESETS[name] || DEFAULT_LAYOUT).map(w => ({ ...w })),
  })),
  saveDashTemplate: (name) => set((state) => ({
    dashboardTemplates: { ...state.dashboardTemplates, [name]: state.dashboardLayout.map(w => ({ ...w })) },
  })),
  applyDashTemplate: (name) => set((state) => ({
    dashboardLayout: (state.dashboardTemplates[name] || state.dashboardLayout).map(w => ({ ...w })),
  })),
  deleteDashTemplate: (name) => set((state) => {
    const t = { ...state.dashboardTemplates }; delete t[name];
    return { dashboardTemplates: t };
  }),

  // Health stats
  stats: initialStats,

  // Pet — derived from the starting stats so it's consistent on first load
  pet: evolvePet(basepet, initialStats),

  // Content
  feed: enrichFeed(mockFeed),
  stories: mockStories,
  following: ['Maria G.', 'Ana P.'],
  friendActivity: mockFriendActivity,
  discoverUsers: mockDiscover,
  missions: mockMissions,
  badges: mockBadges,
  workouts: mockWorkouts,
  meals: mockMeals,
  notifications: mockNotifications,

  // Settings
  settings: {
    units: 'metric',          // metric | imperial
    notificationsEnabled: true,
    autoSync: true,
    sound: true,
    autoShareWorkout: true,   // auto-post completed workouts to the feed
  },

  // UI (transient — not persisted)
  activeTab: 'dashboard',
  showAddWorkout: false,
  showAddMeal: false,
  showAddWater: false,
  showAddPost: false,
  showNotifications: false,
  showSettings: false,
  commentsFor: null,         // postId whose comments are open

  setActiveTab: (tab) => set({ activeTab: tab }),
  setShowAddWorkout: (val) => set({ showAddWorkout: val }),
  setShowAddMeal: (val) => set({ showAddMeal: val }),
  setShowAddWater: (val) => set({ showAddWater: val }),
  setShowAddPost: (val) => set({ showAddPost: val }),
  setShowNotifications: (val) => set({ showNotifications: val }),
  setShowSettings: (val) => set({ showSettings: val }),
  setCommentsFor: (postId) => set({ commentsFor: postId }),

  toggleLike: (postId) => set((state) => ({
    feed: state.feed.map(p =>
      p.id === postId
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ),
  })),

  addComment: (postId, text) => set((state) => ({
    feed: state.feed.map(p =>
      p.id === postId
        ? { ...p, comments: [...p.comments, { id: Date.now(), user: state.user.name, text, replies: [] }] }
        : p
    ),
  })),

  addReply: (postId, commentId, text) => set((state) => ({
    feed: state.feed.map(p =>
      p.id !== postId ? p : {
        ...p,
        comments: p.comments.map(c => c.id !== commentId ? c : {
          ...c, replies: [...(c.replies || []), { id: Date.now(), user: state.user.name, text }],
        }),
      }
    ),
  })),

  toggleSave: (postId) => set((state) => ({
    feed: state.feed.map(p => p.id === postId ? { ...p, saved: !p.saved } : p),
  })),

  toggleFollow: (name) => set((state) => ({
    following: state.following.includes(name)
      ? state.following.filter(n => n !== name)
      : [...state.following, name],
  })),

  markStorySeen: (id) => set((state) => ({
    stories: state.stories.map(s => s.id === id ? { ...s, seen: true } : s),
  })),

  addPost: (post) => set((state) => {
    const newPost = {
      id: Date.now(),
      user: state.user.name,
      avatar: state.user.avatar,
      liked: false,
      likes: 0,
      comments: [],
      saved: false,
      time: 'Just now',
      petLevel: state.pet.level,   // the frog rides along on your posts
      ...post,
    };
    return { feed: [newPost, ...state.feed] };
  }),

  addWorkout: (workout) => set((state) => {
    const newWorkout = { ...workout, id: Date.now(), date: 'Just now' };
    // Mark today (last slot) as an active day for the weekly evolution.
    const weeklyWorkouts = [...state.stats.weeklyWorkouts];
    weeklyWorkouts[weeklyWorkouts.length - 1] += 1;
    const newStats = {
      ...state.stats,
      caloriesBurned: state.stats.caloriesBurned + workout.calories,
      activeMinutes: state.stats.activeMinutes + workout.duration,
      weeklyWorkouts,
    };
    const boosted = { ...state.pet, motivation: clamp(state.pet.motivation + 12), energy: clamp(state.pet.energy + 6) };
    const newPet = evolvePet(applyXp(boosted, 25), newStats);
    return { workouts: [newWorkout, ...state.workouts], stats: newStats, pet: newPet };
  }),

  addMeal: (meal) => set((state) => {
    const newMeal = { ...meal, id: Date.now() };
    const newStats = {
      ...state.stats,
      caloriesConsumed: state.stats.caloriesConsumed + meal.calories,
    };
    const newPet = nutritionReact(evolvePet(state.pet, newStats), newStats);
    return { meals: [newMeal, ...state.meals], stats: newStats, pet: newPet };
  }),

  // Nutrition diary
  favorites: [],
  customFoods: [],
  recipes: [],

  // Add a food (already scaled) to the diary under a meal type
  addFoodToDiary: (entry) => set((state) => {
    const newMeal = {
      id: Date.now(),
      name: entry.name,
      icon: entry.icon || '🍽️',
      time: entry.mealType || 'Snack',
      calories: entry.calories,
      protein: entry.protein,
      carbs: entry.carbs,
      fat: entry.fat,
      fiber: entry.fiber || 0,
      servings: entry.servings || 1,
    };
    const newStats = { ...state.stats, caloriesConsumed: state.stats.caloriesConsumed + entry.calories };
    const newPet = nutritionReact(evolvePet(state.pet, newStats), newStats);
    return { meals: [newMeal, ...state.meals], stats: newStats, pet: newPet };
  }),

  removeMeal: (id) => set((state) => {
    const meal = state.meals.find(m => m.id === id);
    if (!meal) return {};
    const newStats = { ...state.stats, caloriesConsumed: Math.max(0, state.stats.caloriesConsumed - meal.calories) };
    return { meals: state.meals.filter(m => m.id !== id), stats: newStats, pet: evolvePet(state.pet, newStats) };
  }),

  toggleFavorite: (food) => set((state) => {
    const exists = state.favorites.find(f => f.id === food.id);
    return { favorites: exists ? state.favorites.filter(f => f.id !== food.id) : [{ ...food }, ...state.favorites] };
  }),

  addCustomFood: (food) => set((state) => ({
    customFoods: [{ ...food, id: 'c' + Date.now(), custom: true }, ...state.customFoods],
  })),

  addRecipe: (recipe) => set((state) => ({
    recipes: [{ ...recipe, id: 'r' + Date.now(), recipe: true }, ...state.recipes],
  })),

  // ---------- Strength training (Hevy-style) ----------
  routines: seedRoutines(),
  customExercises: [],
  workoutHistory: [],
  personalRecords: {},      // exerciseId -> { e1rm, weight, reps, date }
  activeWorkout: null,      // { name, startedAt, exercises:[{exerciseId,name,muscle,icon,note,sets:[{weight,reps,done}]}], note }
  lastPR: null,             // transient: name of exercise that just hit a PR

  addCustomExercise: (ex) => set((state) => ({
    customExercises: [{ ...ex, id: 'cx' + Date.now(), custom: true }, ...state.customExercises],
  })),

  saveRoutine: (routine) => set((state) => {
    if (routine.id && state.routines.find(r => r.id === routine.id)) {
      return { routines: state.routines.map(r => r.id === routine.id ? { ...routine } : r) };
    }
    return { routines: [{ ...routine, id: 'rt' + Date.now() }, ...state.routines] };
  }),

  duplicateRoutine: (id) => set((state) => {
    const r = state.routines.find(x => x.id === id);
    if (!r) return {};
    return { routines: [{ ...r, id: 'rt' + Date.now(), name: r.name + ' (copia)' }, ...state.routines] };
  }),

  deleteRoutine: (id) => set((state) => ({ routines: state.routines.filter(r => r.id !== id) })),

  // Start a session from a routine (or empty). Pre-fills sets from last time.
  startWorkout: (routine) => set((state) => {
    const allEx = [...EXERCISES, ...state.customExercises];
    const exercises = (routine?.items || []).map(it => {
      const ex = allEx.find(e => e.id === it.exerciseId) || { id: it.exerciseId, name: 'Ejercicio', muscle: '', icon: '🏋️' };
      const prev = lastSetsFor(state.workoutHistory, ex.id);
      const sets = Array.from({ length: it.sets || 3 }).map((_, i) => ({
        weight: prev[i]?.weight ?? '', reps: prev[i]?.reps ?? '', done: false,
      }));
      return { exerciseId: ex.id, name: ex.name, muscle: ex.muscle, icon: ex.icon, note: '', sets };
    });
    return { activeWorkout: { name: routine?.name || 'Entrenamiento', startedAt: Date.now(), exercises, note: '' } };
  }),

  addExerciseToWorkout: (ex) => set((state) => {
    if (!state.activeWorkout) return {};
    const prev = lastSetsFor(state.workoutHistory, ex.id);
    const sets = Array.from({ length: 3 }).map((_, i) => ({ weight: prev[i]?.weight ?? '', reps: prev[i]?.reps ?? '', done: false }));
    return { activeWorkout: { ...state.activeWorkout, exercises: [...state.activeWorkout.exercises, { exerciseId: ex.id, name: ex.name, muscle: ex.muscle, icon: ex.icon, note: '', sets }] } };
  }),

  updateSet: (exIdx, setIdx, field, value) => set((state) => {
    const w = state.activeWorkout; if (!w) return {};
    const exercises = w.exercises.map((e, i) => i !== exIdx ? e : {
      ...e, sets: e.sets.map((s, j) => j !== setIdx ? s : { ...s, [field]: value }),
    });
    return { activeWorkout: { ...w, exercises } };
  }),

  toggleSetDone: (exIdx, setIdx) => set((state) => {
    const w = state.activeWorkout; if (!w) return {};
    const exercises = w.exercises.map((e, i) => i !== exIdx ? e : {
      ...e, sets: e.sets.map((s, j) => j !== setIdx ? s : { ...s, done: !s.done }),
    });
    return { activeWorkout: { ...w, exercises } };
  }),

  addSet: (exIdx) => set((state) => {
    const w = state.activeWorkout; if (!w) return {};
    const exercises = w.exercises.map((e, i) => {
      if (i !== exIdx) return e;
      const last = e.sets[e.sets.length - 1];
      return { ...e, sets: [...e.sets, { weight: last?.weight ?? '', reps: last?.reps ?? '', done: false }] };
    });
    return { activeWorkout: { ...w, exercises } };
  }),

  removeSet: (exIdx, setIdx) => set((state) => {
    const w = state.activeWorkout; if (!w) return {};
    const exercises = w.exercises.map((e, i) => i !== exIdx ? e : { ...e, sets: e.sets.filter((_, j) => j !== setIdx) });
    return { activeWorkout: { ...w, exercises } };
  }),

  setExerciseNote: (exIdx, note) => set((state) => {
    const w = state.activeWorkout; if (!w) return {};
    return { activeWorkout: { ...w, exercises: w.exercises.map((e, i) => i === exIdx ? { ...e, note } : e) } };
  }),

  setWorkoutNote: (note) => set((state) => state.activeWorkout ? ({ activeWorkout: { ...state.activeWorkout, note } }) : {}),

  moveExercise: (exIdx, dir) => set((state) => {
    const w = state.activeWorkout; if (!w) return {};
    const arr = [...w.exercises];
    const j = exIdx + dir;
    if (j < 0 || j >= arr.length) return {};
    [arr[exIdx], arr[j]] = [arr[j], arr[exIdx]];
    return { activeWorkout: { ...w, exercises: arr } };
  }),

  removeExerciseFromWorkout: (exIdx) => set((state) => {
    const w = state.activeWorkout; if (!w) return {};
    return { activeWorkout: { ...w, exercises: w.exercises.filter((_, i) => i !== exIdx) } };
  }),

  cancelWorkout: () => set({ activeWorkout: null }),

  finishWorkout: () => set((state) => {
    const w = state.activeWorkout;
    if (!w) return {};
    const durationMin = Math.max(1, Math.round((Date.now() - w.startedAt) / 60000));
    let volume = 0, totalReps = 0, doneSets = 0;
    const prs = { ...state.personalRecords };
    let prHit = null;
    const prNames = [];

    const exercises = w.exercises.map(e => {
      const sets = e.sets.filter(s => s.done && (s.weight !== '' || s.reps !== ''));
      let exPR = null;
      sets.forEach(s => {
        const wt = +s.weight || 0, rp = +s.reps || 0;
        volume += wt * rp; totalReps += rp; doneSets++;
        const est = e1rm(wt, rp);
        const cur = prs[e.exerciseId];
        if (!cur || est > cur.e1rm) { prs[e.exerciseId] = { e1rm: est, weight: wt, reps: rp, date: Date.now() }; if (est > (cur?.e1rm || 0) && wt > 0) { prHit = e.name; exPR = { weight: wt, reps: rp }; } }
      });
      if (exPR) prNames.push({ name: e.name, ...exPR });
      return { name: e.name, muscle: e.muscle, icon: e.icon, note: e.note, sets: sets.map(s => ({ weight: +s.weight || 0, reps: +s.reps || 0 })) };
    }).filter(e => e.sets.length > 0);

    if (exercises.length === 0) { return { activeWorkout: null }; }

    const session = {
      id: Date.now(), name: w.name, date: Date.now(), durationMin,
      volume, totalReps, sets: doneSets, note: w.note, exercises, prs: prNames,
    };

    // stats + pet
    const weeklyWorkouts = [...state.stats.weeklyWorkouts];
    weeklyWorkouts[weeklyWorkouts.length - 1] += 1;
    const burned = Math.round(durationMin * 6 + volume * 0.03);
    const newStats = {
      ...state.stats,
      caloriesBurned: state.stats.caloriesBurned + burned,
      activeMinutes: state.stats.activeMinutes + durationMin,
      weeklyWorkouts,
    };
    const xp = 30 + (prHit ? 25 : 0);
    const boosted = { ...state.pet, motivation: clamp((state.pet.motivation ?? 75) + (prHit ? 18 : 10)), energy: clamp((state.pet.energy ?? 80) + 6), cleanliness: clamp((state.pet.cleanliness ?? 90) - 10) };
    const newPet = evolvePet(applyXp(boosted, xp), newStats);

    // Hevy-style: after finishing, open a share draft the user can edit
    const pendingShare = state.settings.autoShareWorkout !== false ? session : null;

    return {
      activeWorkout: null,
      workoutHistory: [session, ...state.workoutHistory],
      personalRecords: prs,
      stats: newStats,
      pet: newPet,
      lastPR: prHit,
      pendingShare,
    };
  }),

  // Publish (or discard) the post-workout share draft
  pendingShare: null,
  shareWorkout: (caption, image) => set((state) => {
    const s = state.pendingShare;
    if (!s) return { pendingShare: null };
    const post = {
      id: Date.now() + 1, user: state.user.name, avatar: state.user.avatar, type: 'workout-log',
      content: caption?.trim() || `Completé ${s.name} 💪`, time: 'Justo ahora',
      liked: false, likes: 0, saved: false, comments: [], petLevel: state.pet.level,
      image: image || null, workout: s,
    };
    return { feed: [post, ...state.feed], pendingShare: null };
  }),
  discardPendingShare: () => set({ pendingShare: null }),

  clearLastPR: () => set({ lastPR: null }),

  addWater: (glasses = 1) => set((state) => ({
    stats: {
      ...state.stats,
      water: Math.max(0, state.stats.water + glasses),
    },
  })),

  // ---------- Wearables / smart devices ----------
  connectedDevices: [],
  lastDeviceSync: null,
  deviceError: null,
  liveHR: null,
  hr: { avg: null, max: null, samples: 0, sum: 0 },

  connectDevice: (id) => set((state) => state.connectedDevices.includes(id) ? {} : ({
    connectedDevices: [...state.connectedDevices, id],
    lastDeviceSync: Date.now(),
    deviceError: null,
  })),

  disconnectDevice: (id) => set((state) => ({
    connectedDevices: state.connectedDevices.filter(d => d !== id),
  })),

  setDeviceError: (msg) => set({ deviceError: msg }),

  setLiveHR: (bpm) => set((state) => {
    const sum = state.hr.sum + bpm, samples = state.hr.samples + 1;
    return { liveHR: bpm, hr: { avg: Math.round(sum / samples), max: Math.max(state.hr.max || 0, bpm), samples, sum } };
  }),

  // One simulated/aggregated sync pull from connected devices
  resyncDevices: () => set((state) => {
    if (!state.connectedDevices.length) return { deviceError: 'No hay dispositivos conectados' };
    const addSteps = 400 + Math.floor(Math.random() * 1800);
    const addBurn = 30 + Math.floor(Math.random() * 140);
    const addActive = 4 + Math.floor(Math.random() * 18);
    const wasUnderGoal = state.stats.steps < state.stats.stepsGoal;
    const newStats = {
      ...state.stats,
      steps: state.stats.steps + addSteps,
      caloriesBurned: state.stats.caloriesBurned + addBurn,
      activeMinutes: state.stats.activeMinutes + addActive,
    };
    const crossedGoal = wasUnderGoal && newStats.steps >= newStats.stepsGoal;
    const boosted = { ...state.pet, motivation: clamp((state.pet.motivation ?? 75) + (crossedGoal ? 12 : 3)) };
    return { stats: newStats, pet: evolvePet(applyXp(boosted, crossedGoal ? 10 : 0), newStats), lastDeviceSync: Date.now(), deviceError: null };
  }),

  // Small real-time increment (called on an interval while devices are connected)
  liveTick: () => set((state) => {
    if (!state.connectedDevices.length) return {};
    const addSteps = 8 + Math.floor(Math.random() * 32);
    const addBurn = 1 + Math.floor(Math.random() * 4);
    const wasUnder = state.stats.steps < state.stats.stepsGoal;
    const newStats = {
      ...state.stats,
      steps: state.stats.steps + addSteps,
      caloriesBurned: state.stats.caloriesBurned + addBurn,
      activeMinutes: state.stats.activeMinutes + (Math.random() < 0.3 ? 1 : 0),
    };
    const crossed = wasUnder && newStats.steps >= newStats.stepsGoal;
    const dirtied = Math.random() < 0.25;   // gets a little dirty over time
    const basePet = { ...state.pet, cleanliness: clamp((state.pet.cleanliness ?? 90) - (dirtied ? 1 : 0)) };
    const pet = crossed
      ? evolvePet(applyXp({ ...basePet, motivation: clamp((state.pet.motivation ?? 75) + 15) }, 15), newStats)
      : evolvePet(basePet, newStats);
    return { stats: newStats, pet };
  }),

  // Simulates importing data from a connected wearable (Fitbit, etc.)
  syncWearable: () => set((state) => {
    const addedSteps = 600 + Math.floor(Math.random() * 1500);
    const addedBurn = 40 + Math.floor(Math.random() * 120);
    const addedActive = 5 + Math.floor(Math.random() * 20);
    const newStats = {
      ...state.stats,
      steps: state.stats.steps + addedSteps,
      caloriesBurned: state.stats.caloriesBurned + addedBurn,
      activeMinutes: state.stats.activeMinutes + addedActive,
    };
    return { stats: newStats, pet: evolvePet(state.pet, newStats) };
  }),

  completeMission: (missionId) => set((state) => {
    const mission = state.missions.find(m => m.id === missionId);
    if (!mission || mission.done) return {};
    const newPet = evolvePet(applyXp(state.pet, mission.xp), state.stats);
    return {
      missions: state.missions.map(m => m.id === missionId ? { ...m, done: true } : m),
      pet: newPet,
    };
  }),

  // XP from playing with the interactive pet
  addPetXp: (amount = 1) => set((state) => ({
    pet: applyXp(state.pet, amount),
  })),

  // Pet species & customization
  setSpecies: (species) => set((state) => ({ pet: { ...state.pet, species } })),
  setPetVariant: (variant) => set((state) => ({ pet: { ...state.pet, variant, species: 'frog' } })),
  setPetColor: (color) => set((state) => ({ pet: { ...state.pet, color, colors: color ? { ...(state.pet.colors || {}), body: color } : {} } })),
  setPetPartColor: (part, color) => set((state) => {
    const colors = { ...(state.pet.colors || {}) };
    if (color == null) delete colors[part];
    else colors[part] = color;
    return { pet: { ...state.pet, colors, color: colors.body || null } };
  }),
  setBackground: (background) => set((state) => ({ pet: { ...state.pet, background } })),
  bathePet: () => set((state) => ({ pet: { ...state.pet, cleanliness: 100 } })),

  // Wardrobe: equip a garment in a slot (hat/top/bottom)
  setOutfit: (slot, id) => set((state) => ({
    pet: { ...state.pet, outfit: { ...(state.pet.outfit || {}), [slot]: id } },
  })),

  // Talking-Tom style play interactions
  lastInteraction: null,
  interactPet: (type) => set((state) => {
    const patch = { ...state.pet };
    if (type === 'tickle') patch.motivation = clamp((state.pet.motivation ?? 75) + 4);
    if (type === 'pet') patch.motivation = clamp((state.pet.motivation ?? 75) + 3);
    return { pet: patch, lastInteraction: { type, at: Date.now() } };
  }),
  // Talking-Tom voice: the pet "says" some text (drives bubble + talking state)
  sayPet: (text) => set((state) => ({
    pet: { ...state.pet, motivation: clamp((state.pet.motivation ?? 75) + 2) },
    lastInteraction: { type: 'talk', text, at: Date.now() },
  })),

  // Talking-Tom mode: idle | listening | talking (drives the frog animation)
  talkMode: 'idle',
  talkText: '',
  setTalk: (mode, text = '') => set({ talkMode: mode, talkText: text }),

  // 3D character animation/style
  modelAnim: null,
  modelAnimList: [],
  modelGender: 'default',   // default | male | female (loads model/<gender>.glb)
  setModelAnim: (name) => set({ modelAnim: name }),
  setModelAnimList: (list) => set({ modelAnimList: list }),
  setModelGender: (g) => set({ modelGender: g, modelAnim: null }),

  // Pou/Tom-style care: feed restores energy, play restores motivation
  feedPet: () => set((state) => ({
    pet: { ...state.pet, energy: clamp(state.pet.energy + 18) },
  })),

  playWithPet: () => set((state) => ({
    pet: applyXp({
      ...state.pet,
      motivation: clamp(state.pet.motivation + 15),
      energy: clamp(state.pet.energy - 4),
    }, 3),
  })),

  // small energy cost when poked
  pokePet: () => set((state) => ({
    pet: { ...state.pet, energy: clamp(state.pet.energy - 1) },
  })),

  // Reward from the fitness minigame
  rewardMinigame: (points) => set((state) => ({
    pet: applyXp({
      ...state.pet,
      motivation: clamp(state.pet.motivation + Math.min(25, Math.round(points / 2))),
      energy: clamp(state.pet.energy - 5),
    }, Math.max(5, points)),
  })),

  // Daily reward (claim once per calendar day)
  lastDailyClaim: null,
  dailyReward: 50,
  claimDailyReward: () => set((state) => {
    if (state.lastDailyClaim === todayKey()) return {};
    return {
      lastDailyClaim: todayKey(),
      pet: applyXp({ ...state.pet, energy: clamp(state.pet.energy + 20), motivation: clamp(state.pet.motivation + 20) }, state.dailyReward),
    };
  }),

  // Pet customization
  setAccessory: (accId) => set((state) => ({
    pet: { ...state.pet, accessories: [accId] },
  })),

  renamePet: (name) => set((state) => ({
    pet: { ...state.pet, name: name.trim() || state.pet.name },
  })),

  // Notifications
  markNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
  })),

  unreadCount: () => get().notifications.filter(n => !n.read).length,

  // Settings
  updateSetting: (key, value) => set((state) => ({
    settings: { ...state.settings, [key]: value },
  })),

  updateGoal: (key, value) => set((state) => ({
    stats: { ...state.stats, [key]: Number(value) || state.stats[key] },
  })),

  // Reset everything back to defaults (used in Settings)
  resetApp: () => set({
    user: { name: 'Alex', username: 'alex_fit', bio: 'En camino a mi mejor versión 🐸', goal: 'Ganar músculo 💪', avatar: '😄', level: 7, xp: 680, xpToNext: 1000, followers: 128, following: 94, streak: 12, privacy: { showStats: true, showWorkouts: true } },
    stats: initialStats,
    pet: evolvePet(basepet, initialStats),
    feed: enrichFeed(mockFeed),
    stories: mockStories,
    following: ['Maria G.', 'Ana P.'],
    missions: mockMissions,
    badges: mockBadges,
    workouts: mockWorkouts,
    meals: mockMeals,
    notifications: mockNotifications,
  }),
}), {
  name: 'fitpet-storage',
  // Persist only data, never the transient UI flags.
  partialize: (state) => ({
    user: state.user,
    stats: state.stats,
    pet: state.pet,
    feed: state.feed,
    stories: state.stories,
    following: state.following,
    missions: state.missions,
    badges: state.badges,
    workouts: state.workouts,
    meals: state.meals,
    notifications: state.notifications,
    settings: state.settings,
    lastDailyClaim: state.lastDailyClaim,
    favorites: state.favorites,
    customFoods: state.customFoods,
    recipes: state.recipes,
    routines: state.routines,
    customExercises: state.customExercises,
    workoutHistory: state.workoutHistory,
    personalRecords: state.personalRecords,
    activeWorkout: state.activeWorkout,
    connectedDevices: state.connectedDevices,
    dashboardLayout: state.dashboardLayout,
    dashboardTemplates: state.dashboardTemplates,
    modelGender: state.modelGender,
  }),
}));

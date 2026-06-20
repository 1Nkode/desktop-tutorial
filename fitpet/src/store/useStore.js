import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
export function evolvePet(pet, stats) {
  const workoutDays = stats.weeklyWorkouts.filter(v => v > 0).length;
  const netCalories = stats.caloriesConsumed - stats.caloriesBurned;
  const calorieRatio = stats.caloriesConsumed / stats.caloriesGoal;
  const stepRatio = stats.steps / stats.stepsGoal;
  const activeRatio = stats.activeMinutes / stats.activeGoal;

  // --- Physique ---
  let physique;
  if (workoutDays >= 5 && activeRatio >= 1) {
    physique = 'strong';        // trains constantly + hits active goal
  } else if (workoutDays >= 3 && netCalories <= 0) {
    physique = 'fit';           // good activity + calorie deficit
  } else if (workoutDays <= 1 || calorieRatio > 1.15) {
    physique = 'chubby';        // little activity or big calorie surplus
  } else {
    physique = 'normal';
  }

  // --- Mood ---
  // Score the day's progress toward goals (0..1 each), average it.
  const goalScore = (
    Math.min(calorieRatio, 1) +
    Math.min(stepRatio, 1) +
    Math.min(activeRatio, 1)
  ) / 3;

  let mood;
  if (physique === 'strong' && goalScore >= 0.7) {
    mood = 'motivated';
  } else if (goalScore >= 0.6) {
    mood = 'happy';
  } else if (workoutDays === 0 && stepRatio < 0.4) {
    mood = 'sad';
  } else {
    mood = 'tired';
  }

  return { ...pet, physique, mood };
}

// Derives the high-level "evolution state" the companion displays.
// base · strong · neglected · tired · champion
export function petState(pet, stats, user) {
  const workoutDays = stats.weeklyWorkouts.filter(v => v > 0).length;
  const streak = user?.streak ?? 0;
  if (pet.level >= 10 || (pet.physique === 'strong' && workoutDays >= 6)) return 'champion';
  if (pet.physique === 'strong') return 'strong';
  if (pet.physique === 'chubby') return 'neglected';
  if (pet.mood === 'tired' || pet.mood === 'sad' || (streak > 0 && workoutDays <= 2)) return 'tired';
  return 'base';
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
    level: 7,
    xp: 680,
    xpToNext: 1000,
    followers: 128,
    following: 94,
    streak: 12,
  },

  // Health stats
  stats: initialStats,

  // Pet — derived from the starting stats so it's consistent on first load
  pet: evolvePet(basepet, initialStats),

  // Content
  feed: mockFeed,
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
        ? { ...p, comments: [...p.comments, { id: Date.now(), user: state.user.name, text }] }
        : p
    ),
  })),

  addPost: (post) => set((state) => {
    const newPost = {
      id: Date.now(),
      user: state.user.name,
      avatar: '😄',
      liked: false,
      likes: 0,
      comments: [],
      time: 'Just now',
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
    const newPet = evolvePet(state.pet, newStats);
    return { meals: [newMeal, ...state.meals], stats: newStats, pet: newPet };
  }),

  addWater: (glasses = 1) => set((state) => ({
    stats: {
      ...state.stats,
      water: Math.max(0, state.stats.water + glasses),
    },
  })),

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
    user: { name: 'Alex', level: 7, xp: 680, xpToNext: 1000, followers: 128, following: 94, streak: 12 },
    stats: initialStats,
    pet: evolvePet(basepet, initialStats),
    feed: mockFeed,
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
    missions: state.missions,
    badges: state.badges,
    workouts: state.workouts,
    meals: state.meals,
    notifications: state.notifications,
    settings: state.settings,
    lastDailyClaim: state.lastDailyClaim,
  }),
}));

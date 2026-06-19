import { create } from 'zustand';

const initialPet = {
  name: 'Sparky',
  level: 1,
  xp: 0,
  xpToNext: 100,
  mood: 'happy', // happy, motivated, tired, sad
  physique: 'normal', // normal, fit, strong, chubby
  accessories: ['bandana'],
  streak: 3,
};

const mockFeed = [
  {
    id: 1,
    user: 'Maria G.',
    avatar: '🏃‍♀️',
    type: 'workout',
    content: 'Completed 5K run in 28 min! 🔥',
    calories: 320,
    likes: 24,
    comments: 5,
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
    comments: 3,
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
    comments: 8,
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
    comments: 7,
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
    comments: 2,
    time: '7h ago',
    liked: false,
  },
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

export const useStore = create((set, get) => ({
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
  stats: {
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
  },

  // Pet
  pet: initialPet,

  // Content
  feed: mockFeed,
  missions: mockMissions,
  badges: mockBadges,
  workouts: mockWorkouts,
  meals: mockMeals,

  // UI
  activeTab: 'dashboard',
  showAddWorkout: false,
  showAddMeal: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setShowAddWorkout: (val) => set({ showAddWorkout: val }),
  setShowAddMeal: (val) => set({ showAddMeal: val }),

  toggleLike: (postId) => set((state) => ({
    feed: state.feed.map(p =>
      p.id === postId
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ),
  })),

  addWorkout: (workout) => set((state) => {
    const newWorkout = { ...workout, id: Date.now(), date: 'Just now' };
    const newStats = {
      ...state.stats,
      caloriesBurned: state.stats.caloriesBurned + workout.calories,
      activeMinutes: state.stats.activeMinutes + workout.duration,
    };
    const newPet = { ...state.pet, xp: Math.min(state.pet.xp + 25, state.pet.xpToNext) };
    return { workouts: [newWorkout, ...state.workouts], stats: newStats, pet: newPet };
  }),

  addMeal: (meal) => set((state) => {
    const newMeal = { ...meal, id: Date.now() };
    const newStats = {
      ...state.stats,
      caloriesConsumed: state.stats.caloriesConsumed + meal.calories,
    };
    return { meals: [newMeal, ...state.meals], stats: newStats };
  }),

  completeMission: (missionId) => set((state) => {
    const mission = state.missions.find(m => m.id === missionId);
    if (!mission || mission.done) return {};
    const newPet = { ...state.pet, xp: Math.min(state.pet.xp + mission.xp, state.pet.xpToNext) };
    return {
      missions: state.missions.map(m => m.id === missionId ? { ...m, done: true } : m),
      pet: newPet,
    };
  }),
}));

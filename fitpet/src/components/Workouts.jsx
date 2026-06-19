import { useState } from 'react';
import { useStore } from '../store/useStore';
import './Workouts.css';

const workoutTypes = [
  { icon: '🏃', label: 'Running' },
  { icon: '🏋️', label: 'Weight Training' },
  { icon: '🚴', label: 'Cycling' },
  { icon: '🧘', label: 'Yoga' },
  { icon: '🏊', label: 'Swimming' },
  { icon: '⛹️', label: 'Basketball' },
  { icon: '🥊', label: 'Boxing' },
  { icon: '🤸', label: 'HIIT' },
];

const mealTypes = [
  { icon: '🥣', label: 'Breakfast' },
  { icon: '🥗', label: 'Lunch' },
  { icon: '🍽️', label: 'Dinner' },
  { icon: '🍎', label: 'Snack' },
];

function AddWorkoutModal({ onClose }) {
  const { addWorkout } = useStore();
  const [type, setType] = useState('Running');
  const [typeIcon, setTypeIcon] = useState('🏃');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [intensity, setIntensity] = useState('Medium');

  const handleSubmit = () => {
    if (!duration || !calories) return;
    addWorkout({ type, icon: typeIcon, duration: +duration, calories: +calories, intensity });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal animate-slideUp" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Log Workout 💪</h3>

        <div style={{ marginBottom: 16 }}>
          <span className="label">Workout Type</span>
          <div className="type-grid">
            {workoutTypes.map(w => (
              <div
                key={w.label}
                className={`type-btn ${type === w.label ? 'selected' : ''}`}
                onClick={() => { setType(w.label); setTypeIcon(w.icon); }}
              >
                <span>{w.icon}</span>
                <span>{w.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="form-row">
          <div style={{ flex: 1 }}>
            <span className="label">Duration (min)</span>
            <input className="input" type="number" placeholder="45" value={duration} onChange={e => setDuration(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <span className="label">Calories burned</span>
            <input className="input" type="number" placeholder="300" value={calories} onChange={e => setCalories(e.target.value)} />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <span className="label">Intensity</span>
          <div className="intensity-row">
            {['Low', 'Medium', 'High'].map(lvl => (
              <button
                key={lvl}
                className={`intensity-btn ${intensity === lvl ? 'active' : ''}`}
                onClick={() => setIntensity(lvl)}
              >{lvl}</button>
            ))}
          </div>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleSubmit}>
          Save Workout (+25 XP)
        </button>
      </div>
    </div>
  );
}

function AddMealModal({ onClose }) {
  const { addMeal } = useStore();
  const [name, setName] = useState('');
  const [time, setTime] = useState('Breakfast');
  const [timeIcon, setTimeIcon] = useState('🥣');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const handleSubmit = () => {
    if (!name || !calories) return;
    addMeal({ name, icon: timeIcon, time, calories: +calories, protein: +protein || 0, carbs: +carbs || 0, fat: +fat || 0 });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal animate-slideUp" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Log Meal 🍽️</h3>

        <div style={{ marginBottom: 16 }}>
          <span className="label">Meal Time</span>
          <div className="type-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {mealTypes.map(m => (
              <div
                key={m.label}
                className={`type-btn ${time === m.label ? 'selected' : ''}`}
                onClick={() => { setTime(m.label); setTimeIcon(m.icon); }}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <span className="label">Meal Name</span>
          <input className="input" placeholder="e.g. Grilled chicken salad" value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div className="form-row">
          <div style={{ flex: 1 }}>
            <span className="label">Calories</span>
            <input className="input" type="number" placeholder="400" value={calories} onChange={e => setCalories(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <span className="label">Protein (g)</span>
            <input className="input" type="number" placeholder="30" value={protein} onChange={e => setProtein(e.target.value)} />
          </div>
        </div>

        <div className="form-row" style={{ marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <span className="label">Carbs (g)</span>
            <input className="input" type="number" placeholder="40" value={carbs} onChange={e => setCarbs(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <span className="label">Fat (g)</span>
            <input className="input" type="number" placeholder="15" value={fat} onChange={e => setFat(e.target.value)} />
          </div>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleSubmit}>
          Save Meal
        </button>
      </div>
    </div>
  );
}

export default function Workouts() {
  const { workouts, meals } = useStore();
  const [tab, setTab] = useState('workouts');
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);

  return (
    <div className="workouts-page animate-fadeIn">
      <div className="workout-header">
        <h2 className="section-title">Track</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => tab === 'workouts' ? setShowWorkoutModal(true) : setShowMealModal(true)}
        >
          + Add {tab === 'workouts' ? 'Workout' : 'Meal'}
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${tab === 'workouts' ? 'active' : ''}`} onClick={() => setTab('workouts')}>
          💪 Workouts
        </button>
        <button className={`tab ${tab === 'meals' ? 'active' : ''}`} onClick={() => setTab('meals')}>
          🍽️ Nutrition
        </button>
      </div>

      {tab === 'workouts' && (
        <>
          {/* Wearable sync banner */}
          <div className="card wearable-card">
            <div className="wearable-left">
              <span className="wearable-icon">⌚</span>
              <div>
                <p className="wearable-title">Fitbit Connected</p>
                <p className="wearable-sub">Last sync: 2 min ago</p>
              </div>
            </div>
            <div className="sync-dot" />
          </div>

          {workouts.map(w => (
            <WorkoutCard key={w.id} workout={w} />
          ))}
        </>
      )}

      {tab === 'meals' && (
        <>
          {/* Daily totals */}
          <div className="card macro-summary">
            <h4 style={{ fontWeight: 700, marginBottom: 12 }}>Today's Macros</h4>
            <div className="macros-row">
              <MacroCircle label="Protein" value={`${meals.reduce((s, m) => s + m.protein, 0)}g`} color="var(--blue)" />
              <MacroCircle label="Carbs" value={`${meals.reduce((s, m) => s + m.carbs, 0)}g`} color="var(--orange)" />
              <MacroCircle label="Fat" value={`${meals.reduce((s, m) => s + m.fat, 0)}g`} color="var(--purple)" />
              <MacroCircle label="Calories" value={`${meals.reduce((s, m) => s + m.calories, 0)}`} color="var(--green)" />
            </div>
          </div>

          {meals.map(m => (
            <MealCard key={m.id} meal={m} />
          ))}
        </>
      )}

      {showWorkoutModal && <AddWorkoutModal onClose={() => setShowWorkoutModal(false)} />}
      {showMealModal && <AddMealModal onClose={() => setShowMealModal(false)} />}

      <div style={{ height: 100 }} />
    </div>
  );
}

function WorkoutCard({ workout }) {
  const intColors = { Low: 'var(--green)', Medium: 'var(--orange)', High: 'var(--red)' };
  return (
    <div className="card workout-card">
      <div className="wc-left">
        <div className="wc-icon">{workout.icon}</div>
        <div>
          <p className="wc-type">{workout.type}</p>
          <p className="wc-date">{workout.date}</p>
        </div>
      </div>
      <div className="wc-stats">
        <div className="wc-stat">
          <span className="wc-val">{workout.duration}</span>
          <span className="wc-key">min</span>
        </div>
        <div className="wc-stat">
          <span className="wc-val">{workout.calories}</span>
          <span className="wc-key">kcal</span>
        </div>
        <div className="tag" style={{ background: intColors[workout.intensity] + '22', color: intColors[workout.intensity] }}>
          {workout.intensity}
        </div>
      </div>
    </div>
  );
}

function MealCard({ meal }) {
  return (
    <div className="card meal-card">
      <div className="mc-icon">{meal.icon}</div>
      <div className="mc-info">
        <p className="mc-name">{meal.name}</p>
        <p className="mc-time">{meal.time}</p>
        <div className="mc-macros">
          <span>P: {meal.protein}g</span>
          <span>C: {meal.carbs}g</span>
          <span>F: {meal.fat}g</span>
        </div>
      </div>
      <div className="mc-cal">
        <p className="mc-cal-num">{meal.calories}</p>
        <p className="mc-cal-label">kcal</p>
      </div>
    </div>
  );
}

function MacroCircle({ label, value, color }) {
  return (
    <div className="macro-circle">
      <div className="macro-bubble" style={{ background: color + '22', border: `2px solid ${color}` }}>
        <span style={{ color, fontWeight: 800, fontSize: 13 }}>{value}</span>
      </div>
      <p className="macro-label">{label}</p>
    </div>
  );
}

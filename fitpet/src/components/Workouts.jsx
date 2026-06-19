import { useState } from 'react';
import { useStore } from '../store/useStore';
import './Workouts.css';

export default function Workouts() {
  const { workouts, meals, settings, setShowAddWorkout, setShowAddMeal, syncWearable } = useStore();
  const [tab, setTab] = useState('workouts');
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('2 min ago');

  const handleSync = () => {
    if (syncing) return;
    setSyncing(true);
    setTimeout(() => {
      syncWearable();
      setSyncing(false);
      setLastSync('just now');
    }, 1200);
  };

  return (
    <div className="workouts-page animate-fadeIn">
      <div className="workout-header">
        <h2 className="section-title">Track</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => tab === 'workouts' ? setShowAddWorkout(true) : setShowAddMeal(true)}
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
                <p className="wearable-title">Fitbit {settings.autoSync ? 'Connected' : 'Manual'}</p>
                <p className="wearable-sub">Last sync: {lastSync}</p>
              </div>
            </div>
            <button className="sync-btn" onClick={handleSync} disabled={syncing}>
              {syncing ? <span className="sync-spinner" /> : 'Sync now'}
            </button>
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

import { useState } from 'react';
import { useStore } from '../store/useStore';
import Nutrition from './Nutrition';
import './Workouts.css';

export default function Workouts() {
  const { workouts, settings, setShowAddWorkout, syncWearable } = useStore();
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
        {tab === 'workouts' && (
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddWorkout(true)}>
            + Add Workout
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${tab === 'workouts' ? 'active' : ''}`} onClick={() => setTab('workouts')}>
          💪 Entreno
        </button>
        <button className={`tab ${tab === 'meals' ? 'active' : ''}`} onClick={() => setTab('meals')}>
          🍽️ Nutrición
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

      {tab === 'meals' && <Nutrition />}

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


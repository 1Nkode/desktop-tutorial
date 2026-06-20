import { useState } from 'react';
import { useStore } from '../store/useStore';
import Nutrition from './Nutrition';
import Training from './Training';
import './Workouts.css';

export default function Workouts() {
  const activeWorkout = useStore(s => s.activeWorkout);
  const [tab, setTab] = useState('workouts');

  return (
    <div className="workouts-page animate-fadeIn">
      {!activeWorkout && (
        <>
          <div className="workout-header">
            <h2 className="section-title">Track</h2>
          </div>
          <div className="tabs">
            <button className={`tab ${tab === 'workouts' ? 'active' : ''}`} onClick={() => setTab('workouts')}>
              💪 Entreno
            </button>
            <button className={`tab ${tab === 'meals' ? 'active' : ''}`} onClick={() => setTab('meals')}>
              🍽️ Nutrición
            </button>
          </div>
        </>
      )}

      {tab === 'workouts' && <Training />}
      {tab === 'meals' && !activeWorkout && <Nutrition />}

      <div style={{ height: 100 }} />
    </div>
  );
}

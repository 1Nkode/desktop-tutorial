import { useState } from 'react';
import { useStore } from '../store/useStore';
import './Pet.css';

const PHYSIQUES = {
  normal: { emoji: '🐱', label: 'Normal', desc: 'Your pet is doing okay!', color: '#667eea' },
  fit: { emoji: '🐆', label: 'Fit & Active', desc: 'Active lifestyle detected!', color: 'var(--green)' },
  strong: { emoji: '🦁', label: 'Super Strong', desc: 'Crushing those workouts!', color: 'var(--orange)' },
  chubby: { emoji: '🐻', label: 'Fluffy Mode', desc: 'Time to get moving!', color: '#9E9E9E' },
};

const MOODS = {
  happy: { emoji: '😸', label: 'Happy', color: 'var(--green)' },
  motivated: { emoji: '😤', label: 'Motivated', color: 'var(--orange)' },
  tired: { emoji: '😴', label: 'Tired', color: '#9E9E9E' },
  sad: { emoji: '😿', label: 'Sad', color: 'var(--red)' },
};

const accessories = [
  { id: 'bandana', emoji: '🎀', label: 'Bandana', unlocked: true },
  { id: 'glasses', emoji: '😎', label: 'Shades', unlocked: true },
  { id: 'crown', emoji: '👑', label: 'Crown', unlocked: false, req: 'Reach Level 10' },
  { id: 'wings', emoji: '🦋', label: 'Wings', unlocked: false, req: '30-day streak' },
  { id: 'trophy', emoji: '🏆', label: 'Trophy', unlocked: false, req: 'Win a challenge' },
  { id: 'muscle', emoji: '💪', label: 'Flex', unlocked: true },
];

export default function Pet() {
  const { pet, stats, setAccessory, renamePet } = useStore();
  const selectedAcc = pet.accessories[0] || 'bandana';
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(pet.name);
  const physique = PHYSIQUES[pet.physique];
  const mood = MOODS[pet.mood];
  const xpPct = (pet.xp / pet.xpToNext) * 100;

  const saveName = () => {
    renamePet(nameDraft);
    setEditingName(false);
  };

  return (
    <div className="pet-page animate-fadeIn">
      <div className="pet-header">
        <h2 className="section-title">My Pet</h2>
        <div className="mood-badge" style={{ background: mood.color + '22', color: mood.color }}>
          {mood.emoji} {mood.label}
        </div>
      </div>

      {/* Main pet display */}
      <div className="pet-stage" style={{ background: `linear-gradient(135deg, ${physique.color}22, ${physique.color}44)` }}>
        <div className="pet-glow" style={{ background: physique.color }} />
        <div className="pet-emoji animate-float">{physique.emoji}</div>
        <div className="pet-accessory">{accessories.find(a => a.id === selectedAcc)?.emoji}</div>
        <div className="pet-name-tag">
          {editingName ? (
            <input
              className="pet-name-input"
              value={nameDraft}
              autoFocus
              maxLength={14}
              onChange={e => setNameDraft(e.target.value)}
              onBlur={saveName}
              onKeyDown={e => e.key === 'Enter' && saveName()}
            />
          ) : (
            <span onClick={() => { setNameDraft(pet.name); setEditingName(true); }}>
              {pet.name} <span className="pet-edit-icon">✏️</span>
            </span>
          )}
          <span className="pet-level-tag">Lv.{pet.level}</span>
        </div>
        <div className="pet-physique-label" style={{ color: physique.color }}>
          {physique.label}
        </div>
        <p className="pet-desc">{physique.desc}</p>
      </div>

      {/* XP Bar */}
      <div className="card xp-card">
        <div className="xp-header">
          <span className="xp-title">Experience Points</span>
          <span className="xp-num">{pet.xp} / {pet.xpToNext} XP</span>
        </div>
        <div className="progress-bar" style={{ height: 12, marginTop: 8 }}>
          <div
            className="progress-fill animate-glow"
            style={{
              width: `${xpPct}%`,
              background: 'linear-gradient(90deg, var(--green), var(--blue))',
            }}
          />
        </div>
        <p className="xp-sub">{pet.xpToNext - pet.xp} XP until Level {pet.level + 1}</p>
      </div>

      {/* Pet evolution info */}
      <div className="card">
        <h3 className="section-title" style={{ marginBottom: 14 }}>Evolution Stages</h3>
        <div className="evolution-grid">
          {Object.entries(PHYSIQUES).map(([key, val]) => (
            <div
              key={key}
              className={`evo-card ${pet.physique === key ? 'active' : ''}`}
              style={{ borderColor: pet.physique === key ? val.color : 'transparent' }}
            >
              <div className="evo-emoji">{val.emoji}</div>
              <p className="evo-label">{val.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly stats that influence pet */}
      <div className="card">
        <h3 className="section-title" style={{ marginBottom: 14 }}>Weekly Report Card</h3>
        <div className="report-items">
          <ReportItem label="Workouts" value={stats.weeklyWorkouts.filter(v => v > 0).length} max={7} suffix="days" color="var(--green)" icon="💪" />
          <ReportItem label="Calorie Goal" value={Math.round((stats.caloriesConsumed / stats.caloriesGoal) * 100)} max={100} suffix="%" color="var(--blue)" icon="🍎" />
          <ReportItem label="Daily Steps" value={Math.round((stats.steps / stats.stepsGoal) * 100)} max={100} suffix="%" color="var(--orange)" icon="👟" />
          <ReportItem label="Active Mins" value={stats.activeMinutes} max={stats.activeGoal} suffix="min" color="var(--purple)" icon="⏱️" />
        </div>
      </div>

      {/* Accessories */}
      <div className="card">
        <h3 className="section-title" style={{ marginBottom: 14 }}>Accessories</h3>
        <div className="acc-grid">
          {accessories.map(acc => (
            <div
              key={acc.id}
              className={`acc-item ${selectedAcc === acc.id ? 'selected' : ''} ${!acc.unlocked ? 'locked' : ''}`}
              onClick={() => acc.unlocked && setAccessory(acc.id)}
            >
              <div className="acc-emoji">{acc.unlocked ? acc.emoji : '🔒'}</div>
              <p className="acc-label">{acc.label}</p>
              {!acc.unlocked && <p className="acc-req">{acc.req}</p>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 100 }} />
    </div>
  );
}

function ReportItem({ label, value, max, suffix, color, icon }) {
  const pct = Math.min(value / max, 1);
  return (
    <div className="report-item">
      <div className="report-left">
        <span>{icon}</span>
        <span className="report-label">{label}</span>
      </div>
      <div className="report-right">
        <div className="progress-bar" style={{ flex: 1, height: 6 }}>
          <div className="progress-fill" style={{ width: `${pct * 100}%`, background: color }} />
        </div>
        <span className="report-val" style={{ color }}>{value}{suffix}</span>
      </div>
    </div>
  );
}

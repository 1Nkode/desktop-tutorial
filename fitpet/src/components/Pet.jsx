import { useState } from 'react';
import { useStore, petState, petHappiness } from '../store/useStore';
import InteractivePet, { STATE_INFO } from './InteractivePet';
import Minigame from './Minigame';
import PetCustomize from './PetCustomize';
import { BACKGROUNDS } from './backgrounds';
import { playSound } from '../sound';
import './Pet.css';

const STATE_ORDER = ['neglected', 'tired', 'base', 'strong', 'champion'];

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
  const { pet, stats, user, setAccessory, renamePet, feedPet, playWithPet, bathePet, claimDailyReward, lastDailyClaim } = useStore();
  const dailyAvailable = lastDailyClaim !== new Date().toISOString().slice(0, 10);
  const selectedAcc = pet.accessories[0] || 'bandana';
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(pet.name);
  const physique = PHYSIQUES[pet.physique];
  const mood = MOODS[pet.mood];
  const xpPct = (pet.xp / pet.xpToNext) * 100;
  const state = petState(pet, stats, user);
  const stateInfo = STATE_INFO[state];
  const happiness = petHappiness(pet, stats, user);
  const [showGame, setShowGame] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);

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
      <div className="pet-stage" style={{ background: pet.background && pet.background !== 'default' ? BACKGROUNDS[pet.background]?.css : `linear-gradient(135deg, ${physique.color}22, ${physique.color}44)` }}>
        <div className="pet-glow" style={{ background: physique.color }} />
        <div className="pet-state-chip" style={{ background: stateInfo.color + '22', color: stateInfo.color, borderColor: stateInfo.color + '55' }}>
          {stateInfo.emoji} Estado {stateInfo.label}
        </div>
        <div className="pet-playground">
          <InteractivePet />
          <span className="pet-playground-hint">Tócalo, arrástralo y lánzalo · doble clic para celebrar</span>
        </div>
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
        <div className="pet-physique-label" style={{ color: stateInfo.color }}>
          {stateInfo.label} · {physique.label}
        </div>
        <p className="pet-desc">{stateInfo.desc}</p>
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

      {/* Care: happiness + energy + motivation + cleanliness + actions */}
      <div className="card care-card">
        <div className="care-bar">
          <span className="care-ico">😊</span>
          <div className="care-track"><div className="care-fill happy" style={{ width: `${happiness}%` }} /></div>
          <span className="care-val">{happiness}</span>
        </div>
        <div className="care-bar">
          <span className="care-ico">⚡</span>
          <div className="care-track"><div className="care-fill energy" style={{ width: `${pet.energy}%` }} /></div>
          <span className="care-val">{pet.energy}</span>
        </div>
        <div className="care-bar">
          <span className="care-ico">🔥</span>
          <div className="care-track"><div className="care-fill motivation" style={{ width: `${pet.motivation}%` }} /></div>
          <span className="care-val">{pet.motivation}</span>
        </div>
        <div className="care-bar">
          <span className="care-ico">🧼</span>
          <div className="care-track"><div className="care-fill clean" style={{ width: `${pet.cleanliness}%` }} /></div>
          <span className="care-val">{pet.cleanliness}</span>
        </div>
        <div className="care-actions">
          <button className="care-btn" onClick={() => { feedPet(); playSound('eat'); }}>🍎 Alimentar</button>
          <button className="care-btn" onClick={() => { playWithPet(); playSound('celebrate'); }}>🎾 Jugar</button>
          <button className="care-btn" onClick={() => { bathePet(); playSound('reward'); }}>🧼 Bañar</button>
          <button className="care-btn" onClick={() => setShowGame(true)}>🎮 Juego</button>
        </div>
        <div className="care-actions" style={{ marginTop: 8 }}>
          <button className="care-btn" onClick={() => setShowCustomize(true)}>🎨 Personalizar</button>
          <button className={`care-btn daily ${dailyAvailable ? 'ready' : ''}`} disabled={!dailyAvailable} onClick={() => { claimDailyReward(); playSound('reward'); }}>
            🎁 {dailyAvailable ? 'Recompensa diaria' : 'Reclamado hoy'}
          </button>
        </div>
      </div>

      {showGame && <Minigame onClose={() => setShowGame(false)} />}
      {showCustomize && <PetCustomize onClose={() => setShowCustomize(false)} />}

      {/* Evolution states */}
      <div className="card">
        <h3 className="section-title" style={{ marginBottom: 14 }}>Estados de evolución</h3>
        <div className="evolution-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {STATE_ORDER.map((key) => {
            const val = STATE_INFO[key];
            const active = state === key;
            return (
              <div
                key={key}
                className={`evo-card ${active ? 'active' : ''}`}
                style={{ borderColor: active ? val.color : 'transparent' }}
              >
                <div className="evo-emoji">{val.emoji}</div>
                <p className="evo-label">{val.label}</p>
              </div>
            );
          })}
        </div>
        <p className="evo-caption">Tu mascota cambia de estado según tu actividad real 💪</p>
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

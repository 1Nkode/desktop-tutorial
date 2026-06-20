import { useStore } from '../store/useStore';
import './Dashboard.css';

function Ring({ value, max, size = 256, stroke = 8, children }) {
  const pct = Math.min(value / max, 1);
  const r = 45;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg className="ring-svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#2E2E32" strokeWidth={stroke} />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke="url(#limeGrad)" strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          className="ring-prog"
        />
        <defs>
          <linearGradient id="limeGrad" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#CCFF00" />
            <stop offset="100%" stopColor="#AACC00" />
          </linearGradient>
        </defs>
      </svg>
      <div className="ring-center">{children}</div>
    </div>
  );
}

function WeekBars({ values, max }) {
  const dayLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  return (
    <div className="week-bars">
      {values.map((v, i) => (
        <div key={i} className="wb-col">
          <div className="wb-track">
            <div className="wb-fill" style={{ height: `${(v / max) * 100}%` }} />
          </div>
          <span className="wb-day">{dayLabels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user, stats, pet, connectedDevices, liveHR, setActiveTab, setShowAddMeal, setShowAddWorkout, setShowAddWater, setShowAddPost } = useStore();

  const netCalories = stats.caloriesConsumed - stats.caloriesBurned;
  const calPct = Math.min(stats.caloriesConsumed / stats.caloriesGoal, 1);
  const stepPct = Math.min(stats.steps / stats.stepsGoal, 1);
  const waterPct = Math.min(stats.water / stats.waterGoal, 1);
  const activePct = Math.min(stats.activeMinutes / stats.activeGoal, 1);
  const distanceKm = (stats.steps * 0.00076).toFixed(1);
  const petEmoji = pet.physique === 'strong' ? '🦁' : pet.physique === 'fit' ? '🐆' : pet.physique === 'chubby' ? '🐻' : '🐱';

  return (
    <div className="dashboard animate-fadeIn">
      {/* Hero: circular step counter */}
      <section className="step-hero">
        <Ring value={stats.steps} max={stats.stepsGoal}>
          <span className="material-symbols-outlined fill hero-foot">footprint</span>
          <h2 className="hero-steps">{stats.steps.toLocaleString()}</h2>
          <p className="hero-cap">PASOS HOY</p>
        </Ring>
        <div className="hero-stats">
          <div className="hs-item">
            <p className="hs-label">Objetivo</p>
            <p className="hs-val">{(stats.stepsGoal / 1000).toFixed(0)}k</p>
          </div>
          <div className="hs-item">
            <p className="hs-label">Distancia</p>
            <p className="hs-val">{distanceKm} km</p>
          </div>
          <div className="hs-item">
            <p className="hs-label">Tiempo</p>
            <p className="hs-val">{stats.activeMinutes}m</p>
          </div>
        </div>
      </section>

      {/* Bento grid */}
      <div className="bento">
        {/* Wide: calorie balance */}
        <div className="card bento-wide">
          <div className="bento-head">
            <div className="bento-label">
              <span className="material-symbols-outlined fill bw-fire">mode_fan</span>
              <span>Balance Calórico</span>
            </div>
            <span className={`net-badge ${netCalories <= 0 ? 'good' : 'over'}`}>
              {netCalories > 0 ? '+' : ''}{netCalories} NET
            </span>
          </div>
          <h3 className="bento-stat">{stats.caloriesBurned}<span className="bento-unit"> kcal quemadas</span></h3>
          <WeekBars values={stats.weeklyCalories.map(c => Math.round((c / 2500) * 7))} max={7} />
        </div>

        {/* Consumed */}
        <div className="card bento-sq">
          <div>
            <span className="material-symbols-outlined bsq-icon">restaurant</span>
            <p className="bento-label-sm">Consumidas</p>
          </div>
          <div>
            <h3 className="bento-stat-sq">{stats.caloriesConsumed}</h3>
            <p className="bento-sub">de {stats.caloriesGoal} kcal</p>
          </div>
          <div className="progress-bar"><div className="progress-fill lime" style={{ width: `${calPct * 100}%` }} /></div>
        </div>

        {/* Water */}
        <div className="card bento-sq" onClick={() => setShowAddWater(true)} style={{ cursor: 'pointer' }}>
          <div>
            <span className="material-symbols-outlined bsq-icon water">water_drop</span>
            <p className="bento-label-sm">Hidratación</p>
          </div>
          <div>
            <h3 className="bento-stat-sq">{stats.water}<span className="bento-unit">/{stats.waterGoal}</span></h3>
            <p className="bento-sub">vasos hoy</p>
          </div>
          <div className="progress-bar"><div className="progress-fill lav" style={{ width: `${waterPct * 100}%` }} /></div>
        </div>
      </div>

      {/* Pet banner */}
      <div className="card pet-banner" onClick={() => setActiveTab('pet')}>
        <div className="pet-mini animate-float">{petEmoji}</div>
        <div className="pet-banner-left">
          <p className="pet-status-text">Tu mascota está <strong>{pet.mood}</strong></p>
          <p className="pet-sub">Nivel {pet.level} · {pet.xp} XP · ¡sigue así! 💪</p>
        </div>
        <span className="material-symbols-outlined pet-chevron">chevron_right</span>
      </div>

      {/* Devices badge */}
      <div className="card fitbit-badge" onClick={() => setActiveTab('devices')}>
        <div className="fb-left">
          <div className="fb-icon"><span className="material-symbols-outlined">watch</span></div>
          <div>
            <p className="fb-title">{connectedDevices.length ? `${connectedDevices.length} dispositivo(s)` : 'Conectar dispositivos'}</p>
            <p className="fb-sub">{connectedDevices.length ? 'Sincronizando en vivo' : 'Apple · Fitbit · Garmin · BLE…'}</p>
          </div>
        </div>
        <div className="fb-right">
          {liveHR ? <><span className="material-symbols-outlined fill" style={{ color: 'var(--red)', fontSize: 18 }}>favorite</span><span>{liveHR}</span></>
            : <span className="material-symbols-outlined">chevron_right</span>}
        </div>
      </div>

      {/* Quick actions */}
      <div className="quick-actions">
        <QuickAction icon="restaurant" label="Comida" onClick={() => setShowAddMeal(true)} />
        <QuickAction icon="fitness_center" label="Entreno" onClick={() => setShowAddWorkout(true)} />
        <QuickAction icon="water_drop" label="Agua" onClick={() => setShowAddWater(true)} />
        <QuickAction icon="add_a_photo" label="Publicar" onClick={() => setShowAddPost(true)} />
      </div>

      <div style={{ height: 110 }} />
    </div>
  );
}

function QuickAction({ icon, label, onClick }) {
  return (
    <button className="quick-action" onClick={onClick}>
      <span className="material-symbols-outlined qa-icon">{icon}</span>
      <span className="qa-label">{label}</span>
    </button>
  );
}

import { useStore } from '../store/useStore';
import './Widgets.css';

const PET_EMOJI = { strong: '🦁', fit: '🐆', chubby: '🐻', normal: '🐱' };

function Ring({ value, max, color = 'var(--lime)', size = 64 }) {
  const pct = Math.min(value / max, 1);
  const r = 26, circ = 2 * Math.PI * r, off = circ * (1 - pct);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="wg-ring">
      <circle cx="32" cy="32" r={r} fill="none" stroke="#2E2E32" strokeWidth="7" />
      <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={off} transform="rotate(-90 32 32)"
        style={{ transition: 'stroke-dashoffset 0.7s ease' }} />
    </svg>
  );
}

function Bar({ pct, color }) {
  return <div className="wg-bar"><div className="wg-bar-fill" style={{ width: `${Math.min(pct, 100)}%`, background: color }} /></div>;
}

// ---- individual widgets ----
function StepsW() {
  const { stats } = useStore();
  const pct = Math.round(Math.min(stats.steps / stats.stepsGoal, 1) * 100);
  return (
    <div className="wg wg-steps">
      <Ring value={stats.steps} max={stats.stepsGoal} color="var(--lime)" size={76} />
      <div>
        <p className="wg-big">{stats.steps.toLocaleString()}</p>
        <p className="wg-sub">de {stats.stepsGoal.toLocaleString()} pasos · {pct}%</p>
      </div>
    </div>
  );
}
function HrW() {
  const { liveHR, hr } = useStore();
  return (
    <div className="wg wg-center">
      <span className="material-symbols-outlined fill wg-ico" style={{ color: 'var(--red)' }}>favorite</span>
      <p className="wg-big">{liveHR ?? '--'} <span className="wg-unit">BPM</span></p>
      <p className="wg-sub">prom {hr.avg ?? '--'} · máx {hr.max ?? '--'}</p>
    </div>
  );
}
function BurnedW() {
  const { stats } = useStore();
  return (
    <div className="wg wg-center">
      <span className="wg-ico">🔥</span>
      <p className="wg-big">{stats.caloriesBurned}</p>
      <p className="wg-sub">kcal quemadas</p>
    </div>
  );
}
function ConsumedW() {
  const { stats } = useStore();
  const pct = Math.round((stats.caloriesConsumed / stats.caloriesGoal) * 100);
  return (
    <div className="wg">
      <div className="wg-row"><span className="wg-ico">🍎</span><p className="wg-big">{stats.caloriesConsumed} <span className="wg-unit">/ {stats.caloriesGoal} kcal</span></p></div>
      <Bar pct={pct} color="linear-gradient(90deg,var(--lime),var(--lime-dim))" />
      <p className="wg-sub">{Math.max(0, stats.caloriesGoal - stats.caloriesConsumed)} kcal restantes</p>
    </div>
  );
}
function WaterW() {
  const { stats, addWater } = useStore();
  return (
    <div className="wg wg-center">
      <span className="wg-ico">💧</span>
      <p className="wg-big">{stats.water}<span className="wg-unit">/{stats.waterGoal}</span></p>
      <button className="wg-mini-btn" onClick={(e) => { e.stopPropagation(); addWater(1); }}>+ vaso</button>
    </div>
  );
}
function DistanceW() {
  const { stats } = useStore();
  return (
    <div className="wg wg-center">
      <span className="wg-ico">📏</span>
      <p className="wg-big">{(stats.steps * 0.0007).toFixed(2)}<span className="wg-unit"> km</span></p>
      <p className="wg-sub">hoy</p>
    </div>
  );
}
function ActiveW() {
  const { stats } = useStore();
  return (
    <div className="wg wg-center">
      <span className="wg-ico">⏱️</span>
      <p className="wg-big">{stats.activeMinutes}<span className="wg-unit"> min</span></p>
      <p className="wg-sub">de {stats.activeGoal} min activos</p>
    </div>
  );
}
function StreakW() {
  const { user } = useStore();
  return (
    <div className="wg wg-center">
      <span className="wg-ico">🔥</span>
      <p className="wg-big">{user.streak}</p>
      <p className="wg-sub">días de racha</p>
    </div>
  );
}
function MacrosW() {
  const { meals } = useStore();
  const t = meals.reduce((a, m) => ({ p: a.p + (m.protein || 0), c: a.c + (m.carbs || 0), f: a.f + (m.fat || 0) }), { p: 0, c: 0, f: 0 });
  const row = (l, v, goal, color) => (
    <div className="wg-macro"><div className="wg-macro-h"><span>{l}</span><span>{Math.round(v)}/{goal}g</span></div><Bar pct={(v / goal) * 100} color={color} /></div>
  );
  return (
    <div className="wg">
      {row('Proteína', t.p, 150, 'var(--lavender)')}
      {row('Carbos', t.c, 220, 'var(--orange)')}
      {row('Grasa', t.f, 60, '#ff7a59')}
    </div>
  );
}
function WorkoutsW() {
  const { workoutHistory } = useStore();
  const last = workoutHistory[0];
  return (
    <div className="wg">
      <div className="wg-row"><span className="wg-ico">🏋️</span><p className="wg-ttl">Entrenamientos</p></div>
      {last ? (
        <p className="wg-sub">Último: <b>{last.name}</b> · {(last.volume / 1000).toFixed(1)}t · {last.sets} series</p>
      ) : <p className="wg-sub">Aún no hay entrenos. ¡Empieza uno!</p>}
      <p className="wg-sub">{workoutHistory.length} sesiones registradas</p>
    </div>
  );
}
function MealsW() {
  const { meals } = useStore();
  return (
    <div className="wg">
      <div className="wg-row"><span className="wg-ico">🍽️</span><p className="wg-ttl">Comidas de hoy</p></div>
      {meals.slice(0, 3).map(m => <p key={m.id} className="wg-sub">{m.icon} {m.name} · {m.calories} kcal</p>)}
      {meals.length === 0 && <p className="wg-sub">Sin comidas registradas</p>}
    </div>
  );
}
function WeightW() {
  const { stats } = useStore();
  const diff = (stats.weight - stats.weightGoal).toFixed(1);
  return (
    <div className="wg wg-center">
      <span className="wg-ico">⚖️</span>
      <p className="wg-big">{stats.weight}<span className="wg-unit"> kg</span></p>
      <p className="wg-sub">meta {stats.weightGoal} kg · {diff > 0 ? `+${diff}` : diff}</p>
    </div>
  );
}
function SleepW() {
  const { stats } = useStore();
  return (
    <div className="wg wg-center">
      <span className="wg-ico">😴</span>
      <p className="wg-big">{stats.sleep}<span className="wg-unit"> h</span></p>
      <p className="wg-sub">de {stats.sleepGoal} h objetivo</p>
    </div>
  );
}
function StatsW() {
  const { stats, workoutHistory } = useStore();
  const vol = workoutHistory.reduce((s, w) => s + w.volume, 0);
  return (
    <div className="wg">
      <div className="wg-row"><span className="wg-ico">📊</span><p className="wg-ttl">Estadísticas</p></div>
      <div className="wg-grid4">
        <div><b>{stats.steps.toLocaleString()}</b><span>pasos</span></div>
        <div><b>{stats.caloriesBurned}</b><span>kcal</span></div>
        <div><b>{workoutHistory.length}</b><span>entrenos</span></div>
        <div><b>{(vol / 1000).toFixed(1)}t</b><span>volumen</span></div>
      </div>
    </div>
  );
}
function GoalsW() {
  const { stats } = useStore();
  const g = (l, v, max, c) => (
    <div className="wg-macro"><div className="wg-macro-h"><span>{l}</span><span>{Math.round(Math.min(v / max, 1) * 100)}%</span></div><Bar pct={(v / max) * 100} color={c} /></div>
  );
  return (
    <div className="wg">
      <div className="wg-row"><span className="wg-ico">🎯</span><p className="wg-ttl">Progreso de objetivos</p></div>
      {g('Pasos', stats.steps, stats.stepsGoal, 'var(--lime)')}
      {g('Calorías', stats.caloriesConsumed, stats.caloriesGoal, 'var(--orange)')}
      {g('Activo', stats.activeMinutes, stats.activeGoal, 'var(--lavender)')}
      {g('Agua', stats.water, stats.waterGoal, '#2bc0e4')}
    </div>
  );
}
function PetW() {
  const { pet, setActiveTab } = useStore();
  return (
    <div className="wg wg-pet" onClick={() => setActiveTab('pet')}>
      <span className="wg-pet-emoji">{PET_EMOJI[pet.physique]}</span>
      <div>
        <p className="wg-ttl">Tu mascota está {pet.mood}</p>
        <p className="wg-sub">Nivel {pet.level} · {pet.xp}/{pet.xpToNext} XP · 🔥{pet.streak}</p>
      </div>
      <span className="material-symbols-outlined" style={{ marginLeft: 'auto', color: 'var(--text-secondary)' }}>chevron_right</span>
    </div>
  );
}

export const WIDGET_COMPONENTS = {
  steps: StepsW, hr: HrW, burned: BurnedW, consumed: ConsumedW, water: WaterW,
  distance: DistanceW, active: ActiveW, streak: StreakW, macros: MacrosW,
  workouts: WorkoutsW, meals: MealsW, weight: WeightW, sleep: SleepW,
  stats: StatsW, goals: GoalsW, pet: PetW,
};

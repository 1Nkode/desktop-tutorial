import { useStore } from '../store/useStore';
import './Rewards.css';

export default function Rewards() {
  const { user, pet, stats, meals, workouts, workoutHistory } = useStore();

  // ---- Real, derived progress (no fake data) ----
  const totalWorkouts = (workouts?.length || 0) + (workoutHistory?.length || 0);
  const workoutDaysThisWeek = stats.weeklyWorkouts.filter(v => v > 0).length;
  const trainedToday = stats.weeklyWorkouts[stats.weeklyWorkouts.length - 1] > 0;
  const mealsLogged = meals?.length || 0;

  // Daily missions computed from today's real stats
  const missions = [
    { icon: '👟', title: 'Meta de pasos', desc: `Camina ${stats.stepsGoal.toLocaleString()} pasos`, progress: stats.steps, total: stats.stepsGoal, xp: 40 },
    { icon: '🏋️', title: 'Entrena hoy', desc: 'Completa un entrenamiento', progress: trainedToday ? 1 : 0, total: 1, xp: 50 },
    { icon: '🍎', title: 'Registra comidas', desc: 'Añade al menos 1 comida', progress: Math.min(mealsLogged, 1), total: 1, xp: 30 },
    { icon: '💧', title: 'Hidrátate', desc: `Bebe ${stats.waterGoal} vasos de agua`, progress: stats.water, total: stats.waterGoal, xp: 20 },
    { icon: '🔥', title: 'Quema calorías', desc: 'Quema 300 kcal activas', progress: stats.caloriesBurned, total: 300, xp: 30 },
  ].map(m => ({ ...m, done: m.progress >= m.total }));

  const dailyDone = missions.filter(m => m.done).length;
  const totalXpToday = missions.filter(m => m.done).reduce((s, m) => s + m.xp, 0);

  // Badges auto-earned from real milestones
  const badges = [
    { icon: '🔥', name: 'Primer paso', desc: 'Completa tu primer entreno', earned: totalWorkouts >= 1 },
    { icon: '💪', name: 'Constante', desc: '10 entrenos completados', earned: totalWorkouts >= 10 },
    { icon: '🏆', name: 'Dedicado', desc: '25 entrenos completados', earned: totalWorkouts >= 25 },
    { icon: '🦁', name: 'Bestia', desc: '50 entrenos completados', earned: totalWorkouts >= 50 },
    { icon: '⚡', name: 'En racha', desc: 'Racha de 7 días', earned: user.streak >= 7 },
    { icon: '🌟', name: 'Imparable', desc: 'Racha de 30 días', earned: user.streak >= 30 },
    { icon: '🎖️', name: 'Nivel 10', desc: 'Sube tu mascota a nivel 10', earned: pet.level >= 10 },
    { icon: '🥗', name: 'Nutrición', desc: 'Registra 20 comidas', earned: mealsLogged >= 20 },
  ];
  const earned = badges.filter(b => b.earned).length;

  // Weekly challenge from real training days
  const wcTarget = 4;
  const wcPct = Math.min((workoutDaysThisWeek / wcTarget) * 100, 100);

  return (
    <div className="rewards-page animate-fadeIn">
      <div className="rewards-header">
        <h2 className="section-title">Logros</h2>
        <div className="streak-pill">🔥 {user.streak} días de racha</div>
      </div>

      {/* Level card */}
      <div className="card level-card">
        <div className="level-left">
          <div className="level-badge"><span className="level-num">{pet.level}</span></div>
          <div>
            <p className="level-title">Nivel {pet.level}</p>
            <p className="level-sub">{pet.xp} / {pet.xpToNext} XP</p>
          </div>
        </div>
        <div className="xp-earned">+{totalXpToday} XP hoy</div>
        <div className="progress-bar" style={{ marginTop: 12, height: 10 }}>
          <div className="progress-fill" style={{ width: `${(pet.xp / pet.xpToNext) * 100}%`, background: 'linear-gradient(90deg, var(--lime), var(--lime-dim))' }} />
        </div>
      </div>

      {/* Daily missions */}
      <div className="card">
        <div className="section-header">
          <span className="section-title">Misiones de hoy</span>
          <span className="tag" style={{ background: 'rgba(204,255,0,0.15)', color: 'var(--lime)' }}>{dailyDone}/{missions.length}</span>
        </div>
        <div className="missions-list">
          {missions.map((m, i) => <MissionItem key={i} mission={m} />)}
        </div>
      </div>

      {/* Badges */}
      <div className="card">
        <div className="section-header">
          <span className="section-title">Insignias</span>
          <span className="tag" style={{ background: 'rgba(255,185,81,0.15)', color: 'var(--orange)' }}>{earned}/{badges.length}</span>
        </div>
        <div className="badges-grid">
          {badges.map((b, i) => <BadgeItem key={i} badge={b} />)}
        </div>
      </div>

      {/* Weekly challenge — real */}
      <div className="card weekly-challenge">
        <div className="wc-top">
          <div>
            <p className="wc-label">Reto semanal</p>
            <p className="wc-title">Entrena {wcTarget} días esta semana</p>
          </div>
          <span className="wc-reward">🏆 +200 XP</span>
        </div>
        <div className="progress-bar" style={{ marginTop: 14, height: 10 }}>
          <div className="progress-fill" style={{ width: `${wcPct}%`, background: 'linear-gradient(90deg, var(--orange), #FF9100)' }} />
        </div>
        <div className="wc-stats-row">
          <span className="wc-stat-text">{workoutDaysThisWeek} / {wcTarget} días entrenados</span>
          <span className="wc-days">{workoutDaysThisWeek >= wcTarget ? '¡Completado! 🎉' : 'Esta semana'}</span>
        </div>
      </div>

      <div style={{ height: 100 }} />
    </div>
  );
}

function MissionItem({ mission }) {
  const pct = Math.min((mission.progress / mission.total) * 100, 100);
  return (
    <div className={`mission-item ${mission.done ? 'done' : ''}`}>
      <div className="mission-icon">{mission.icon}</div>
      <div className="mission-info">
        <p className="mission-title">{mission.title}</p>
        <p className="mission-desc">{mission.desc}</p>
        {!mission.done && (
          <div style={{ marginTop: 6 }}>
            <div className="progress-bar" style={{ height: 5 }}>
              <div className="progress-fill" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--lime), var(--lime-dim))' }} />
            </div>
            <p className="mission-progress">{Math.round(mission.progress).toLocaleString()} / {mission.total.toLocaleString()}</p>
          </div>
        )}
      </div>
      <div className="mission-right">
        <span className="xp-tag">+{mission.xp} XP</span>
        {mission.done && <div className="done-check">✅</div>}
      </div>
    </div>
  );
}

function BadgeItem({ badge }) {
  return (
    <div className={`badge-item ${badge.earned ? 'earned' : 'locked'}`}>
      <div className="badge-icon">{badge.icon}</div>
      <p className="badge-name">{badge.name}</p>
      <p className="badge-desc">{badge.desc}</p>
      {!badge.earned && <div className="badge-lock">🔒</div>}
    </div>
  );
}

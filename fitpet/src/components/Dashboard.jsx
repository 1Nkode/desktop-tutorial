import { useStore } from '../store/useStore';
import './Dashboard.css';

function RingProgress({ value, max, color, size = 80, label, sublabel }) {
  const pct = Math.min(value / max, 1);
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);

  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E2E8F0" strokeWidth={8} />
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="ring-center">
        <span className="ring-label">{label}</span>
        <span className="ring-sub">{sublabel}</span>
      </div>
    </div>
  );
}

function WeeklyBar({ days, values, max }) {
  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return (
    <div className="weekly-bars">
      {values.map((v, i) => (
        <div key={i} className="bar-col">
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{
                height: `${(v / max) * 100}%`,
                background: i === 6 ? '#E2E8F0' : 'linear-gradient(180deg, var(--green), var(--blue))',
              }}
            />
          </div>
          <span className="bar-day">{dayLabels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user, stats, pet } = useStore();

  const netCalories = stats.caloriesConsumed - stats.caloriesBurned;
  const calPct = Math.min(stats.caloriesConsumed / stats.caloriesGoal, 1);
  const stepPct = Math.min(stats.steps / stats.stepsGoal, 1);

  return (
    <div className="dashboard animate-fadeIn">
      {/* Header */}
      <div className="dash-header">
        <div>
          <p className="greeting">Good morning! 👋</p>
          <h1 className="username">{user.name}</h1>
        </div>
        <div className="header-right">
          <div className="streak-badge">
            <span>🔥</span>
            <span>{user.streak}</span>
          </div>
          <div className="avatar" style={{ width: 48, height: 48, fontSize: 22 }}>😄</div>
        </div>
      </div>

      {/* Pet mini preview */}
      <div className="card pet-banner">
        <div className="pet-banner-left">
          <p className="pet-status-text">Your pet is <strong>{pet.mood}</strong>!</p>
          <p className="pet-sub">Keep up the good work 💪</p>
        </div>
        <div className="pet-mini animate-float">{
          pet.physique === 'strong' ? '🦁' :
          pet.physique === 'fit' ? '🐱' :
          pet.physique === 'chubby' ? '🐻' : '🐱'
        }</div>
        <div className="xp-pill">Lv.{pet.level} · {pet.xp}XP</div>
      </div>

      {/* Calorie ring + stats */}
      <div className="card stats-card">
        <div className="section-header">
          <span className="section-title">Today's Summary</span>
          <span className="tag" style={{ background: '#E8F5E9', color: 'var(--green-dark)' }}>
            {new Date().toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
        <div className="stats-main">
          <div className="calorie-ring-wrap">
            <RingProgress
              value={stats.caloriesConsumed}
              max={stats.caloriesGoal}
              color="var(--green)"
              size={110}
              label={`${stats.caloriesConsumed}`}
              sublabel="kcal"
            />
            <p className="calorie-label">Consumed</p>
          </div>
          <div className="mini-stats">
            <div className="mini-stat">
              <span className="mini-icon">🔥</span>
              <div>
                <p className="mini-val">{stats.caloriesBurned}</p>
                <p className="mini-key">Burned</p>
              </div>
            </div>
            <div className="mini-stat">
              <span className="mini-icon">⚖️</span>
              <div>
                <p className="mini-val" style={{ color: netCalories < 0 ? 'var(--green)' : 'var(--orange)' }}>
                  {netCalories > 0 ? '+' : ''}{netCalories}
                </p>
                <p className="mini-key">Net</p>
              </div>
            </div>
            <div className="mini-stat">
              <span className="mini-icon">⏱️</span>
              <div>
                <p className="mini-val">{stats.activeMinutes}</p>
                <p className="mini-key">Min active</p>
              </div>
            </div>
            <div className="mini-stat">
              <span className="mini-icon">💧</span>
              <div>
                <p className="mini-val">{stats.water}/{stats.waterGoal}</p>
                <p className="mini-key">Water</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="card steps-card">
        <div className="steps-row">
          <div>
            <p className="steps-num">{stats.steps.toLocaleString()}</p>
            <p className="steps-label">steps today</p>
          </div>
          <RingProgress
            value={stats.steps}
            max={stats.stepsGoal}
            color="var(--orange)"
            size={72}
            label={`${Math.round(stepPct * 100)}%`}
            sublabel=""
          />
        </div>
        <div className="progress-bar" style={{ marginTop: 12 }}>
          <div className="progress-fill" style={{
            width: `${stepPct * 100}%`,
            background: 'linear-gradient(90deg, var(--orange), var(--orange-light))'
          }} />
        </div>
        <p className="steps-remain">{(stats.stepsGoal - stats.steps).toLocaleString()} steps to goal</p>
      </div>

      {/* Weekly activity */}
      <div className="card">
        <div className="section-header">
          <span className="section-title">Weekly Activity</span>
          <span className="tag" style={{ background: '#EEF2FF', color: 'var(--blue)' }}>This week</span>
        </div>
        <WeeklyBar values={stats.weeklyWorkouts} max={7} />
      </div>

      {/* Quick actions */}
      <div className="quick-actions">
        <QuickAction icon="🍎" label="Log Meal" color="#E8F5E9" iconBg="var(--green)" />
        <QuickAction icon="🏃" label="Log Workout" color="#E3F2FD" iconBg="var(--blue)" />
        <QuickAction icon="💧" label="Add Water" color="#FFF3E0" iconBg="var(--orange)" />
        <QuickAction icon="📸" label="Share" color="#F3E5F5" iconBg="var(--purple)" />
      </div>

      <div style={{ height: 100 }} />
    </div>
  );
}

function QuickAction({ icon, label, color, iconBg }) {
  return (
    <div className="quick-action" style={{ background: color }}>
      <div className="qa-icon" style={{ background: iconBg }}>{icon}</div>
      <span className="qa-label">{label}</span>
    </div>
  );
}

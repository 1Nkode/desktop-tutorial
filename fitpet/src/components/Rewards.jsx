import { useStore } from '../store/useStore';
import './Rewards.css';

export default function Rewards() {
  const { missions, badges, user, pet, completeMission } = useStore();

  const dailyDone = missions.filter(m => m.done).length;
  const totalXpToday = missions.filter(m => m.done).reduce((s, m) => s + m.xp, 0);

  return (
    <div className="rewards-page animate-fadeIn">
      <div className="rewards-header">
        <h2 className="section-title">Rewards</h2>
        <div className="streak-pill">🔥 {user.streak} day streak</div>
      </div>

      {/* Level card */}
      <div className="card level-card">
        <div className="level-left">
          <div className="level-badge">
            <span className="level-num">{pet.level}</span>
          </div>
          <div>
            <p className="level-title">Level {pet.level} Warrior</p>
            <p className="level-sub">{pet.xp} / {pet.xpToNext} XP</p>
          </div>
        </div>
        <div className="xp-earned">+{totalXpToday} XP today</div>
        <div className="progress-bar" style={{ marginTop: 12, height: 10 }}>
          <div
            className="progress-fill"
            style={{
              width: `${(pet.xp / pet.xpToNext) * 100}%`,
              background: 'linear-gradient(90deg, var(--green), var(--blue))',
            }}
          />
        </div>
      </div>

      {/* Daily missions */}
      <div className="card">
        <div className="section-header">
          <span className="section-title">Daily Missions</span>
          <span className="tag" style={{ background: 'rgba(204,255,0,0.15)', color: 'var(--lime)' }}>
            {dailyDone}/{missions.length} done
          </span>
        </div>
        <div className="missions-list">
          {missions.map(m => (
            <MissionItem key={m.id} mission={m} onComplete={() => completeMission(m.id)} />
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="card">
        <div className="section-header">
          <span className="section-title">Badges</span>
          <span className="tag" style={{ background: 'rgba(255,185,81,0.15)', color: 'var(--orange)' }}>
            {badges.filter(b => b.earned).length}/{badges.length} earned
          </span>
        </div>
        <div className="badges-grid">
          {badges.map(b => (
            <BadgeItem key={b.id} badge={b} />
          ))}
        </div>
      </div>

      {/* Weekly challenge */}
      <div className="card weekly-challenge">
        <div className="wc-top">
          <div>
            <p className="wc-label">Weekly Challenge</p>
            <p className="wc-title">Burn 2,500 kcal this week</p>
          </div>
          <span className="wc-reward">🏆 +200 XP</span>
        </div>
        <div className="progress-bar" style={{ marginTop: 14, height: 10 }}>
          <div
            className="progress-fill"
            style={{
              width: '64%',
              background: 'linear-gradient(90deg, var(--orange), #FF9100)',
            }}
          />
        </div>
        <div className="wc-stats-row">
          <span className="wc-stat-text">1,600 / 2,500 kcal burned</span>
          <span className="wc-days">4 days left</span>
        </div>
      </div>

      <div style={{ height: 100 }} />
    </div>
  );
}

function MissionItem({ mission, onComplete }) {
  return (
    <div className={`mission-item ${mission.done ? 'done' : ''}`}>
      <div className="mission-icon">{mission.icon}</div>
      <div className="mission-info">
        <p className="mission-title">{mission.title}</p>
        <p className="mission-desc">{mission.desc}</p>
        {!mission.done && mission.progress !== undefined && (
          <div style={{ marginTop: 6 }}>
            <div className="progress-bar" style={{ height: 5 }}>
              <div
                className="progress-fill"
                style={{
                  width: `${(mission.progress / mission.total) * 100}%`,
                  background: 'linear-gradient(90deg, var(--green), var(--blue))',
                }}
              />
            </div>
            <p className="mission-progress">{mission.progress.toLocaleString()} / {mission.total.toLocaleString()}</p>
          </div>
        )}
      </div>
      <div className="mission-right">
        <span className="xp-tag">+{mission.xp} XP</span>
        {!mission.done ? (
          <button className="btn btn-sm btn-primary" style={{ marginTop: 6 }} onClick={onComplete}>Claim</button>
        ) : (
          <div className="done-check">✅</div>
        )}
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

import { useState } from 'react';
import { useStore } from '../store/useStore';
import ProfileEdit from './ProfileEdit';
import { Avatar } from './Avatar';
import './Profile.css';

const PET_EMOJI = { strong: '🦁', fit: '🐆', chubby: '🐻', normal: '🐱' };

export default function Profile() {
  const { user, pet, stats, badges, workouts, meals, feed, setActiveTab } = useStore();
  const [editing, setEditing] = useState(false);

  const myPosts = feed.filter(p => p.user === user.name);
  const earnedBadges = badges.filter(b => b.earned);
  const totalBurned = workouts.reduce((s, w) => s + w.calories, 0);
  const totalMinutes = workouts.reduce((s, w) => s + w.duration, 0);
  const xpPct = (pet.xp / pet.xpToNext) * 100;

  return (
    <div className="profile-page animate-fadeIn">
      {/* Cover + avatar */}
      <div className="profile-cover">
        <button className="cover-back" onClick={() => setActiveTab('dashboard')}>‹</button>
        <button className="cover-edit" onClick={() => setEditing(true)}>Editar ✏️</button>
      </div>

      <div className="profile-head">
        <Avatar user={user} size={88} className="profile-avatar" />
        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-handle">@{user.username} · 🔥 {user.streak} días</p>
        <p className="profile-bio">{user.bio}</p>
        <p className="profile-goal">🎯 {user.goal}</p>

        <div className="profile-stats">
          <Stat value={myPosts.length} label="Posts" />
          <Stat value={user.followers} label="Seguidores" />
          <Stat value={user.following} label="Seguidos" />
        </div>
      </div>

      {editing && <ProfileEdit onClose={() => setEditing(false)} />}

      {/* Level / XP */}
      <div className="card profile-level">
        <div className="pl-row">
          <div className="pl-badge">{pet.level}</div>
          <div className="pl-info">
            <p className="pl-title">Level {pet.level}</p>
            <p className="pl-sub">{pet.xp} / {pet.xpToNext} XP to next level</p>
          </div>
          <div className="pl-pet">{PET_EMOJI[pet.physique]}</div>
        </div>
        <div className="progress-bar" style={{ marginTop: 12, height: 10 }}>
          <div className="progress-fill" style={{ width: `${xpPct}%`, background: 'linear-gradient(90deg, var(--green), var(--blue))' }} />
        </div>
      </div>

      {/* Lifetime stats */}
      <div className="card">
        <h3 className="section-title" style={{ marginBottom: 14 }}>Lifetime Stats</h3>
        <div className="life-grid">
          <LifeStat icon="🔥" value={totalBurned.toLocaleString()} label="kcal burned" color="var(--orange)" />
          <LifeStat icon="💪" value={workouts.length} label="workouts" color="var(--blue)" />
          <LifeStat icon="⏱️" value={`${totalMinutes}m`} label="active time" color="var(--purple)" />
          <LifeStat icon="🍽️" value={meals.length} label="meals logged" color="var(--green)" />
          <LifeStat icon="👟" value={stats.steps.toLocaleString()} label="steps today" color="var(--orange)" />
          <LifeStat icon="🏆" value={earnedBadges.length} label="badges" color="#F57F17" />
        </div>
      </div>

      {/* Badges */}
      <div className="card">
        <div className="section-header">
          <span className="section-title">Achievements</span>
          <button className="see-all" onClick={() => setActiveTab('rewards')}>See all</button>
        </div>
        <div className="profile-badges">
          {earnedBadges.map(b => (
            <div key={b.id} className="profile-badge" title={b.desc}>
              <div className="pb-icon">{b.icon}</div>
              <p className="pb-name">{b.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* My posts */}
      <div className="card">
        <div className="section-header">
          <span className="section-title">My Posts</span>
          <button className="see-all" onClick={() => setActiveTab('social')}>Go to feed</button>
        </div>
        {myPosts.length === 0 ? (
          <p className="empty-posts">You haven't posted yet. Share your progress from the feed! 📸</p>
        ) : (
          <div className="my-posts">
            {myPosts.map(p => (
              <div key={p.id} className="my-post">
                <p className="mp-content">{p.content}</p>
                <div className="mp-meta">
                  <span>❤️ {p.likes}</span>
                  <span>💬 {p.comments.length}</span>
                  <span className="mp-time">{p.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ height: 100 }} />
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="profile-stat">
      <p className="ps-value">{value}</p>
      <p className="ps-label">{label}</p>
    </div>
  );
}

function LifeStat({ icon, value, label, color }) {
  return (
    <div className="life-stat">
      <div className="ls-icon" style={{ background: color + '22' }}>{icon}</div>
      <div>
        <p className="ls-value">{value}</p>
        <p className="ls-label">{label}</p>
      </div>
    </div>
  );
}

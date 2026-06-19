import { useState } from 'react';
import { useStore } from '../store/useStore';
import './Social.css';

const challenges = [
  { id: 1, title: '10K Steps Challenge', participants: 128, daysLeft: 3, icon: '👟', joined: true, leader: 'Maria G.' },
  { id: 2, title: '7-Day Plank Challenge', participants: 64, daysLeft: 5, icon: '💪', joined: false, leader: 'Carlos M.' },
  { id: 3, title: 'No Sugar Week', participants: 89, daysLeft: 2, icon: '🍎', joined: false, leader: 'Ana P.' },
];

const leaderboard = [
  { rank: 1, name: 'Maria G.', avatar: '🏃‍♀️', points: 2840, badge: '🥇' },
  { rank: 2, name: 'Carlos M.', avatar: '💪', points: 2650, badge: '🥈' },
  { rank: 3, name: 'Alex (You)', avatar: '😄', points: 2410, badge: '🥉', isMe: true },
  { rank: 4, name: 'Ana P.', avatar: '🧘‍♀️', points: 2200, badge: null },
  { rank: 5, name: 'Luis R.', avatar: '🏋️', points: 1980, badge: null },
];

export default function Social() {
  const { feed, toggleLike } = useStore();
  const [activeSection, setActiveSection] = useState('feed');

  return (
    <div className="social-page animate-fadeIn">
      {/* Header with user profile bar */}
      <div className="social-header">
        <div className="my-profile">
          <div className="avatar" style={{ width: 44, height: 44 }}>😄</div>
          <div>
            <p className="my-name">Alex</p>
            <p className="my-stats">128 followers · 94 following</p>
          </div>
        </div>
        <button className="btn btn-primary btn-sm">+ Post</button>
      </div>

      {/* Section tabs */}
      <div className="social-tabs">
        {['feed', 'challenges', 'leaderboard'].map(s => (
          <button
            key={s}
            className={`social-tab ${activeSection === s ? 'active' : ''}`}
            onClick={() => setActiveSection(s)}
          >
            {s === 'feed' ? '📰 Feed' : s === 'challenges' ? '⚔️ Challenges' : '🏆 Rankings'}
          </button>
        ))}
      </div>

      {activeSection === 'feed' && (
        <div className="feed">
          {feed.map(post => (
            <PostCard key={post.id} post={post} onLike={() => toggleLike(post.id)} />
          ))}
        </div>
      )}

      {activeSection === 'challenges' && (
        <div className="challenges">
          <p className="section-desc">Compete with friends in weekly challenges!</p>
          {challenges.map(c => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
        </div>
      )}

      {activeSection === 'leaderboard' && (
        <div className="leaderboard-section">
          <p className="section-desc">Weekly activity rankings</p>
          {leaderboard.map(user => (
            <LeaderCard key={user.rank} user={user} />
          ))}
        </div>
      )}

      <div style={{ height: 100 }} />
    </div>
  );
}

function PostCard({ post, onLike }) {
  const typeColors = {
    workout: { bg: '#E3F2FD', color: 'var(--blue)', label: '💪 Workout' },
    meal: { bg: '#E8F5E9', color: 'var(--green-dark)', label: '🍽️ Meal' },
    achievement: { bg: '#FFF8E1', color: '#F57F17', label: '🏆 Achievement' },
  };
  const tc = typeColors[post.type] || typeColors.workout;

  return (
    <div className="card post-card">
      <div className="post-header">
        <div className="avatar">{post.avatar}</div>
        <div className="post-meta">
          <p className="post-user">{post.user}</p>
          <p className="post-time">{post.time}</p>
        </div>
        <div className="tag" style={{ background: tc.bg, color: tc.color }}>{tc.label}</div>
      </div>

      <p className="post-content">{post.content}</p>

      {post.calories && (
        <div className="post-cal-badge">
          🔥 {post.calories} kcal
        </div>
      )}

      <div className="post-actions">
        <button className={`post-btn ${post.liked ? 'liked' : ''}`} onClick={onLike}>
          {post.liked ? '❤️' : '🤍'} {post.likes}
        </button>
        <button className="post-btn">
          💬 {post.comments}
        </button>
        <button className="post-btn">
          📤 Share
        </button>
      </div>
    </div>
  );
}

function ChallengeCard({ challenge }) {
  const [joined, setJoined] = useState(challenge.joined);

  return (
    <div className="card challenge-card">
      <div className="challenge-icon">{challenge.icon}</div>
      <div className="challenge-info">
        <p className="challenge-title">{challenge.title}</p>
        <p className="challenge-meta">
          👥 {challenge.participants} participants · {challenge.daysLeft} days left
        </p>
        <p className="challenge-leader">🏆 Leader: {challenge.leader}</p>
      </div>
      <button
        className={`btn btn-sm ${joined ? 'btn-outline' : 'btn-primary'}`}
        onClick={() => setJoined(!joined)}
      >
        {joined ? 'Joined ✓' : 'Join'}
      </button>
    </div>
  );
}

function LeaderCard({ user }) {
  return (
    <div className={`card leader-card ${user.isMe ? 'is-me' : ''}`}>
      <div className="rank-num" style={{ color: user.rank <= 3 ? 'var(--orange)' : 'var(--text-secondary)' }}>
        {user.badge || `#${user.rank}`}
      </div>
      <div className="avatar">{user.avatar}</div>
      <div className="leader-info">
        <p className="leader-name">{user.name} {user.isMe && <span className="you-tag">You</span>}</p>
      </div>
      <div className="leader-points">
        <p className="points-num">{user.points.toLocaleString()}</p>
        <p className="points-label">pts</p>
      </div>
    </div>
  );
}

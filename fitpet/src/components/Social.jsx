import { useState } from 'react';
import { useStore } from '../store/useStore';
import './Social.css';

const initialChallenges = [
  { id: 1, title: '10K Steps Challenge', participants: 128, daysLeft: 3, icon: '👟', joined: true, leader: 'Maria G.' },
  { id: 2, title: '7-Day Plank Challenge', participants: 64, daysLeft: 5, icon: '💪', joined: false, leader: 'Carlos M.' },
  { id: 3, title: 'No Sugar Week', participants: 89, daysLeft: 2, icon: '🍎', joined: false, leader: 'Ana P.' },
];

export default function Social() {
  const { feed, toggleLike, addComment, user, setShowAddPost, setActiveTab } = useStore();
  const [activeSection, setActiveSection] = useState('feed');
  const [challenges, setChallenges] = useState(initialChallenges);

  const toggleJoin = (id) => setChallenges(cs => cs.map(c =>
    c.id === id
      ? { ...c, joined: !c.joined, participants: c.joined ? c.participants - 1 : c.participants + 1 }
      : c
  ));

  const leaderboard = [
    { rank: 1, name: 'Maria G.', avatar: '🏃‍♀️', points: 2840, badge: '🥇' },
    { rank: 2, name: 'Carlos M.', avatar: '💪', points: 2650, badge: '🥈' },
    { rank: 3, name: user.name, avatar: '😄', points: 2410, badge: '🥉', isMe: true },
    { rank: 4, name: 'Ana P.', avatar: '🧘‍♀️', points: 2200, badge: null },
    { rank: 5, name: 'Luis R.', avatar: '🏋️', points: 1980, badge: null },
  ];

  return (
    <div className="social-page animate-fadeIn">
      {/* Header with user profile bar */}
      <div className="social-header">
        <div className="my-profile" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('profile')}>
          <div className="avatar" style={{ width: 44, height: 44 }}>😄</div>
          <div>
            <p className="my-name">{user.name}</p>
            <p className="my-stats">{user.followers} followers · {user.following} following</p>
          </div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddPost(true)}>+ Post</button>
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
            <PostCard key={post.id} post={post} onLike={() => toggleLike(post.id)} onComment={addComment} />
          ))}
        </div>
      )}

      {activeSection === 'challenges' && (
        <div className="challenges">
          <p className="section-desc">Compete with friends in weekly challenges!</p>
          {challenges.map(c => (
            <ChallengeCard key={c.id} challenge={c} onToggle={() => toggleJoin(c.id)} />
          ))}
        </div>
      )}

      {activeSection === 'leaderboard' && (
        <div className="leaderboard-section">
          <p className="section-desc">Weekly activity rankings</p>
          {leaderboard.map(u => (
            <LeaderCard key={u.rank} user={u} />
          ))}
        </div>
      )}

      <div style={{ height: 100 }} />
    </div>
  );
}

function PostCard({ post, onLike, onComment }) {
  const typeColors = {
    workout: { bg: 'rgba(194,193,255,0.15)', color: 'var(--lavender)', label: '💪 Workout' },
    meal: { bg: 'rgba(204,255,0,0.15)', color: 'var(--lime)', label: '🍽️ Meal' },
    achievement: { bg: 'rgba(255,185,81,0.15)', color: 'var(--orange)', label: '🏆 Achievement' },
  };
  const tc = typeColors[post.type] || typeColors.workout;
  const [showComments, setShowComments] = useState(false);
  const [draft, setDraft] = useState('');
  const [shared, setShared] = useState(false);

  const submitComment = () => {
    if (!draft.trim()) return;
    onComment(post.id, draft.trim());
    setDraft('');
  };

  const handleShare = async () => {
    const text = `${post.user}: ${post.content}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'FitPet', text });
      } else {
        await navigator.clipboard?.writeText(text);
      }
    } catch { /* user dismissed share sheet */ }
    setShared(true);
    setTimeout(() => setShared(false), 1500);
  };

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
        <div className="post-cal-badge">🔥 {post.calories} kcal</div>
      )}

      <div className="post-actions">
        <button className={`post-btn ${post.liked ? 'liked' : ''}`} onClick={onLike}>
          {post.liked ? '❤️' : '🤍'} {post.likes}
        </button>
        <button className={`post-btn ${showComments ? 'active' : ''}`} onClick={() => setShowComments(v => !v)}>
          💬 {post.comments.length}
        </button>
        <button className="post-btn" onClick={handleShare}>
          {shared ? '✅ Shared' : '📤 Share'}
        </button>
      </div>

      {showComments && (
        <div className="comments">
          {post.comments.map(c => (
            <div key={c.id} className="comment">
              <span className="comment-user">{c.user}</span>
              <span className="comment-text">{c.text}</span>
            </div>
          ))}
          {post.comments.length === 0 && <p className="no-comments">Be the first to comment</p>}
          <div className="comment-input-row">
            <input
              className="input comment-input"
              placeholder="Add a comment..."
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submitComment()}
            />
            <button className="btn btn-primary btn-sm" onClick={submitComment} disabled={!draft.trim()}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ChallengeCard({ challenge, onToggle }) {
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
        className={`btn btn-sm ${challenge.joined ? 'btn-outline' : 'btn-primary'}`}
        onClick={onToggle}
      >
        {challenge.joined ? 'Joined ✓' : 'Join'}
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

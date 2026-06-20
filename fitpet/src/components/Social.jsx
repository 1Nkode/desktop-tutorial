import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { playSound } from '../sound';
import './Social.css';
import './SocialIG.css';

const initialChallenges = [
  { id: 1, title: '10K Steps Challenge', participants: 128, daysLeft: 3, icon: '👟', joined: true, leader: 'Maria G.' },
  { id: 2, title: '7-Day Plank Challenge', participants: 64, daysLeft: 5, icon: '💪', joined: false, leader: 'Carlos M.' },
  { id: 3, title: 'No Sugar Week', participants: 89, daysLeft: 2, icon: '🍎', joined: false, leader: 'Ana P.' },
];

const TRENDING = ['#transformación', '#PR', '#mealprep', '#5K', '#piernas', '#streak', '#nochesinexcusas'];

export default function Social() {
  const { feed, stories, toggleLike, toggleSave, addComment, addReply, toggleFollow, following, user, pet, setShowAddPost, setActiveTab, markStorySeen } = useStore();
  const [section, setSection] = useState('feed');
  const [challenges, setChallenges] = useState(initialChallenges);
  const [storyIdx, setStoryIdx] = useState(null);     // index into stories for viewer
  const [commentsFor, setCommentsFor] = useState(null);
  const [visible, setVisible] = useState(8);           // infinite scroll window

  const toggleJoin = (id) => setChallenges(cs => cs.map(c =>
    c.id === id ? { ...c, joined: !c.joined, participants: c.joined ? c.participants - 1 : c.participants + 1 } : c));

  const leaderboard = [
    { rank: 1, name: 'Maria G.', avatar: '🏃‍♀️', points: 2840, badge: '🥇' },
    { rank: 2, name: 'Carlos M.', avatar: '💪', points: 2650, badge: '🥈' },
    { rank: 3, name: user.name, avatar: '😄', points: 2410, badge: '🥉', isMe: true },
    { rank: 4, name: 'Ana P.', avatar: '🧘‍♀️', points: 2200, badge: null },
    { rank: 5, name: 'Luis R.', avatar: '🏋️', points: 1980, badge: null },
  ];

  // infinite scroll
  useEffect(() => {
    if (section !== 'feed') return;
    const onScroll = () => {
      const el = document.querySelector('.main-content');
      if (!el) return;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 400) setVisible(v => Math.min(v + 4, feed.length));
    };
    const el = document.querySelector('.main-content');
    el?.addEventListener('scroll', onScroll);
    return () => el?.removeEventListener('scroll', onScroll);
  }, [section, feed.length]);

  const commentPost = commentsFor != null ? feed.find(p => p.id === commentsFor) : null;

  return (
    <div className="social-page animate-fadeIn">
      <div className="social-header">
        <div className="my-profile" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('profile')}>
          <div className="avatar" style={{ width: 40, height: 40 }}>😄</div>
          <div>
            <p className="my-name">{user.name}</p>
            <p className="my-stats">{user.followers} seguidores</p>
          </div>
        </div>
        <button className="ig-post-btn" onClick={() => setShowAddPost(true)}>
          <span className="material-symbols-outlined">add_box</span>
        </button>
      </div>

      <div className="social-tabs">
        {[['feed', '📰 Feed'], ['explore', '🔍 Explorar'], ['challenges', '⚔️ Retos'], ['leaderboard', '🏆 Rankings']].map(([s, l]) => (
          <button key={s} className={`social-tab ${section === s ? 'active' : ''}`} onClick={() => setSection(s)}>{l}</button>
        ))}
      </div>

      {section === 'feed' && (
        <>
          {/* Stories bar */}
          <div className="stories-bar">
            <div className="story-item" onClick={() => setShowAddPost(true)}>
              <div className="story-ring add"><div className="story-av">😄</div><span className="story-plus">+</span></div>
              <span className="story-name">Tu historia</span>
            </div>
            {stories.map((st, i) => (
              <div className="story-item" key={st.id} onClick={() => { setStoryIdx(i); markStorySeen(st.id); }}>
                <div className={`story-ring ${st.seen ? 'seen' : ''}`}><div className="story-av">{st.avatar}</div></div>
                <span className="story-name">{st.user.split(' ')[0]}</span>
              </div>
            ))}
          </div>

          <div className="feed">
            {feed.slice(0, visible).map(post => (
              <PostCard key={post.id} post={post} me={user.name} following={following}
                onLike={() => toggleLike(post.id)} onSave={() => toggleSave(post.id)}
                onFollow={() => toggleFollow(post.user)} onOpenComments={() => setCommentsFor(post.id)} />
            ))}
            {visible < feed.length && <p className="feed-loading">Cargando más… ⏳</p>}
          </div>
        </>
      )}

      {section === 'explore' && <Explore feed={feed} onOpen={(id) => { setSection('feed'); setCommentsFor(id); }} />}

      {section === 'challenges' && (
        <div className="challenges">
          <p className="section-desc">Compite con la comunidad en retos semanales</p>
          {challenges.map(c => <ChallengeCard key={c.id} challenge={c} onToggle={() => toggleJoin(c.id)} />)}
        </div>
      )}

      {section === 'leaderboard' && (
        <div className="leaderboard-section">
          <p className="section-desc">Ranking de actividad semanal</p>
          {leaderboard.map(u => <LeaderCard key={u.rank} user={u} />)}
        </div>
      )}

      <div style={{ height: 100 }} />

      {storyIdx != null && <StoryViewer stories={stories} startIdx={storyIdx} onClose={() => setStoryIdx(null)} markSeen={markStorySeen} />}
      {commentPost && <CommentsSheet post={commentPost} me={user.name} onClose={() => setCommentsFor(null)} onAdd={addComment} onReply={addReply} />}
    </div>
  );
}

/* ---------------- Post ---------------- */
function PostCard({ post, me, following, onLike, onSave, onFollow, onOpenComments }) {
  const typeMeta = {
    workout: { color: 'var(--lavender)', label: '💪 Entreno' },
    meal: { color: 'var(--lime)', label: '🍽️ Comida' },
    achievement: { color: 'var(--orange)', label: '🏆 Logro' },
    pr: { color: '#FFD54F', label: '🏆 PR' },
    progress: { color: '#ff7a59', label: '📸 Progreso' },
  };
  const tc = typeMeta[post.type] || typeMeta.workout;
  const isMe = post.user === me;
  const isFollowing = following.includes(post.user);
  const [burst, setBurst] = useState(false);
  const lastTap = useRef(0);

  function dblLike() {
    if (!post.liked) onLike();
    setBurst(true); playSound('tap');
    setTimeout(() => setBurst(false), 700);
  }
  function onImgClick() {
    const now = Date.now();
    if (now - lastTap.current < 300) dblLike();
    lastTap.current = now;
  }

  return (
    <div className="ig-post">
      <div className="ig-post-head">
        <div className="avatar" style={{ width: 36, height: 36, fontSize: 16 }}>{post.avatar}</div>
        <div className="ig-post-user">
          <span className="ig-name">{post.user}</span>
          <span className="ig-time">{post.time}</span>
        </div>
        <span className="tag" style={{ background: tc.color + '22', color: tc.color }}>{tc.label}</span>
        {!isMe && (
          <button className={`ig-follow ${isFollowing ? 'on' : ''}`} onClick={onFollow}>
            {isFollowing ? 'Siguiendo' : 'Seguir'}
          </button>
        )}
      </div>

      {post.image && (
        <div className="ig-img-wrap" onClick={onImgClick} onDoubleClick={dblLike}>
          <img className="ig-img" src={post.image} alt="" loading="lazy" />
          {post.petLevel && <span className="ig-pet-badge">🐸 Lv.{post.petLevel}</span>}
          {burst && <span className="ig-heart-burst">❤️</span>}
        </div>
      )}

      <div className="ig-actions">
        <button className={`ig-act ${post.liked ? 'liked' : ''}`} onClick={onLike}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: post.liked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
        </button>
        <button className="ig-act" onClick={onOpenComments}><span className="material-symbols-outlined">chat_bubble</span></button>
        <button className="ig-act"><span className="material-symbols-outlined">send</span></button>
        <button className={`ig-act save ${post.saved ? 'on' : ''}`} onClick={onSave}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: post.saved ? "'FILL' 1" : "'FILL' 0" }}>bookmark</span>
        </button>
      </div>

      <div className="ig-body">
        <p className="ig-likes">{post.likes} me gusta</p>
        <p className="ig-caption"><strong>{post.user}</strong> {post.content}</p>
        {post.calories && <span className="ig-stat-pill">🔥 {post.calories} kcal</span>}
        {post.comments.length > 0 && (
          <button className="ig-view-comments" onClick={onOpenComments}>Ver los {post.comments.length} comentarios</button>
        )}
      </div>
    </div>
  );
}

/* ---------------- Comments sheet (with replies) ---------------- */
function CommentsSheet({ post, me, onClose, onAdd, onReply }) {
  const [draft, setDraft] = useState('');
  const [replyTo, setReplyTo] = useState(null);   // comment id

  function send() {
    if (!draft.trim()) return;
    if (replyTo) onReply(post.id, replyTo, draft.trim());
    else onAdd(post.id, draft.trim());
    setDraft(''); setReplyTo(null);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal animate-slideUp ig-comments" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h3 className="modal-title" style={{ marginBottom: 14 }}>Comentarios</h3>
        <div className="ig-comment-list">
          {post.comments.length === 0 && <p className="no-comments">Sé el primero en comentar ✍️</p>}
          {post.comments.map(c => (
            <div key={c.id} className="ig-comment">
              <div className="avatar" style={{ width: 30, height: 30, fontSize: 14 }}>{c.user[0]}</div>
              <div className="ig-comment-body">
                <p className="ig-comment-text"><strong>{c.user}</strong> {c.text}</p>
                <button className="ig-reply-btn" onClick={() => setReplyTo(c.id)}>Responder</button>
                {(c.replies || []).map(r => (
                  <p key={r.id} className="ig-reply"><strong>{r.user}</strong> {r.text}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="ig-comment-input">
          {replyTo && <span className="ig-replying">Respondiendo… <button onClick={() => setReplyTo(null)}>✕</button></span>}
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input" placeholder={replyTo ? 'Tu respuesta…' : 'Añade un comentario…'} value={draft}
              onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} autoFocus />
            <button className="btn btn-primary btn-sm" onClick={send} disabled={!draft.trim()}>Enviar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Story viewer ---------------- */
function StoryViewer({ stories, startIdx, onClose, markSeen }) {
  const [idx, setIdx] = useState(startIdx);
  const [item, setItem] = useState(0);
  const [progress, setProgress] = useState(0);
  const story = stories[idx];

  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    const dur = 4000;
    const t = setInterval(() => {
      const p = Math.min((Date.now() - start) / dur, 1);
      setProgress(p);
      if (p >= 1) { clearInterval(t); next(); }
    }, 50);
    return () => clearInterval(t);
  }, [idx, item]);

  function next() {
    if (item < story.items.length - 1) setItem(i => i + 1);
    else if (idx < stories.length - 1) { markSeen(stories[idx + 1].id); setIdx(idx + 1); setItem(0); }
    else onClose();
  }
  function prev() {
    if (item > 0) setItem(i => i - 1);
    else if (idx > 0) { setIdx(idx - 1); setItem(0); }
  }

  const it = story.items[item];
  return (
    <div className="sv-overlay">
      <div className="sv-progress">
        {story.items.map((_, i) => (
          <div key={i} className="sv-bar"><div className="sv-bar-fill" style={{ width: i < item ? '100%' : i === item ? `${progress * 100}%` : '0%' }} /></div>
        ))}
      </div>
      <div className="sv-head">
        <div className="avatar" style={{ width: 32, height: 32, fontSize: 15 }}>{story.avatar}</div>
        <span className="sv-user">{story.user}</span>
        <button className="sv-close" onClick={onClose}>✕</button>
      </div>
      <div className="sv-tap left" onClick={prev} />
      <div className="sv-tap right" onClick={next} />
      <div className="sv-content" style={it.image ? { backgroundImage: `url(${it.image})` } : { background: 'linear-gradient(135deg,#1a2a00,#0e0e0e)' }}>
        {it.kind === 'poll' ? (
          <div className="sv-poll">
            <p className="sv-poll-q">{it.text}</p>
            {it.options.map(o => <button key={o} className="sv-poll-opt" onClick={next}>{o}</button>)}
          </div>
        ) : (
          <div className="sv-caption">{it.text}</div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Explore ---------------- */
function Explore({ feed, onOpen }) {
  const withImg = feed.filter(p => p.image);
  return (
    <div className="explore">
      <div className="ex-trending">
        {TRENDING.map(t => <span key={t} className="ex-tag">{t}</span>)}
      </div>
      <div className="section-header"><span className="section-title">Destacados</span></div>
      <div className="ex-featured">
        {[['Maria G.', '🏃‍♀️', '12.4k'], ['Carlos M.', '💪', '8.1k'], ['Ana P.', '🧘‍♀️', '5.6k']].map(([n, a, f]) => (
          <div className="ex-user" key={n}>
            <div className="avatar" style={{ width: 54, height: 54, fontSize: 24 }}>{a}</div>
            <p className="ex-user-name">{n}</p>
            <p className="ex-user-f">{f} seg.</p>
            <button className="ex-follow">Seguir</button>
          </div>
        ))}
      </div>
      <div className="section-header"><span className="section-title">Explorar</span></div>
      <div className="ex-grid">
        {withImg.concat(withImg).map((p, i) => (
          <div className="ex-cell" key={i} onClick={() => onOpen(p.id)}>
            <img src={p.image} alt="" loading="lazy" />
            <span className="ex-cell-type">{p.type === 'meal' ? '🍽️' : p.type === 'pr' ? '🏆' : '💪'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChallengeCard({ challenge, onToggle }) {
  return (
    <div className="card challenge-card">
      <div className="challenge-icon">{challenge.icon}</div>
      <div className="challenge-info">
        <p className="challenge-title">{challenge.title}</p>
        <p className="challenge-meta">👥 {challenge.participants} · {challenge.daysLeft} días</p>
        <p className="challenge-leader">🏆 Líder: {challenge.leader}</p>
      </div>
      <button className={`btn btn-sm ${challenge.joined ? 'btn-outline' : 'btn-primary'}`} onClick={onToggle}>
        {challenge.joined ? 'Unido ✓' : 'Unirme'}
      </button>
    </div>
  );
}

function LeaderCard({ user }) {
  return (
    <div className={`card leader-card ${user.isMe ? 'is-me' : ''}`}>
      <div className="rank-num" style={{ color: user.rank <= 3 ? 'var(--orange)' : 'var(--text-secondary)' }}>{user.badge || `#${user.rank}`}</div>
      <div className="avatar">{user.avatar}</div>
      <div className="leader-info"><p className="leader-name">{user.name} {user.isMe && <span className="you-tag">Tú</span>}</p></div>
      <div className="leader-points"><p className="points-num">{user.points.toLocaleString()}</p><p className="points-label">pts</p></div>
    </div>
  );
}

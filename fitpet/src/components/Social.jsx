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
  const { feed, stories, toggleLike, toggleSave, addComment, addReply, toggleFollow, following, friendActivity, discoverUsers, user, pet, setShowAddPost, setActiveTab, markStorySeen } = useStore();
  const [section, setSection] = useState('feed');
  const [challenges, setChallenges] = useState(initialChallenges);
  const [storyIdx, setStoryIdx] = useState(null);     // index into stories for viewer
  const [commentsFor, setCommentsFor] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [visible, setVisible] = useState(8);           // infinite scroll window

  const toggleJoin = (id) => setChallenges(cs => cs.map(c =>
    c.id === id ? { ...c, joined: !c.joined, participants: c.joined ? c.participants - 1 : c.participants + 1 } : c));

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
        {[['feed', '📰 Feed'], ['friends', '👟 Amigos'], ['explore', '🔍 Explorar'], ['challenges', '⚔️ Retos'], ['leaderboard', '🏆 Rankings']].map(([s, l]) => (
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
                onFollow={() => toggleFollow(post.user)} onOpenComments={() => setCommentsFor(post.id)}
                onOpenUser={() => post.user !== user.name && setProfileUser(post.user)} />
            ))}
            {visible < feed.length && <p className="feed-loading">Cargando más… ⏳</p>}
          </div>
        </>
      )}

      {section === 'friends' && (
        <Friends activity={friendActivity} discover={discoverUsers} following={following} onFollow={toggleFollow} onOpenUser={setProfileUser} />
      )}

      {section === 'explore' && <Explore feed={feed} onOpen={(id) => { setSection('feed'); setCommentsFor(id); }} />}

      {section === 'challenges' && (
        <div className="challenges">
          <p className="section-desc">Compite con la comunidad en retos semanales</p>
          {challenges.map(c => <ChallengeCard key={c.id} challenge={c} onToggle={() => toggleJoin(c.id)} />)}
        </div>
      )}

      {section === 'leaderboard' && <Rankings user={user} />}

      <div style={{ height: 100 }} />

      {storyIdx != null && <StoryViewer stories={stories} startIdx={storyIdx} onClose={() => setStoryIdx(null)} markSeen={markStorySeen} />}
      {commentPost && <CommentsSheet post={commentPost} me={user.name} onClose={() => setCommentsFor(null)} onAdd={addComment} onReply={addReply} />}
      {profileUser && <UserProfileSheet name={profileUser} discover={discoverUsers} feed={feed} activity={friendActivity}
        following={following.includes(profileUser)} onFollow={() => toggleFollow(profileUser)} onClose={() => setProfileUser(null)} />}
    </div>
  );
}

/* ---------------- Post ---------------- */
function PostCard({ post, me, following, onLike, onSave, onFollow, onOpenComments, onOpenUser }) {
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
        <div className="avatar" style={{ width: 36, height: 36, fontSize: 16, cursor: 'pointer' }} onClick={onOpenUser}>{post.avatar}</div>
        <div className="ig-post-user" style={{ cursor: 'pointer' }} onClick={onOpenUser}>
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

      {post.workout && <WorkoutLogBody w={post.workout} petLevel={post.petLevel} onDouble={dblLike} burst={burst} />}

      {post.image && !post.workout && (
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

/* ---------------- Hevy-style workout log card ---------------- */
function WorkoutLogBody({ w, petLevel, onDouble, burst }) {
  return (
    <div className="wl-card" onDoubleClick={onDouble}>
      <div className="wl-head">
        <div className="wl-metric"><span className="wl-v">{w.durationMin}m</span><span className="wl-l">Duración</span></div>
        <div className="wl-metric"><span className="wl-v">{(w.volume / 1000).toFixed(1)}t</span><span className="wl-l">Volumen</span></div>
        <div className="wl-metric"><span className="wl-v">{w.sets}</span><span className="wl-l">Series</span></div>
        {petLevel && <div className="wl-metric"><span className="wl-v">🐸{petLevel}</span><span className="wl-l">Rana</span></div>}
      </div>
      {w.prs?.length > 0 && (
        <div className="wl-prs">
          {w.prs.map((p, i) => <span key={i} className="wl-pr">🏆 {p.name} {p.weight}kg×{p.reps}</span>)}
        </div>
      )}
      <div className="wl-ex-list">
        <div className="wl-ex-head"><span>Ejercicio</span><span>Mejor serie</span></div>
        {w.exercises.map((e, i) => {
          const best = e.sets.reduce((b, s) => (s.weight * s.reps > (b.weight * b.reps) ? s : b), e.sets[0] || { weight: 0, reps: 0 });
          return (
            <div className="wl-ex" key={i}>
              <span className="wl-ex-name">{e.icon} {e.sets.length}× {e.name}</span>
              <span className="wl-ex-best">{best.weight}kg × {best.reps}</span>
            </div>
          );
        })}
      </div>
      {burst && <span className="ig-heart-burst" style={{ position: 'absolute', inset: 0 }}>❤️</span>}
    </div>
  );
}

/* ---------------- Friends: activity + discover ---------------- */
function Friends({ activity, discover, following, onFollow, onOpenUser }) {
  const [q, setQ] = useState('');
  const KIND = {
    workout: { icon: '💪', color: 'var(--lavender)' },
    pr: { icon: '🏆', color: '#FFD54F' },
    streak: { icon: '🔥', color: 'var(--orange)' },
    pet: { icon: '🐸', color: 'var(--lime)' },
    achievement: { icon: '🎖️', color: 'var(--lavender)' },
    challenge: { icon: '⚔️', color: 'var(--orange)' },
  };
  const results = discover.filter(u => !q.trim() || u.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="friends">
      <div className="fs-searchbar" style={{ marginBottom: 14 }}>
        <span className="material-symbols-outlined">person_search</span>
        <input className="fs-input" placeholder="Buscar amigos por nombre…" value={q} onChange={e => setQ(e.target.value)} />
      </div>

      {q.trim() ? (
        <div className="fr-discover">
          {results.map(u => (
            <div className="fr-user" key={u.name}>
              <div className="avatar" style={{ width: 44, height: 44, fontSize: 20, cursor: 'pointer' }} onClick={() => onOpenUser(u.name)}>{u.avatar}</div>
              <div className="fr-user-info" style={{ cursor: 'pointer' }} onClick={() => onOpenUser(u.name)}>
                <p className="fr-user-name">{u.name}</p>
                <p className="fr-user-bio">{u.bio} · {u.followers}</p>
              </div>
              <button className={`ig-follow ${following.includes(u.name) ? 'on' : ''}`} onClick={() => onFollow(u.name)}>
                {following.includes(u.name) ? 'Siguiendo' : 'Seguir'}
              </button>
            </div>
          ))}
          {results.length === 0 && <p className="no-comments">Sin resultados</p>}
        </div>
      ) : (
        <>
          <div className="fr-suggest">
            <p className="fr-suggest-title">Sugerencias para ti</p>
            <div className="fr-suggest-row">
              {discover.slice(0, 5).map(u => (
                <div className="fr-sg" key={u.name}>
                  <div className="avatar" style={{ width: 48, height: 48, fontSize: 22 }}>{u.avatar}</div>
                  <p className="fr-sg-name">{u.name.split(' ')[0]}</p>
                  <button className={`ex-follow`} onClick={() => onFollow(u.name)}>{following.includes(u.name) ? '✓' : 'Seguir'}</button>
                </div>
              ))}
            </div>
          </div>

          <div className="section-header" style={{ marginTop: 6 }}><span className="section-title">Actividad reciente</span></div>
          <div className="fr-activity">
            {activity.map(a => {
              const k = KIND[a.kind] || KIND.workout;
              return (
                <div className="fr-act" key={a.id}>
                  <div className="fr-act-icon" style={{ background: k.color + '22', color: k.color }}>{k.icon}</div>
                  <div className="fr-act-body" style={{ cursor: 'pointer' }} onClick={() => onOpenUser(a.user)}>
                    <p className="fr-act-text"><strong>{a.user}</strong> {a.text}</p>
                    <p className="fr-act-detail">{a.detail} · {a.time}</p>
                  </div>
                  <button className="fr-act-like">🤍</button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- Public user profile ---------------- */
function UserProfileSheet({ name, discover, feed, activity, following, onFollow, onClose }) {
  const u = discover.find(d => d.name === name) || { name, avatar: '🐸', bio: 'Atleta FitPet', followers: '—' };
  // deterministic pseudo-stats from the name
  const h = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const workouts = 40 + (h % 160);
  const volume = (20 + (h % 60)).toFixed(1);
  const streak = 3 + (h % 25);
  const petLvl = 5 + (h % 22);
  const posts = feed.filter(p => p.user === name);
  const acts = activity.filter(a => a.user === name);
  const goals = ['Ganar músculo 💪', 'Perder grasa 🔥', 'Correr un 10K 🏃', 'Más fuerza 🏋️', 'Mantener el hábito 🌱'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal animate-slideUp up-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="up-head">
          <div className="avatar" style={{ width: 64, height: 64, fontSize: 30 }}>{u.avatar}</div>
          <div className="up-id">
            <p className="up-name">{u.name}</p>
            <p className="up-bio">{u.bio}</p>
            <p className="up-goal">🎯 {goals[h % goals.length]}</p>
          </div>
        </div>

        <div className="up-followrow">
          <button className={`btn ${following ? 'btn-outline' : 'btn-primary'}`} style={{ flex: 1, justifyContent: 'center' }} onClick={onFollow}>
            {following ? 'Siguiendo ✓' : 'Seguir'}
          </button>
          <div className="up-fc"><b>{u.followers}</b><span>seguidores</span></div>
        </div>

        <div className="up-stats">
          <div className="up-stat"><b>{workouts}</b><span>Entrenos</span></div>
          <div className="up-stat"><b>{volume}t</b><span>Volumen</span></div>
          <div className="up-stat"><b>🔥{streak}</b><span>Racha</span></div>
          <div className="up-stat"><b>🐸{petLvl}</b><span>Rana</span></div>
        </div>

        {acts.length > 0 && (
          <>
            <p className="up-section">Actividad reciente</p>
            {acts.map(a => <p key={a.id} className="up-act">• {a.text} <span>· {a.time}</span></p>)}
          </>
        )}

        {posts.length > 0 && (
          <>
            <p className="up-section">Publicaciones</p>
            <div className="up-grid">
              {posts.filter(p => p.image).map(p => <img key={p.id} src={p.image} alt="" className="up-cell" />)}
              {posts.filter(p => p.workout).map(p => <div key={p.id} className="up-cell up-wl">🏋️<span>{(p.workout.volume/1000).toFixed(1)}t</span></div>)}
            </div>
          </>
        )}
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

/* ---------------- Rankings (multiple types) ---------------- */
function Rankings({ user }) {
  const [type, setType] = useState('points');
  const DATA = {
    points: { label: '⭐ Puntos', unit: 'pts', rows: [
      ['Maria G.', '🏃‍♀️', 2840], ['Carlos M.', '💪', 2650], [user.name, '😄', 2410, true], ['Ana P.', '🧘‍♀️', 2200], ['Luis R.', '🏋️', 1980],
    ]},
    volume: { label: '🏋️ Volumen', unit: 't', rows: [
      ['Luis R.', '🏋️', 48.2], ['Carlos M.', '💪', 41.7], [user.name, '😄', 33.5, true], ['Maria G.', '🏃‍♀️', 22.1], ['Ana P.', '🧘‍♀️', 12.4],
    ]},
    workouts: { label: '💪 Entrenos', unit: '', rows: [
      ['Carlos M.', '💪', 21], ['Maria G.', '🏃‍♀️', 19], ['Luis R.', '🏋️', 18], [user.name, '😄', 14, true], ['Ana P.', '🧘‍♀️', 11],
    ]},
    streak: { label: '🔥 Racha', unit: 'd', rows: [
      ['Ana P.', '🧘‍♀️', 14], [user.name, '😄', 12, true], ['Maria G.', '🏃‍♀️', 9], ['Carlos M.', '💪', 7], ['Luis R.', '🏋️', 4],
    ]},
  };
  const cfg = DATA[type];
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="leaderboard-section">
      <div className="rk-tabs">
        {Object.entries(DATA).map(([k, v]) => (
          <button key={k} className={`rk-tab ${type === k ? 'active' : ''}`} onClick={() => setType(k)}>{v.label}</button>
        ))}
      </div>
      <p className="section-desc">Ranking semanal · {cfg.label}</p>
      {cfg.rows.map((r, i) => (
        <LeaderCard key={i} user={{ rank: i + 1, name: r[0], avatar: r[1], points: r[2], unit: cfg.unit, badge: medals[i] || null, isMe: r[3] }} />
      ))}
    </div>
  );
}

function LeaderCard({ user }) {
  return (
    <div className={`card leader-card ${user.isMe ? 'is-me' : ''}`}>
      <div className="rank-num" style={{ color: user.rank <= 3 ? 'var(--orange)' : 'var(--text-secondary)' }}>{user.badge || `#${user.rank}`}</div>
      <div className="avatar">{user.avatar}</div>
      <div className="leader-info"><p className="leader-name">{user.name} {user.isMe && <span className="you-tag">Tú</span>}</p></div>
      <div className="leader-points"><p className="points-num">{user.points.toLocaleString()}{user.unit && user.unit !== 'pts' ? user.unit : ''}</p><p className="points-label">{user.unit || 'pts'}</p></div>
    </div>
  );
}

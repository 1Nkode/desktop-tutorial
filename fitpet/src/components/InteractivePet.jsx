import { useEffect, useRef, useState } from 'react';
import './InteractivePet.css';

/*
  InteractivePet — a fully interactive, physics-driven avatar.

  Sprites (drop your 3 PNGs in fitpet/public/pet/):
    - /pet/stand.png  → de pie con gafas  (idle / walk / run)
    - /pet/flex.png   → flexionando        (jump / celebrate / react / drag)
    - /pet/sit.png    → sentado            (sleep / rest)
  If a PNG is missing it falls back to an emoji so it still works.

  Behaviours: idle, walk, run, jump, celebrate, react, sleep, drag + throw.
  Physics: gravity, ground bounce, wall collisions, friction, throw velocity.
*/

const SIZE = 88;
const GRAVITY = 0.9;
const FRICTION = 0.86;
const NAV_H = 96;          // keep above the bottom nav
const TOP_H = 70;          // keep below the top bar

const POSE_EMOJI = { stand: '🐸', flex: '🐸', sit: '🐸' };

const REACTIONS = ['¡Hola! 👋', '¡Vamos! 💪', '¡Yeah! 🎉', '😎', '¡Juega conmigo!', '¡Más reps! 🏋️', '¡Woho! ⚡'];

export default function InteractivePet() {
  const elRef = useRef(null);
  const rootRectRef = useRef({ left: 0, width: 430, height: window.innerHeight });
  const [pose, setPose] = useState('stand');
  const [bubble, setBubble] = useState(null);
  const [particles, setParticles] = useState([]);
  const [hidden, setHidden] = useState(false);
  const [imgOk, setImgOk] = useState({ stand: true, flex: true, sit: true });

  // Mutable physics/AI state (kept out of React state for 60fps)
  const p = useRef({
    x: 60, y: 200, vx: 0, vy: 0,
    onGround: false,
    facing: 1,
    behavior: 'idle',
    timer: 60,
    dragging: false,
    dragDX: 0, dragDY: 0,
    lastPx: 0, lastPy: 0,
    poseName: 'stand',
    moved: false,
  }).current;

  const bubbleTimer = useRef(null);

  function say(text, ms = 1600) {
    setBubble(text);
    clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => setBubble(null), ms);
  }

  function spawnParticles(kind = '✨', n = 8) {
    const created = Array.from({ length: n }).map((_, i) => ({
      id: Date.now() + i,
      emoji: kind,
      dx: (Math.random() - 0.5) * 80,
      dy: -40 - Math.random() * 60,
      rot: (Math.random() - 0.5) * 120,
    }));
    setParticles(cur => [...cur, ...created]);
    setTimeout(() => {
      setParticles(cur => cur.filter(c => !created.find(x => x.id === c.id)));
    }, 900);
  }

  function setPoseIfChanged(name) {
    if (p.poseName !== name) {
      p.poseName = name;
      setPose(name);
    }
  }

  function pickBehavior() {
    const roll = Math.random();
    if (roll < 0.30) { p.behavior = 'idle'; p.timer = 80 + Math.random() * 120; p.vx = 0; }
    else if (roll < 0.45) { p.behavior = 'sleep'; p.timer = 120 + Math.random() * 120; p.vx = 0; }
    else if (roll < 0.72) { p.behavior = 'walk'; p.timer = 90 + Math.random() * 120; p.facing = Math.random() < 0.5 ? -1 : 1; p.vx = 0.7 * p.facing; }
    else if (roll < 0.9) { p.behavior = 'run'; p.timer = 70 + Math.random() * 90; p.facing = Math.random() < 0.5 ? -1 : 1; p.vx = 2.1 * p.facing; }
    else { p.behavior = 'jump'; p.timer = 40; if (p.onGround) p.vy = -15; }
  }

  // --- Interaction handlers ---
  function onPointerDown(e) {
    e.preventDefault();
    e.stopPropagation();
    const point = 'touches' in e ? e.touches[0] : e;
    p.dragging = true;
    p.moved = false;
    p.behavior = 'drag';
    p.dragDX = point.clientX - p.x;
    p.dragDY = point.clientY - p.y;
    p.lastPx = point.clientX;
    p.lastPy = point.clientY;
    setPoseIfChanged('flex');
  }

  useEffect(() => {
    function onMove(e) {
      if (!p.dragging) return;
      const point = 'touches' in e ? e.touches[0] : e;
      const r = rootRectRef.current;
      let nx = point.clientX - p.dragDX;
      let ny = point.clientY - p.dragDY;
      nx = Math.max(r.left, Math.min(nx, r.left + r.width - SIZE));
      ny = Math.max(TOP_H, Math.min(ny, r.height - SIZE - NAV_H));
      p.vx = point.clientX - p.lastPx;
      p.vy = point.clientY - p.lastPy;
      p.lastPx = point.clientX;
      p.lastPy = point.clientY;
      if (Math.abs(p.vx) + Math.abs(p.vy) > 2) p.moved = true;
      p.x = nx;
      p.y = ny;
    }
    function onUp() {
      if (!p.dragging) return;
      p.dragging = false;
      if (!p.moved) {
        // It was a tap, not a drag → react
        react();
      } else {
        // Thrown → clamp throw velocity and let physics take over
        p.vx = Math.max(-22, Math.min(22, p.vx));
        p.vy = Math.max(-22, Math.min(22, p.vy));
        p.behavior = 'idle';
        p.timer = 30;
        say('¡Wee! 🌀', 1000);
      }
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  function react() {
    p.behavior = 'celebrate';
    p.timer = 60;
    if (p.onGround) p.vy = -12;
    setPoseIfChanged('flex');
    say(REACTIONS[Math.floor(Math.random() * REACTIONS.length)]);
    spawnParticles(Math.random() < 0.5 ? '✨' : '❤️', 10);
  }

  // --- Game loop ---
  useEffect(() => {
    function refreshBounds() {
      const root = document.getElementById('root');
      if (root) {
        const r = root.getBoundingClientRect();
        rootRectRef.current = { left: r.left, width: r.width, height: window.innerHeight };
      }
    }
    refreshBounds();
    window.addEventListener('resize', refreshBounds);

    let raf;
    let tick = 0;
    function loop() {
      tick++;
      const r = rootRectRef.current;
      const floor = r.height - SIZE - NAV_H;

      if (!p.dragging) {
        // Behaviour timer / AI
        if (p.behavior !== 'celebrate' && p.behavior !== 'react') {
          p.timer--;
          if (p.timer <= 0 && p.onGround) pickBehavior();
        } else {
          p.timer--;
          if (p.timer <= 0) { p.behavior = 'idle'; p.timer = 60; }
        }

        // Horizontal motion
        if (p.behavior === 'walk') p.vx = 0.7 * p.facing;
        else if (p.behavior === 'run') p.vx = 2.1 * p.facing;
        else if (p.onGround && p.behavior !== 'jump') p.vx *= FRICTION;

        // Gravity
        p.vy += GRAVITY;
        p.x += p.vx;
        p.y += p.vy;

        // Floor collision + bounce
        if (p.y >= floor) {
          p.y = floor;
          if (p.vy > 6) { p.vy = -p.vy * 0.35; }   // bounce
          else { p.vy = 0; p.onGround = true; }
        } else {
          p.onGround = false;
        }

        // Wall collisions
        const minX = r.left + 2;
        const maxX = r.left + r.width - SIZE - 2;
        if (p.x <= minX) { p.x = minX; p.facing = 1; p.vx = Math.abs(p.vx); }
        if (p.x >= maxX) { p.x = maxX; p.facing = -1; p.vx = -Math.abs(p.vx); }
      }

      // Decide pose from state
      let poseName;
      if (p.dragging || p.behavior === 'celebrate') poseName = 'flex';
      else if (!p.onGround) poseName = 'flex';            // airborne = flex
      else if (p.behavior === 'sleep') poseName = 'sit';
      else poseName = 'stand';
      setPoseIfChanged(poseName);

      // Visual transform (squash & stretch + waddle)
      const el = elRef.current;
      if (el) {
        let sx = 1, sy = 1, rot = 0;
        if (!p.onGround) { sy = 1.12; sx = 0.9; }                         // stretch in air
        else if (p.behavior === 'walk' || p.behavior === 'run') {
          const wobble = Math.sin(tick * (p.behavior === 'run' ? 0.5 : 0.3));
          rot = wobble * (p.behavior === 'run' ? 8 : 4);
          sy = 1 + Math.abs(wobble) * 0.04;
        } else if (p.behavior === 'celebrate') {
          sy = 1 + Math.sin(tick * 0.6) * 0.08;
          rot = Math.sin(tick * 0.6) * 10;
        } else if (p.behavior === 'idle') {
          sy = 1 + Math.sin(tick * 0.06) * 0.03;                          // breathing
        } else if (p.behavior === 'sleep') {
          sy = 1 + Math.sin(tick * 0.04) * 0.05;
        }
        el.style.transform =
          `translate(${p.x}px, ${p.y}px) scaleX(${p.facing * sx}) scaleY(${sy}) rotate(${rot}deg)`;
      }

      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', refreshBounds); };
  }, []);

  if (hidden) {
    return (
      <button className="pet-summon" onClick={() => setHidden(false)} title="Llamar a tu mascota">
        <span className="material-symbols-outlined">pets</span>
      </button>
    );
  }

  return (
    <div
      ref={elRef}
      className={`ipet ipet-${pose} ipet-${p.behavior}`}
      onPointerDown={onPointerDown}
      onTouchStart={onPointerDown}
      onDoubleClick={react}
      role="button"
      aria-label="Mascota interactiva"
    >
      {bubble && <div className="ipet-bubble">{bubble}</div>}
      <button className="ipet-close" onPointerDown={(e) => { e.stopPropagation(); setHidden(true); }}>×</button>

      <div className="ipet-body">
        {imgOk[pose] ? (
          <img
            className="ipet-img"
            src={`${import.meta.env.BASE_URL}pet/${pose}.png`}
            alt="pet"
            draggable={false}
            onError={() => setImgOk(s => ({ ...s, [pose]: false }))}
          />
        ) : (
          <span className="ipet-emoji">{POSE_EMOJI[pose]}</span>
        )}
        <div className="ipet-shadow" />
      </div>

      {particles.map(pt => (
        <span
          key={pt.id}
          className="ipet-particle"
          style={{ '--dx': `${pt.dx}px`, '--dy': `${pt.dy}px`, '--rot': `${pt.rot}deg` }}
        >{pt.emoji}</span>
      ))}
    </div>
  );
}

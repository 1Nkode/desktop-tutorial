import { useEffect, useRef, useState } from 'react';
import { useStore, petState } from '../store/useStore';
import PetSprite from './PetSprite';
import { playSound } from '../sound';
import './InteractivePet.css';

/*
  InteractivePet — animated, interactive virtual companion (Pet tab).
  Lives inside its parent ".pet-playground": walks, runs, jumps, dances,
  sleeps, celebrates and reacts — roaming only within that stage.

  EVOLUTION STATES (driven by the user's real activity via petState()):
    base       · energía media, movimientos suaves
    strong     · musculoso y confiado, celebra y hace poses (consistencia)
    neglected  · más lento y sedentario, bosteza (dejó de entrenar)
    tired      · agotado, avisa que la racha está en riesgo
    champion   · épico, con aura, corona y trofeos (grandes logros)

  Sprites (optional): fitpet/public/pet/{stand,flex,sit}.png
  Fallback: emoji that adapts to the state, so it always works.
*/

const SIZE = 96;
const GRAVITY = 0.8;
const FRICTION = 0.86;

export const STATE_INFO = {
  base:      { label: 'Base',       emoji: '🐸', badge: '',   color: '#c2c1ff', desc: 'Energía media' },
  strong:    { label: 'Fuerte',     emoji: '💪', badge: '💪', color: '#CCFF00', desc: '¡Consistencia!' },
  neglected: { label: 'Descuidado', emoji: '🐽', badge: '🍔', color: '#9aa0aa', desc: 'Hora de moverse' },
  tired:     { label: 'Cansado',    emoji: '😮‍💨', badge: '💤', color: '#FFB951', desc: 'Racha en riesgo' },
  champion:  { label: 'Campeón',    emoji: '🏆', badge: '👑', color: '#FFD54F', desc: '¡Leyenda!' },
};

const STATE_RANK = { neglected: 0, tired: 1, base: 2, strong: 3, champion: 4 };
const SPEED = { neglected: 0.5, tired: 0.6, base: 1, strong: 1.15, champion: 1.3 };
const REACTIONS = {
  base: ['¡Hola! 👋', '😊', '¡Vamos!'],
  strong: ['¡Más reps! 🏋️', '¡Yeah! 💪', '😎', '¡Fuerza!'],
  neglected: ['¿Salimos a caminar?', '🥱', 'Extraño entrenar...'],
  tired: ['¡No pierdas la racha! 🔥', '😮‍💨', 'Un poco más...'],
  champion: ['¡CAMPEÓN! 🏆', '👑 ¡Leyenda!', '¡Imparable! ⚡'],
};

export default function InteractivePet() {
  const { pet, stats, user, addPetXp, pokePet } = useStore();
  const state = petState(pet, stats, user);

  const elRef = useRef(null);
  const boundsRef = useRef({ w: 320, h: 220 });
  const stateRef = useRef(state);
  const [pose, setPose] = useState('stand');
  const [bubble, setBubble] = useState(null);
  const [particles, setParticles] = useState([]);
  const [imgOk, setImgOk] = useState({ stand: true, flex: true, sit: true });

  // "Alive" rig: eye tracking, blinking, emotions
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const [emotion, setEmotion] = useState('happy');
  const emotionTimer = useRef(null);
  const lastEyeUpdate = useRef(0);
  const levelRef = useRef(pet.level);

  function baseEmotion() {
    const s = stateRef.current;
    if (pet.energy <= 25) return 'tired';
    if (pet.motivation <= 25) return 'sad';
    if (s === 'champion' || s === 'strong') return 'happy';
    if (s === 'neglected') return 'sad';
    if (s === 'tired') return 'tired';
    return 'happy';
  }
  function flashEmotion(e, ms = 1500) {
    setEmotion(e);
    clearTimeout(emotionTimer.current);
    emotionTimer.current = setTimeout(() => setEmotion(baseEmotion()), ms);
  }

  const p = useRef({
    x: 40, y: 60, vx: 0, vy: 0,
    onGround: false, facing: 1,
    behavior: 'idle', timer: 60,
    dragging: false, dragDX: 0, dragDY: 0, lastPx: 0, lastPy: 0, moved: false,
    poseName: 'stand',
  }).current;

  const bubbleTimer = useRef(null);
  function say(text, ms = 1600) {
    setBubble(text);
    clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => setBubble(null), ms);
  }

  function spawnParticles(kind = '✨', n = 9) {
    const created = Array.from({ length: n }).map((_, i) => ({
      id: Date.now() + i + Math.random(), emoji: kind,
      dx: (Math.random() - 0.5) * 100, dy: -40 - Math.random() * 70,
      rot: (Math.random() - 0.5) * 140,
    }));
    setParticles(cur => [...cur, ...created]);
    setTimeout(() => setParticles(cur => cur.filter(c => !created.find(x => x.id === c.id))), 950);
  }

  function setPoseIfChanged(name) {
    if (p.poseName !== name) { p.poseName = name; setPose(name); }
  }

  // Behaviour selection weighted by the current evolution state
  function pickBehavior() {
    const s = stateRef.current;
    const r = Math.random();
    if (s === 'neglected') {
      if (r < 0.5) return set('sleep', 140 + Math.random() * 120, 0);
      if (r < 0.85) return set('idle', 90 + Math.random() * 100, 0);
      return walk();
    }
    if (s === 'tired') {
      if (r < 0.45) return set('idle', 90, 0);
      if (r < 0.7) return set('sleep', 120, 0);
      return walk();
    }
    if (s === 'strong') {
      if (r < 0.2) return set('idle', 60, 0);
      if (r < 0.45) return walk();
      if (r < 0.65) return run();
      if (r < 0.82) return jump();
      if (r < 0.92) return set('celebrate', 70, 0);
      return set('dance', 110, 0);
    }
    if (s === 'champion') {
      if (r < 0.15) return set('idle', 50, 0);
      if (r < 0.35) return run();
      if (r < 0.55) return jump();
      if (r < 0.75) return set('dance', 130, 0);
      return set('celebrate', 80, 0);
    }
    // base
    if (r < 0.35) return set('idle', 80 + Math.random() * 100, 0);
    if (r < 0.45) return set('sleep', 110, 0);
    if (r < 0.75) return walk();
    if (r < 0.9) return run();
    return jump();

    function set(b, t, vx) { p.behavior = b; p.timer = t; if (vx !== undefined) p.vx = vx; }
    function walk() { p.behavior = 'walk'; p.timer = 80 + Math.random() * 100; p.facing = Math.random() < 0.5 ? -1 : 1; }
    function run() { p.behavior = 'run'; p.timer = 60 + Math.random() * 80; p.facing = Math.random() < 0.5 ? -1 : 1; }
    function jump() { p.behavior = 'jump'; p.timer = 40; if (p.onGround) p.vy = -13; }
  }

  function react() {
    const s = stateRef.current;
    p.behavior = (s === 'champion' || s === 'strong') ? 'dance' : 'celebrate';
    p.timer = 70;
    if (p.onGround) p.vy = -11;
    setPoseIfChanged('flex');
    const list = REACTIONS[s] || REACTIONS.base;
    say(list[Math.floor(Math.random() * list.length)]);
    spawnParticles(s === 'champion' ? '⭐' : s === 'neglected' || s === 'tired' ? '💧' : '❤️', 10);
    flashEmotion('excited', 1400);
    playSound(s === 'champion' || s === 'strong' ? 'celebrate' : 'tap');
    addPetXp?.(2);
    pokePet?.();
  }

  function onPointerDown(e) {
    e.preventDefault(); e.stopPropagation();
    const point = 'touches' in e ? e.touches[0] : e;
    p.dragging = true; p.moved = false; p.behavior = 'drag';
    p.lastPx = point.clientX; p.lastPy = point.clientY;
    setPoseIfChanged('flex');
  }

  // pointer move / up (drag + throw + eye tracking)
  useEffect(() => {
    function trackEyes(point) {
      const now = performance.now();
      if (now - lastEyeUpdate.current < 40) return;   // throttle ~25fps
      lastEyeUpdate.current = now;
      const el = elRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const nx = Math.max(-1, Math.min(1, (point.clientX - cx) / 120));
      const ny = Math.max(-1, Math.min(1, (point.clientY - cy) / 120));
      setPupil({ x: nx, y: ny });
    }
    function onMove(e) {
      const point = 'touches' in e ? e.touches[0] : e;
      if (!p.dragging) { trackEyes(point); return; }
      const r = elRef.current.parentElement.getBoundingClientRect();
      const b = boundsRef.current;
      let nx = point.clientX - r.left - SIZE / 2;
      let ny = point.clientY - r.top - SIZE / 2;
      nx = Math.max(0, Math.min(nx, b.w - SIZE));
      ny = Math.max(0, Math.min(ny, b.h - SIZE));
      p.vx = point.clientX - p.lastPx;
      p.vy = point.clientY - p.lastPy;
      p.lastPx = point.clientX; p.lastPy = point.clientY;
      if (Math.abs(p.vx) + Math.abs(p.vy) > 2) p.moved = true;
      p.x = nx; p.y = ny;
    }
    function onUp() {
      if (!p.dragging) return;
      p.dragging = false;
      if (!p.moved) react();
      else {
        p.vx = Math.max(-20, Math.min(20, p.vx));
        p.vy = Math.max(-20, Math.min(20, p.vy));
        p.behavior = 'idle'; p.timer = 30;
        say('¡Wee! 🌀', 900);
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

  // React to evolution-state changes (smooth feedback)
  useEffect(() => {
    const prev = stateRef.current;
    stateRef.current = state;
    if (prev === state) return;
    if (STATE_RANK[state] > STATE_RANK[prev]) {
      p.behavior = 'celebrate'; p.timer = 80; if (p.onGround) p.vy = -12;
      say(state === 'champion' ? '¡CAMPEÓN! 🏆' : '¡Subiste de forma! 💪');
      spawnParticles(state === 'champion' ? '⭐' : '✨', 14);
    } else {
      p.behavior = 'idle'; p.timer = 90;
      say(state === 'neglected' ? 'Me siento flojo... 🥱' : 'La racha está en riesgo 😮‍💨');
      spawnParticles('💧', 6);
      flashEmotion('sad', 2000);
      playSound('sad');
    }
  }, [state]);

  // Natural blinking
  useEffect(() => {
    let t;
    function scheduleBlink() {
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 140);
        scheduleBlink();
      }, 2200 + Math.random() * 2800);
    }
    scheduleBlink();
    return () => clearTimeout(t);
  }, []);

  // Base emotion follows the pet's stats/state
  useEffect(() => { setEmotion(baseEmotion()); }, [state, pet.energy, pet.motivation]);

  // Level-up celebration
  useEffect(() => {
    if (pet.level > levelRef.current) {
      levelRef.current = pet.level;
      p.behavior = 'celebrate'; p.timer = 90; if (p.onGround) p.vy = -13;
      say(`¡Nivel ${pet.level}! 🎉`);
      spawnParticles('⭐', 16);
      flashEmotion('excited', 1800);
      playSound('levelup');
    } else {
      levelRef.current = pet.level;
    }
  }, [pet.level]);

  // Idle eyes drift back to center + occasional motivational message
  useEffect(() => {
    const drift = setInterval(() => {
      if (!p.dragging) setPupil(pu => ({ x: pu.x * 0.4, y: pu.y * 0.4 }));
    }, 1400);
    const PHRASES = ['¡Tú puedes! 💪', '¿Listo para entrenar?', '¡Vamos por esa racha! 🔥', '¡Hidrátate! 💧', '¡Un día más!'];
    const motivate = setInterval(() => {
      if (!bubble && Math.random() < 0.4) say(PHRASES[Math.floor(Math.random() * PHRASES.length)]);
    }, 9000);
    return () => { clearInterval(drift); clearInterval(motivate); };
  }, []);

  // game loop
  useEffect(() => {
    function refreshBounds() {
      const parent = elRef.current?.parentElement;
      if (parent) boundsRef.current = { w: parent.clientWidth, h: parent.clientHeight };
    }
    refreshBounds();
    window.addEventListener('resize', refreshBounds);

    let raf, tick = 0;
    function loop() {
      tick++;
      refreshBounds();
      const b = boundsRef.current;
      const floor = b.h - SIZE;
      const spd = SPEED[stateRef.current] || 1;

      if (!p.dragging) {
        if (p.behavior !== 'celebrate' && p.behavior !== 'dance') {
          p.timer--;
          if (p.timer <= 0 && p.onGround) pickBehavior();
        } else {
          p.timer--;
          if (p.timer <= 0) { p.behavior = 'idle'; p.timer = 60; }
          if (p.behavior === 'dance' && tick % 22 === 0) spawnParticles('🎵', 2);
        }

        if (p.behavior === 'walk') p.vx = 0.7 * spd * p.facing;
        else if (p.behavior === 'run') p.vx = 2.0 * spd * p.facing;
        else if (p.onGround && p.behavior !== 'jump') p.vx *= FRICTION;

        p.vy += GRAVITY;
        p.x += p.vx;
        p.y += p.vy;

        if (p.y >= floor) {
          p.y = floor;
          if (p.vy > 5) p.vy = -p.vy * 0.35; else { p.vy = 0; p.onGround = true; }
        } else p.onGround = false;

        const maxX = b.w - SIZE;
        if (p.x <= 0) { p.x = 0; p.facing = 1; p.vx = Math.abs(p.vx); }
        if (p.x >= maxX) { p.x = maxX; p.facing = -1; p.vx = -Math.abs(p.vx); }
      }

      let poseName;
      if (p.dragging || p.behavior === 'celebrate' || p.behavior === 'dance' || !p.onGround) poseName = 'flex';
      else if (p.behavior === 'sleep') poseName = 'sit';
      else poseName = 'stand';
      setPoseIfChanged(poseName);

      const el = elRef.current;
      if (el) {
        let sx = 1, sy = 1, rot = 0;
        if (!p.onGround) { sy = 1.12; sx = 0.9; }
        else if (p.behavior === 'walk' || p.behavior === 'run') {
          const wob = Math.sin(tick * (p.behavior === 'run' ? 0.5 : 0.3));
          rot = wob * (p.behavior === 'run' ? 8 : 4);
          sy = 1 + Math.abs(wob) * 0.04;
        } else if (p.behavior === 'celebrate') {
          sy = 1 + Math.sin(tick * 0.6) * 0.08; rot = Math.sin(tick * 0.6) * 10;
        } else if (p.behavior === 'dance') {
          rot = Math.sin(tick * 0.4) * 16; sy = 1 + Math.abs(Math.sin(tick * 0.4)) * 0.1;
        } else if (p.behavior === 'idle') {
          sy = 1 + Math.sin(tick * 0.06) * 0.03;
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

  const info = STATE_INFO[state];
  const showZzz = state === 'tired' || state === 'neglected';

  return (
    <div
      ref={elRef}
      className={`ipet ipet-${pose} ipet-${p.behavior} ipet-state-${state}`}
      onPointerDown={onPointerDown}
      onTouchStart={onPointerDown}
      onDoubleClick={react}
      role="button"
      aria-label="Mascota interactiva"
    >
      {bubble && <div className="ipet-bubble">{bubble}</div>}

      {/* state aura (champion / strong) */}
      <div className="ipet-aura" />

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
          <PetSprite
            pose={pose}
            state={state}
            emotion={(p.behavior === 'celebrate' || p.behavior === 'dance') ? 'excited' : emotion}
            pupil={pupil}
            blink={blink}
          />
        )}
        {/* state badge (crown / muscle / burger / zzz) */}
        {info.badge && <span className="ipet-badge">{info.badge}</span>}
        {showZzz && <span className="ipet-zzz">z</span>}
        <div className="ipet-shadow" />
      </div>

      {particles.map(pt => (
        <span key={pt.id} className="ipet-particle"
          style={{ '--dx': `${pt.dx}px`, '--dy': `${pt.dy}px`, '--rot': `${pt.rot}deg` }}>{pt.emoji}</span>
      ))}
    </div>
  );
}

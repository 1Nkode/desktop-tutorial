/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from 'react';
import { useStore, petState } from '../store/useStore';
import PetSprite from './PetSprite';
import { playSound } from '../sound';
import './InteractivePet.css';

export { STATE_INFO } from './petMeta';

const REACTIONS = {
  base: ['¡Hola!', '¡Vamos!', 'Toca otra vez'],
  strong: ['¡Más reps!', '¡Yeah!', '¡Fuerza!'],
  neglected: ['¿Salimos a caminar?', 'Necesito actividad'],
  tired: ['No pierdas la racha', 'Un poco más...'],
  champion: ['¡Campeón!', '¡Imparable!', 'Nivel leyenda'],
};

export default function InteractivePet() {
  const { pet, stats, user, addPetXp, pokePet, lastPR, clearLastPR, lastInteraction, talkMode, talkText } = useStore();
  const state = petState(pet, stats, user);
  const stateRef = useRef(state);

  const wrapRef = useRef(null);
  const [pose, setPose] = useState('stand');
  const [bubble, setBubble] = useState(null);
  const [particles, setParticles] = useState([]);
  const [emotion, setEmotion] = useState('happy');
  const [reacting, setReacting] = useState(false);
  const emoTimer = useRef(null);
  const bubbleTimer = useRef(null);
  const levelRef = useRef(pet.level);

  function baseEmotion() {
    const s = stateRef.current;
    if (pet.energy <= 25) return 'tired';
    if (pet.motivation <= 25) return 'sad';
    if (s === 'neglected') return 'sad';
    if (s === 'tired') return 'tired';
    return 'happy';
  }
  function flashEmotion(e, ms = 1300) {
    setEmotion(e);
    clearTimeout(emoTimer.current);
    emoTimer.current = setTimeout(() => setEmotion(baseEmotion()), ms);
  }
  function say(text, ms = 1500) {
    setBubble(text);
    clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => setBubble(null), ms);
  }
  function spawn(glyph, n = 10) {
    const created = Array.from({ length: n }).map((_, i) => ({
      id: `${Date.now()}-${i}-${Math.random()}`, glyph,
      dx: (Math.random() - 0.5) * 120, dy: -50 - Math.random() * 70, rot: (Math.random() - 0.5) * 140,
    }));
    setParticles(c => [...c, ...created]);
    setTimeout(() => setParticles(c => c.filter(x => !created.some(k => k.id === x.id))), 950);
  }

  function react() {
    const s = stateRef.current;
    setReacting(true);
    setPose('flex');
    setTimeout(() => { setReacting(false); setPose('stand'); }, 720);
    const opts = REACTIONS[s] || REACTIONS.base;
    say(opts[Math.floor(Math.random() * opts.length)]);
    spawn(s === 'champion' ? '🏆' : s === 'neglected' || s === 'tired' ? '💧' : '❤️', 10);
    flashEmotion('excited', 1200);
    playSound(s === 'champion' || s === 'strong' ? 'celebrate' : 'tap');
    addPetXp?.(2);
    pokePet?.();
  }

  // emotion + resting pose follow state/stats
  useEffect(() => {
    stateRef.current = state;
    setEmotion(baseEmotion());
    setPose(p => (p === 'flex' ? p : (state === 'tired' || state === 'neglected') ? 'sit' : 'stand'));
  }, [state, pet.energy, pet.motivation]);

  // PR + level-up celebrations
  useEffect(() => {
    if (!lastPR) return;
    react(); say(`¡Récord en ${lastPR}! 🏆`, 2200); spawn('🏆', 16); playSound('levelup'); clearLastPR();
  }, [lastPR]);
  useEffect(() => {
    if (pet.level > levelRef.current) { levelRef.current = pet.level; say(`¡Nivel ${pet.level}! 🎉`); spawn('⭐', 16); flashEmotion('excited', 1800); playSound('levelup'); }
    else levelRef.current = pet.level;
  }, [pet.level]);

  // play interactions (cosquillas / hablar) from the buttons
  useEffect(() => {
    if (!lastInteraction) return;
    if (lastInteraction.type === 'tickle') { setReacting(true); setPose('flex'); setTimeout(() => { setReacting(false); setPose('stand'); }, 720); say('¡Jaja! 😆'); spawn('😂', 8); flashEmotion('excited', 1200); playSound('celebrate'); }
    else if (lastInteraction.type === 'pet') { say('😊'); spawn('❤️', 6); flashEmotion('happy', 1200); playSound('tap'); }
  }, [lastInteraction]);

  // Talking-Tom: drive the frog animation precisely from talk mode
  useEffect(() => {
    clearTimeout(emoTimer.current);
    clearTimeout(bubbleTimer.current);
    if (talkMode === 'talking') {
      setEmotion('excited');            // -> talking clip
      setBubble(talkText || '...');
    } else if (talkMode === 'listening') {
      setEmotion('surprised');          // attentive
      setBubble('Te escucho… 👂');
    } else {
      setEmotion(baseEmotion());
      setBubble(null);
    }
  }, [talkMode, talkText]);

  // occasional motivational line
  useEffect(() => {
    const PH = ['¡Tú puedes! 💪', '¿Entrenamos?', '¡Vamos por la racha! 🔥', '¡Hidrátate! 💧'];
    const t = setInterval(() => { if (!bubble && Math.random() < 0.4) say(PH[Math.floor(Math.random() * PH.length)]); }, 9000);
    return () => clearInterval(t);
  }, [bubble]);

  const dirty = (pet.cleanliness ?? 90) < 35;
  const sleepy = state === 'tired' || state === 'neglected';

  return (
    <div
      ref={wrapRef}
      className={`ipet ipet-state-${state} pose-${pose} emotion-${emotion} ${reacting ? 'reacting' : ''} ${sleepy ? 'resting' : 'idle'} talk-${talkMode}`}
      onClick={react}
      role="button"
      aria-label="Tocar la mascota"
    >
      {bubble && <div className="ipet-bubble">{bubble}</div>}
      <div className="ipet-aura" />
      <div className="ipet-body">
        <PetSprite
          pose={pose}
          state={state}
          emotion={reacting || talkMode === 'talking' ? 'excited' : emotion}
          variant={pet.variant || 'natural'}
        />
        {dirty && <span className="ipet-dirty">💨</span>}
      </div>
      <div className="ipet-shadow" />
      {particles.map(pt => (
        <span key={pt.id} className="ipet-particle" style={{ '--dx': `${pt.dx}px`, '--dy': `${pt.dy}px`, '--rot': `${pt.rot}deg` }}>{pt.glyph}</span>
      ))}
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { playSound } from '../sound';
import './Minigame.css';

/*
  FitCatch — a small fitness minigame (Pou-style).
  Tap the healthy items (🥦💧🍎🏋️🥑) as they fall, avoid the junk (🍔🍟🍩🍕).
  Score converts to XP + motivation for the pet.
*/
const GOOD = ['🥦', '💧', '🍎', '🏋️', '🥑', '🏃', '🥕'];
const BAD = ['🍔', '🍟', '🍩', '🍕', '🥤'];
const DURATION = 25;

export default function Minigame({ onClose }) {
  const { rewardMinigame } = useStore();
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(DURATION);
  const [pops, setPops] = useState([]);
  const [over, setOver] = useState(false);
  const areaRef = useRef(null);
  const idRef = useRef(0);

  // spawn loop
  useEffect(() => {
    if (over) return;
    const spawn = setInterval(() => {
      const good = Math.random() < 0.68;
      const emoji = good ? GOOD[Math.floor(Math.random() * GOOD.length)] : BAD[Math.floor(Math.random() * BAD.length)];
      const id = ++idRef.current;
      const x = 6 + Math.random() * 82;
      const dur = 2.2 + Math.random() * 1.6;
      setItems(cur => [...cur, { id, emoji, good, x, dur }]);
      setTimeout(() => setItems(cur => cur.filter(i => i.id !== id)), dur * 1000);
    }, 620);
    return () => clearInterval(spawn);
  }, [over]);

  // countdown
  useEffect(() => {
    if (over) return;
    if (time <= 0) { finish(); return; }
    const t = setTimeout(() => setTime(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [time, over]);

  function finish() {
    setOver(true);
    const reward = Math.max(5, score);
    rewardMinigame(reward);
    playSound('reward');
  }

  function hit(item, e) {
    setItems(cur => cur.filter(i => i.id !== item.id));
    const delta = item.good ? 10 : -5;
    setScore(s => Math.max(0, s + delta));
    playSound(item.good ? 'tap' : 'sad');
    const rect = areaRef.current.getBoundingClientRect();
    const px = ('clientX' in e ? e.clientX : 0) - rect.left;
    const py = ('clientY' in e ? e.clientY : 0) - rect.top;
    const id = ++idRef.current;
    setPops(cur => [...cur, { id, x: px, y: py, good: item.good }]);
    setTimeout(() => setPops(cur => cur.filter(p => p.id !== id)), 600);
  }

  return (
    <div className="mg-overlay">
      <div className="mg-panel">
        <div className="mg-head">
          <button className="mg-x" onClick={onClose}>×</button>
          <div className="mg-title">🐸 FitCatch</div>
          <div className="mg-stats">
            <span className="mg-score">⭐ {score}</span>
            <span className="mg-time">⏱ {time}s</span>
          </div>
        </div>

        <div className="mg-area" ref={areaRef}>
          {!over && items.map(item => (
            <button
              key={item.id}
              className="mg-item"
              style={{ left: `${item.x}%`, animationDuration: `${item.dur}s` }}
              onPointerDown={(e) => hit(item, e)}
            >{item.emoji}</button>
          ))}
          {pops.map(p => (
            <span key={p.id} className={`mg-pop ${p.good ? 'good' : 'bad'}`} style={{ left: p.x, top: p.y }}>
              {p.good ? '+10' : '-5'}
            </span>
          ))}

          {over && (
            <div className="mg-result">
              <div className="mg-result-emoji">🏆</div>
              <h3>¡Bien hecho!</h3>
              <p className="mg-final">Puntuación: <strong>{score}</strong></p>
              <p className="mg-reward">+{Math.max(5, score)} XP · +motivación</p>
              <div className="mg-result-actions">
                <button className="btn btn-outline" onClick={() => { setScore(0); setTime(DURATION); setItems([]); setOver(false); }}>Otra vez</button>
                <button className="btn btn-primary" onClick={onClose}>Listo</button>
              </div>
            </div>
          )}
        </div>

        {!over && <p className="mg-hint">Toca lo saludable 🥦 · evita la comida chatarra 🍔</p>}
      </div>
    </div>
  );
}

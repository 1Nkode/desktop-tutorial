import { useStore } from './store/useStore';

// Tiny synth SFX via the Web Audio API — no asset files needed.
let ctx = null;
function ac() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) ctx = new AC();
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function blip(freq, dur, type = 'sine', gain = 0.06, slideTo = null) {
  const c = ac();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, c.currentTime);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime + dur);
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.connect(g); g.connect(c.destination);
  o.start();
  o.stop(c.currentTime + dur + 0.02);
}

const SOUNDS = {
  tap:       () => blip(520, 0.10, 'triangle', 0.05, 760),
  jump:      () => blip(380, 0.18, 'square', 0.05, 720),
  celebrate: () => { blip(523, 0.12, 'triangle', 0.06); setTimeout(() => blip(659, 0.12, 'triangle', 0.06), 90); setTimeout(() => blip(784, 0.18, 'triangle', 0.06), 180); },
  levelup:   () => { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => blip(f, 0.14, 'triangle', 0.06), i * 90)); },
  sad:       () => blip(440, 0.35, 'sine', 0.05, 180),
  eat:       () => blip(300, 0.10, 'sine', 0.05, 200),
  reward:    () => { [659, 880].forEach((f, i) => setTimeout(() => blip(f, 0.16, 'triangle', 0.06), i * 110)); },
};

export function playSound(name) {
  try {
    if (!useStore.getState().settings?.sound) return;
    SOUNDS[name]?.();
  } catch { /* audio not available */ }
}

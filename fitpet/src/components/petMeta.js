export const STATE_INFO = {
  base: { label: 'Normal', emoji: '🐾', badge: '', color: '#c2c1ff', desc: 'Estado saludable' },
  strong: { label: 'Fuerte', emoji: '💪', badge: '💪', color: '#CCFF00', desc: '¡Gran consistencia!' },
  neglected: { label: 'Gordito', emoji: '🍔', badge: '🍔', color: '#9aa0aa', desc: 'Abandono prolongado' },
  tired: { label: 'Cansado', emoji: '😮‍💨', badge: '💤', color: '#FFB951', desc: 'Racha en riesgo' },
  champion: { label: 'Campeón', emoji: '🏆', badge: '👑', color: '#FFD54F', desc: '¡Leyenda!' },
};

export const FROG_VARIANTS = {
  natural: {
    label: 'Natural',
    filter: 'none',
    glow: 'rgba(204,255,0,0.24)',
  },
  lime: {
    label: 'Lima',
    filter: 'saturate(1.18) brightness(1.04)',
    glow: 'rgba(204,255,0,0.38)',
  },
  aqua: {
    label: 'Aqua',
    filter: 'hue-rotate(58deg) saturate(1.2) brightness(1.03)',
    glow: 'rgba(64,220,255,0.34)',
  },
  royal: {
    label: 'Royal',
    filter: 'hue-rotate(168deg) saturate(1.08) brightness(0.98)',
    glow: 'rgba(155,125,255,0.34)',
  },
  gold: {
    label: 'Gold',
    filter: 'hue-rotate(-34deg) saturate(1.16) brightness(1.07)',
    glow: 'rgba(255,202,74,0.38)',
  },
  shadow: {
    label: 'Shadow',
    filter: 'saturate(0.78) brightness(0.76) contrast(1.18)',
    glow: 'rgba(140,160,190,0.22)',
  },
};

export const SPECIES = {
  frog: { emoji: '🐸', label: 'Rana', body: '#79b13c' },
  dog: { emoji: '🐶', label: 'Perro', body: '#c8923f' },
  cat: { emoji: '🐱', label: 'Gato', body: '#9aa0aa' },
  panda: { emoji: '🐼', label: 'Panda', body: '#f3f3f3' },
  bear: { emoji: '🐻', label: 'Oso', body: '#a9784e' },
  rabbit: { emoji: '🐰', label: 'Conejo', body: '#e8e3f0' },
  fox: { emoji: '🦊', label: 'Zorro', body: '#e8843c' },
  penguin: { emoji: '🐧', label: 'Pingüino', body: '#2c3440' },
  turtle: { emoji: '🐢', label: 'Tortuga', body: '#6fae5f' },
};

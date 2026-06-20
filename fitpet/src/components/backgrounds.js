/*
  Real scene backgrounds (illustrated environments, not flat colors).
  Each id maps to an SVG scene drawn in SceneBackground. Unlock by level.
*/
export const BACKGROUNDS = {
  default:    { label: 'Auto',               unlock: 0 },
  gym:        { label: 'Gimnasio',           unlock: 0 },
  premiumGym: { label: 'Gimnasio premium',   unlock: 4 },
  soccer:     { label: 'Cancha de fútbol',   unlock: 0 },
  basket:     { label: 'Cancha de basket',   unlock: 3 },
  track:      { label: 'Pista de running',   unlock: 5 },
  park:       { label: 'Parque',             unlock: 2 },
  stadium:    { label: 'Estadio',            unlock: 10 },
  boxing:     { label: 'Ring de boxeo',      unlock: 8 },
  beach:      { label: 'Playa fitness',      unlock: 6 },
  futuristic: { label: 'Gym futurista',      unlock: 15 },
};

export function bgUnlocked(bg, level) {
  return level >= (bg?.unlock ?? 0);
}

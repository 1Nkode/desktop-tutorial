/*
  PetSprite — rigged vector creature that can be any of 10 species.
  Keeps the full rig: pupils that track, blink, 5 emotions, poses
  (stand/flex/sit), state tints, and equippable accessories.
  Species differ by body/belly color + ear shape + a special feature
  (mane, beak, shell, eye-patches). pet.color overrides the body color.
*/
export const SPECIES = {
  frog:    { emoji: '🐸', body: '#79b13c', belly: '#a6d76a', ear: 'none' },
  dog:     { emoji: '🐶', body: '#c9a36a', belly: '#ead6b3', ear: 'floppy' },
  cat:     { emoji: '🐱', body: '#9aa0aa', belly: '#d8dce1', ear: 'pointy' },
  bear:    { emoji: '🐻', body: '#a0764f', belly: '#d8b48c', ear: 'round' },
  panda:   { emoji: '🐼', body: '#f2f2f2', belly: '#ffffff', ear: 'round', earColor: '#222', special: 'panda' },
  rabbit:  { emoji: '🐰', body: '#dcd6ec', belly: '#ffffff', ear: 'long' },
  fox:     { emoji: '🦊', body: '#e8843c', belly: '#f6d9b8', ear: 'pointy', earColor: '#3a2a20' },
  penguin: { emoji: '🐧', body: '#2c3440', belly: '#ffffff', ear: 'none', special: 'penguin' },
  turtle:  { emoji: '🐢', body: '#6fae5f', belly: '#cde6a8', ear: 'none', special: 'turtle' },
  lion:    { emoji: '🦁', body: '#e0a23c', belly: '#f1d59a', ear: 'round', special: 'lion' },
};

export default function PetSprite({
  pose = 'stand',
  state = 'base',
  emotion = 'happy',
  pupil = { x: 0, y: 0 },
  blink = false,
  accessory = null,
  species = 'frog',
  color = null,
}) {
  const sp = SPECIES[species] || SPECIES.frog;
  const body = color || sp.body;
  const greenDark = shade(body, -0.28);
  const belly = sp.belly;
  const earColor = sp.earColor || body;
  const shirt = state === 'champion' ? '#3457c9' : '#3b6fd4';
  const sleepy = emotion === 'tired' || state === 'tired' || state === 'neglected' || pose === 'sit';
  const dx = (pupil.x || 0) * 5;
  const dy = (pupil.y || 0) * 4;

  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" className="petsprite" aria-hidden="true">
      {/* lion mane */}
      {sp.special === 'lion' && <circle cx="50" cy="36" r="30" fill="#b9791f" />}
      {/* turtle shell behind */}
      {sp.special === 'turtle' && <ellipse cx="50" cy="70" rx="38" ry="30" fill="#4e7b3e" />}

      {/* ears */}
      <Ears ear={sp.ear} color={earColor} body={body} dark={greenDark} />

      {/* arms */}
      {pose === 'flex' ? (
        <>
          <path d="M26 50 q-16 -6 -14 -20" fill="none" stroke={body} strokeWidth="9" strokeLinecap="round" />
          <path d="M74 50 q16 -6 14 -20" fill="none" stroke={body} strokeWidth="9" strokeLinecap="round" />
          <circle cx="16" cy="33" r="8" fill={body} stroke={greenDark} strokeWidth="2" />
          <circle cx="84" cy="33" r="8" fill={body} stroke={greenDark} strokeWidth="2" />
        </>
      ) : pose === 'sit' ? (
        <>
          <path d="M22 64 q-12 4 -10 14" fill="none" stroke={body} strokeWidth="9" strokeLinecap="round" />
          <path d="M78 64 q12 4 10 14" fill="none" stroke={body} strokeWidth="9" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M24 52 q-10 8 -8 20" fill="none" stroke={body} strokeWidth="9" strokeLinecap="round" />
          <path d="M76 52 q10 8 8 20" fill="none" stroke={body} strokeWidth="9" strokeLinecap="round" />
        </>
      )}

      {/* body */}
      {pose === 'sit'
        ? <ellipse cx="50" cy="66" rx="34" ry="28" fill={body} stroke={greenDark} strokeWidth="3" />
        : <rect x="22" y="34" width="56" height="60" rx="26" fill={body} stroke={greenDark} strokeWidth="3" />}

      {/* belly */}
      <ellipse cx="50" cy={pose === 'sit' ? 70 : 66} rx="20" ry={pose === 'sit' ? 18 : 22} fill={belly} opacity={sp.special === 'penguin' ? 1 : 0.6} />

      {/* shirt / tank top */}
      <path d={pose === 'sit'
        ? 'M30 66 q20 14 40 0 l-2 20 q-18 8 -36 0 Z'
        : 'M30 60 q20 12 40 0 l0 34 q-20 6 -40 0 Z'} fill={shirt} />
      <rect x="40" y="44" width="6" height="20" rx="3" fill={shirt} />
      <rect x="54" y="44" width="6" height="20" rx="3" fill={shirt} />

      {/* eye whites */}
      <circle cx="37" cy="34" r="15" fill="#fff" stroke={greenDark} strokeWidth="3" />
      <circle cx="63" cy="34" r="15" fill="#fff" stroke={greenDark} strokeWidth="3" />
      {/* panda eye patches */}
      {sp.special === 'panda' && (<>
        <ellipse cx="37" cy="34" rx="11" ry="13" fill="#222" opacity="0.85" />
        <ellipse cx="63" cy="34" rx="11" ry="13" fill="#222" opacity="0.85" />
        <circle cx="37" cy="34" r="9" fill="#fff" />
        <circle cx="63" cy="34" r="9" fill="#fff" />
      </>)}

      {/* eyes */}
      {blink ? (<>
        <path d="M24 34 q13 4 26 0" fill="none" stroke={greenDark} strokeWidth="3" strokeLinecap="round" />
        <path d="M50 34 q13 4 26 0" fill="none" stroke={greenDark} strokeWidth="3" strokeLinecap="round" />
      </>) : sleepy ? (<>
        <path d="M30 37 q7 5 14 0" fill="none" stroke="#15202b" strokeWidth="3" strokeLinecap="round" />
        <path d="M56 37 q7 5 14 0" fill="none" stroke="#15202b" strokeWidth="3" strokeLinecap="round" />
      </>) : (<>
        <circle cx={40 + dx} cy={36 + dy} r={emotion === 'surprised' ? 7 : 6} fill="#15202b" />
        <circle cx={60 + dx} cy={36 + dy} r={emotion === 'surprised' ? 7 : 6} fill="#15202b" />
        <circle cx={42 + dx} cy={34 + dy} r="2" fill="#fff" />
        <circle cx={62 + dx} cy={34 + dy} r="2" fill="#fff" />
      </>)}

      {emotion === 'sad' && (<>
        <path d="M30 22 q8 4 14 1" fill="none" stroke={greenDark} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M70 22 q-8 4 -14 1" fill="none" stroke={greenDark} strokeWidth="2.5" strokeLinecap="round" />
      </>)}

      {/* nose / beak / mouth */}
      {sp.special === 'penguin' ? (
        <path d="M44 52 l12 0 l-6 8 Z" fill="#f5a623" />
      ) : emotion === 'excited' ? (
        <ellipse cx="50" cy="58" rx="9" ry="7" fill="#7a2b2b" />
      ) : emotion === 'surprised' ? (
        <ellipse cx="50" cy="59" rx="5" ry="6" fill="#7a2b2b" />
      ) : emotion === 'sad' ? (
        <path d="M40 61 q10 -8 20 0" fill="none" stroke={greenDark} strokeWidth="2.5" strokeLinecap="round" />
      ) : emotion === 'tired' ? (
        <path d="M42 59 q8 -3 16 0" fill="none" stroke={greenDark} strokeWidth="2.5" strokeLinecap="round" />
      ) : (
        <path d="M38 56 q12 9 24 0" fill="none" stroke={greenDark} strokeWidth="2.5" strokeLinecap="round" />
      )}

      {(emotion === 'happy' || emotion === 'excited') && (<>
        <ellipse cx="28" cy="50" rx="4" ry="2.5" fill="#ff8a8a" opacity="0.5" />
        <ellipse cx="72" cy="50" rx="4" ry="2.5" fill="#ff8a8a" opacity="0.5" />
      </>)}

      {pose === 'flex' && (<>
        <circle cx="16" cy="26" r="6" fill={body} stroke={greenDark} strokeWidth="2" />
        <circle cx="84" cy="26" r="6" fill={body} stroke={greenDark} strokeWidth="2" />
      </>)}

      {/* accessories */}
      {accessory === 'glasses' && (<g>
        <rect x="24" y="27" width="24" height="14" rx="7" fill="#15202b" />
        <rect x="52" y="27" width="24" height="14" rx="7" fill="#15202b" />
        <rect x="46" y="32" width="8" height="3" fill="#15202b" />
      </g>)}
      {accessory === 'crown' && (<g>
        <path d="M30 20 L36 9 L43 17 L50 6 L57 17 L64 9 L70 20 Z" fill="#FFD54F" stroke="#c9a227" strokeWidth="1.5" strokeLinejoin="round" />
        <rect x="30" y="19" width="40" height="4" rx="2" fill="#e6b800" />
      </g>)}
      {accessory === 'bandana' && (<g>
        <rect x="20" y="16" width="60" height="8" rx="3" fill="#ff4d6d" />
        <path d="M78 18 l12 -4 l-2 8 Z" fill="#ff4d6d" />
      </g>)}
      {accessory === 'cap' && (<g>
        <path d="M24 24 q26 -16 52 0 Z" fill="#2db36b" />
        <rect x="22" y="23" width="40" height="5" rx="2" fill="#239a5b" />
      </g>)}
      {accessory === 'muscle' && <text x="86" y="60" fontSize="16" textAnchor="middle">💪</text>}
      {accessory === 'trophy' && <text x="50" y="14" fontSize="16" textAnchor="middle">🏆</text>}
      {accessory === 'wings' && <text x="50" y="14" fontSize="16" textAnchor="middle">🦋</text>}
      {accessory === 'medal' && <text x="50" y="78" fontSize="16" textAnchor="middle">🏅</text>}
    </svg>
  );
}

function Ears({ ear, color, dark }) {
  if (ear === 'pointy') return (<>
    <path d="M26 30 L20 8 L40 22 Z" fill={color} stroke={dark} strokeWidth="2" strokeLinejoin="round" />
    <path d="M74 30 L80 8 L60 22 Z" fill={color} stroke={dark} strokeWidth="2" strokeLinejoin="round" />
  </>);
  if (ear === 'round') return (<>
    <circle cx="28" cy="20" r="10" fill={color} stroke={dark} strokeWidth="2" />
    <circle cx="72" cy="20" r="10" fill={color} stroke={dark} strokeWidth="2" />
  </>);
  if (ear === 'floppy') return (<>
    <ellipse cx="22" cy="34" rx="8" ry="16" fill={color} stroke={dark} strokeWidth="2" />
    <ellipse cx="78" cy="34" rx="8" ry="16" fill={color} stroke={dark} strokeWidth="2" />
  </>);
  if (ear === 'long') return (<>
    <ellipse cx="36" cy="14" rx="6" ry="18" fill={color} stroke={dark} strokeWidth="2" />
    <ellipse cx="64" cy="14" rx="6" ry="18" fill={color} stroke={dark} strokeWidth="2" />
  </>);
  return null;
}

// lighten/darken a hex color
function shade(hex, amt) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  r = Math.round(Math.max(0, Math.min(255, r + r * amt)));
  g = Math.round(Math.max(0, Math.min(255, g + g * amt)));
  b = Math.round(Math.max(0, Math.min(255, b + b * amt)));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/*
  PetSprite — rigged vector recreation of the user's character: a chunky
  green frog with big eyes and a blue tank top. Fully animatable parts:
    - pupils that track a point (eye-following, like Talking Tom)
    - blink (eyelids close)
    - 5 emotions (happy, excited, tired, sad, surprised) → eyes + mouth
    - poses: stand / flex (biceps) / sit
    - state tints (champion gold, neglected paler + frown, etc.)
*/
export default function PetSprite({
  pose = 'stand',
  state = 'base',
  emotion = 'happy',
  pupil = { x: 0, y: 0 },
  blink = false,
  accessory = null,
}) {
  const green = state === 'neglected' ? '#7e9e63' : '#79b13c';
  const greenDark = state === 'neglected' ? '#5d7a44' : '#5d8f28';
  const belly = '#a6d76a';
  const shirt = state === 'champion' ? '#3457c9' : '#3b6fd4';

  const sleepy = emotion === 'tired' || state === 'tired' || state === 'neglected' || pose === 'sit';
  const dx = (pupil.x || 0) * 5;
  const dy = (pupil.y || 0) * 4;

  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" className="petsprite" aria-hidden="true">
      {/* back arms */}
      {pose === 'flex' ? (
        <>
          <path d="M26 50 q-16 -6 -14 -20" fill="none" stroke={green} strokeWidth="9" strokeLinecap="round" />
          <path d="M74 50 q16 -6 14 -20" fill="none" stroke={green} strokeWidth="9" strokeLinecap="round" />
          <circle cx="16" cy="33" r="8" fill={green} stroke={greenDark} strokeWidth="2" />
          <circle cx="84" cy="33" r="8" fill={green} stroke={greenDark} strokeWidth="2" />
        </>
      ) : pose === 'sit' ? (
        <>
          <path d="M22 64 q-12 4 -10 14" fill="none" stroke={green} strokeWidth="9" strokeLinecap="round" />
          <path d="M78 64 q12 4 10 14" fill="none" stroke={green} strokeWidth="9" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M24 52 q-10 8 -8 20" fill="none" stroke={green} strokeWidth="9" strokeLinecap="round" />
          <path d="M76 52 q10 8 8 20" fill="none" stroke={green} strokeWidth="9" strokeLinecap="round" />
        </>
      )}

      {/* body */}
      {pose === 'sit' ? (
        <ellipse cx="50" cy="66" rx="34" ry="28" fill={green} stroke={greenDark} strokeWidth="3" />
      ) : (
        <rect x="22" y="34" width="56" height="60" rx="26" fill={green} stroke={greenDark} strokeWidth="3" />
      )}

      {/* belly */}
      <ellipse cx="50" cy={pose === 'sit' ? 70 : 66} rx="20" ry={pose === 'sit' ? 18 : 22} fill={belly} opacity="0.6" />

      {/* shirt / tank top */}
      <path
        d={pose === 'sit'
          ? 'M30 66 q20 14 40 0 l-2 20 q-18 8 -36 0 Z'
          : 'M30 60 q20 12 40 0 l0 34 q-20 6 -40 0 Z'}
        fill={shirt}
      />
      <rect x="40" y="44" width="6" height="20" rx="3" fill={shirt} />
      <rect x="54" y="44" width="6" height="20" rx="3" fill={shirt} />

      {/* eye whites */}
      <circle cx="37" cy="34" r="15" fill="#fff" stroke={greenDark} strokeWidth="3" />
      <circle cx="63" cy="34" r="15" fill="#fff" stroke={greenDark} strokeWidth="3" />

      {/* eyes: blink > sleepy > open (tracking) */}
      {blink ? (
        <>
          <path d="M24 34 q13 4 26 0" fill="none" stroke={greenDark} strokeWidth="3" strokeLinecap="round" />
          <path d="M50 34 q13 4 26 0" fill="none" stroke={greenDark} strokeWidth="3" strokeLinecap="round" />
        </>
      ) : sleepy ? (
        <>
          <path d="M30 37 q7 5 14 0" fill="none" stroke="#15202b" strokeWidth="3" strokeLinecap="round" />
          <path d="M56 37 q7 5 14 0" fill="none" stroke="#15202b" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx={40 + dx} cy={36 + dy} r={emotion === 'surprised' ? 7 : 6} fill="#15202b" />
          <circle cx={60 + dx} cy={36 + dy} r={emotion === 'surprised' ? 7 : 6} fill="#15202b" />
          <circle cx={42 + dx} cy={34 + dy} r="2" fill="#fff" />
          <circle cx={62 + dx} cy={34 + dy} r="2" fill="#fff" />
        </>
      )}

      {/* eyebrows for some emotions */}
      {emotion === 'sad' && (
        <>
          <path d="M30 22 q8 4 14 1" fill="none" stroke={greenDark} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M70 22 q-8 4 -14 1" fill="none" stroke={greenDark} strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}

      {/* mouth by emotion */}
      {emotion === 'excited' ? (
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

      {/* rosy cheeks when happy/excited */}
      {(emotion === 'happy' || emotion === 'excited') && (
        <>
          <ellipse cx="30" cy="50" rx="4" ry="2.5" fill="#ff8a8a" opacity="0.5" />
          <ellipse cx="70" cy="50" rx="4" ry="2.5" fill="#ff8a8a" opacity="0.5" />
        </>
      )}

      {/* fists for flex */}
      {pose === 'flex' && (
        <>
          <circle cx="16" cy="26" r="6" fill={green} stroke={greenDark} strokeWidth="2" />
          <circle cx="84" cy="26" r="6" fill={green} stroke={greenDark} strokeWidth="2" />
        </>
      )}

      {/* ---- equippable accessories (rendered ON the frog) ---- */}
      {accessory === 'glasses' && (
        <g>
          <rect x="24" y="27" width="24" height="14" rx="7" fill="#15202b" />
          <rect x="52" y="27" width="24" height="14" rx="7" fill="#15202b" />
          <rect x="46" y="32" width="8" height="3" fill="#15202b" />
          <rect x="27" y="30" width="7" height="3" rx="1.5" fill="#ffffff" opacity="0.35" />
          <rect x="55" y="30" width="7" height="3" rx="1.5" fill="#ffffff" opacity="0.35" />
        </g>
      )}
      {accessory === 'crown' && (
        <g>
          <path d="M30 20 L36 9 L43 17 L50 6 L57 17 L64 9 L70 20 Z" fill="#FFD54F" stroke="#c9a227" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="50" cy="8" r="2" fill="#ff5b6e" />
          <rect x="30" y="19" width="40" height="4" rx="2" fill="#e6b800" />
        </g>
      )}
      {accessory === 'bandana' && (
        <g>
          <rect x="20" y="16" width="60" height="8" rx="3" fill="#ff4d6d" />
          <path d="M78 18 l12 -4 l-2 8 Z" fill="#ff4d6d" />
          <rect x="20" y="18" width="60" height="2" fill="#ffffff" opacity="0.4" />
        </g>
      )}
      {accessory === 'muscle' && (
        <text x="86" y="60" fontSize="16" textAnchor="middle">💪</text>
      )}
      {accessory === 'trophy' && (
        <text x="50" y="14" fontSize="16" textAnchor="middle">🏆</text>
      )}
      {accessory === 'wings' && (
        <text x="50" y="14" fontSize="16" textAnchor="middle">🦋</text>
      )}
    </svg>
  );
}

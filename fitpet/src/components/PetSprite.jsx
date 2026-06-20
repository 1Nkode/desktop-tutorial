/*
  PetSprite — vector recreation of the user's character: a chunky green frog
  with big white eyes and a blue tank top. Drawn in SVG so it can be posed
  and animated. Poses: stand (idle/walk/run) · flex (jump/celebrate/dance)
  · sit (sleep/rest). `state` tweaks colors (champion=gold trim, neglected=
  paler/sadder, etc.) to match the evolution system.
*/
export default function PetSprite({ pose = 'stand', state = 'base' }) {
  const green = state === 'neglected' ? '#7e9e63' : '#79b13c';
  const greenDark = state === 'neglected' ? '#5d7a44' : '#5d8f28';
  const belly = '#a6d76a';
  const shirt = state === 'champion' ? '#3457c9' : '#3b6fd4';
  const eyeOpen = pose !== 'sit' && state !== 'tired' && state !== 'neglected';

  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" className="petsprite" aria-hidden="true">
      {/* back arms (behind body) */}
      {pose === 'flex' ? (
        <>
          <path d="M26 50 q-16 -6 -14 -20" fill="none" stroke={green} strokeWidth="9" strokeLinecap="round" />
          <path d="M74 50 q16 -6 14 -20" fill="none" stroke={green} strokeWidth="9" strokeLinecap="round" />
          {/* biceps */}
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

      {/* eyes (big frog eyes on top) */}
      <circle cx="37" cy="34" r="15" fill="#fff" stroke={greenDark} strokeWidth="3" />
      <circle cx="63" cy="34" r="15" fill="#fff" stroke={greenDark} strokeWidth="3" />
      {eyeOpen ? (
        <>
          <circle cx="40" cy="36" r="6" fill="#15202b" />
          <circle cx="60" cy="36" r="6" fill="#15202b" />
          <circle cx="42" cy="34" r="2" fill="#fff" />
          <circle cx="62" cy="34" r="2" fill="#fff" />
        </>
      ) : (
        <>
          {/* sleepy / tired half-closed eyes */}
          <path d="M30 37 q7 5 14 0" fill="none" stroke="#15202b" strokeWidth="3" strokeLinecap="round" />
          <path d="M56 37 q7 5 14 0" fill="none" stroke="#15202b" strokeWidth="3" strokeLinecap="round" />
        </>
      )}

      {/* mouth */}
      {state === 'neglected' || state === 'tired' ? (
        <path d="M40 58 q10 -6 20 0" fill="none" stroke={greenDark} strokeWidth="2.5" strokeLinecap="round" />
      ) : (
        <path d="M38 56 q12 9 24 0" fill="none" stroke={greenDark} strokeWidth="2.5" strokeLinecap="round" />
      )}

      {/* front arms (flex shows raised forearms with fists) */}
      {pose === 'flex' && (
        <>
          <circle cx="16" cy="26" r="6" fill={green} stroke={greenDark} strokeWidth="2" />
          <circle cx="84" cy="26" r="6" fill={green} stroke={greenDark} strokeWidth="2" />
        </>
      )}
    </svg>
  );
}

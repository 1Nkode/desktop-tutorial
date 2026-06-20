import './SceneBackground.css';

/*
  SceneBackground — illustrated environments drawn as SVG (16:10), sliced to
  fill the stage. The pet stands on the floor line (~y 78). Subtle animated
  bits (sun glow, crowd, lights) make them feel alive.
*/
export default function SceneBackground({ id = 'gym' }) {
  const Scene = SCENES[id] || SCENES.gym;
  return (
    <div className="scene">
      <svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" className="scene-svg">{Scene()}</svg>
    </div>
  );
}

const SCENES = {
  default: () => (<g>
    <defs>
      <linearGradient id="dft" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#283145" />
        <stop offset="0.62" stopColor="#171d2b" />
        <stop offset="1" stopColor="#10141e" />
      </linearGradient>
      <radialGradient id="dftGlow" cx="0.5" cy="0.14" r="0.82">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.24" />
        <stop offset="1" stopColor="#000000" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="160" height="100" fill="url(#dft)" />
    <rect width="160" height="100" fill="url(#dftGlow)" />
    <rect x="12" y="14" width="136" height="30" rx="4" fill="#111827" opacity="0.5" />
    <rect x="20" y="20" width="38" height="18" rx="2" fill="#60748d" opacity="0.42" />
    <rect x="100" y="22" width="36" height="16" rx="2" fill="#556880" opacity="0.36" />
    <rect x="0" y="64" width="160" height="36" fill="#252c3a" />
    <path d="M0 64 H160" stroke="#687386" strokeWidth="1.3" opacity="0.55" />
    {[26, 58, 90, 122].map(x => <path key={x} d={`M${x} 100 L80 64`} stroke="#465165" strokeWidth="0.8" opacity="0.32" />)}
    <ellipse cx="80" cy="82" rx="56" ry="13" fill="#000" opacity="0.18" />
    <rect x="18" y="58" width="34" height="3" rx="1.5" fill="#b5bfce" />
    <circle cx="18" cy="59.5" r="5" fill="#252d3b" />
    <circle cx="52" cy="59.5" r="5" fill="#252d3b" />
  </g>),

  gym: () => (<g>
    <rect width="160" height="100" fill="#1c2230" />
    <rect width="160" height="78" fill="url(#gymWall)" />
    <defs><linearGradient id="gymWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a3245" /><stop offset="1" stopColor="#1b2130" /></linearGradient></defs>
    {/* window strip */}
    <rect x="10" y="14" width="60" height="22" rx="2" fill="#3b4761" opacity="0.6" />
    {/* dumbbell rack */}
    <rect x="96" y="40" width="56" height="38" fill="#222a3a" />
    {[46, 56, 66].map(y => <g key={y}><rect x="100" y={y} width="48" height="4" rx="2" fill="#4a5570" /><circle cx="104" cy={y + 2} r="4" fill="#cfd6e6" /><circle cx="144" cy={y + 2} r="4" fill="#cfd6e6" /></g>)}
    <rect x="0" y="78" width="160" height="22" fill="#39404f" />
    <rect x="0" y="78" width="160" height="3" fill="#4a5366" />
    {/* barbell on floor */}
    <rect x="20" y="74" width="40" height="3" rx="1.5" fill="#9aa3b8" />
    <circle cx="20" cy="75.5" r="5" fill="#2f3647" /><circle cx="60" cy="75.5" r="5" fill="#2f3647" />
  </g>),

  premiumGym: () => (<g>
    <defs>
      <linearGradient id="pgWall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#283145" />
        <stop offset="0.58" stopColor="#171d2b" />
        <stop offset="1" stopColor="#0f1420" />
      </linearGradient>
      <radialGradient id="pgLight" cx="0.5" cy="0.08" r="0.9">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.34" />
        <stop offset="0.45" stopColor="#9db5ff" stopOpacity="0.1" />
        <stop offset="1" stopColor="#000000" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="pgFloor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#31394b" />
        <stop offset="1" stopColor="#161b26" />
      </linearGradient>
    </defs>
    <rect width="160" height="100" fill="url(#pgWall)" />
    <rect width="160" height="100" fill="url(#pgLight)" />
    <rect x="14" y="13" width="132" height="33" rx="4" fill="#111827" opacity="0.72" />
    <rect x="20" y="18" width="42" height="22" rx="2" fill="#5f728d" opacity="0.46" />
    <rect x="68" y="18" width="24" height="22" rx="2" fill="#44516a" opacity="0.62" />
    <rect x="99" y="18" width="40" height="22" rx="2" fill="#536985" opacity="0.48" />
    {[20, 68, 99].map(x => <line key={x} x1={x} y1="18" x2={x + 34} y2="40" stroke="#ffffff" strokeWidth="0.8" opacity="0.13" />)}
    <rect x="0" y="64" width="160" height="36" fill="url(#pgFloor)" />
    <path d="M0 64 H160" stroke="#717d91" strokeWidth="1.5" opacity="0.55" />
    {[0, 28, 56, 84, 112, 140].map(x => <path key={x} d={`M${x} 100 L80 64`} stroke="#445064" strokeWidth="0.8" opacity="0.35" />)}
    {[72, 82, 92].map((y, i) => <line key={y} x1="0" y1={y} x2="160" y2={y} stroke="#ffffff" strokeWidth="0.7" opacity={0.16 - i * 0.03} />)}
    <g opacity="0.96">
      <rect x="107" y="40" width="41" height="23" rx="3" fill="#1d2433" />
      {[45, 52, 59].map(y => <g key={y}>
        <rect x="111" y={y} width="33" height="3" rx="1.5" fill="#798497" />
        <circle cx="113" cy={y + 1.5} r="3.2" fill="#aeb7c7" />
        <circle cx="142" cy={y + 1.5} r="3.2" fill="#aeb7c7" />
      </g>)}
    </g>
    <g>
      <rect x="16" y="57" width="34" height="3" rx="1.5" fill="#c5ccd8" />
      <circle cx="16" cy="58.5" r="5.5" fill="#252d3b" />
      <circle cx="50" cy="58.5" r="5.5" fill="#252d3b" />
      <rect x="24" y="47" width="18" height="9" rx="2" fill="#ccff00" opacity="0.72" />
    </g>
    <ellipse cx="80" cy="82" rx="58" ry="13" fill="#000" opacity="0.18" />
  </g>),

  soccer: () => (<g>
    <rect width="160" height="100" fill="#6cc24a" />
    <rect width="160" height="44" fill="url(#sky)" />
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fd0ff" /><stop offset="1" stopColor="#cfeeff" /></linearGradient></defs>
    {/* stripes */}
    {[0, 1, 2, 3, 4, 5].map(i => <rect key={i} x={i * 27} y="44" width="13.5" height="56" fill="#5fb541" opacity="0.5" />)}
    {/* goal */}
    <rect x="58" y="30" width="44" height="20" fill="none" stroke="#fff" strokeWidth="2" />
    <path d="M58 30 L64 24 H96 L102 30" fill="none" stroke="#fff" strokeWidth="1.5" />
    {/* midline circle */}
    <ellipse cx="80" cy="82" rx="26" ry="9" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
    <circle cx="120" cy="86" r="4" fill="#fff" stroke="#111" strokeWidth="0.6" />
  </g>),

  basket: () => (<g>
    <rect width="160" height="100" fill="#c8803f" />
    <rect width="160" height="50" fill="#3a2a1c" />
    {/* backboard + hoop */}
    <rect x="66" y="14" width="28" height="18" rx="1" fill="#f2f2f2" stroke="#bbb" />
    <rect x="74" y="22" width="12" height="8" fill="none" stroke="#e8843c" strokeWidth="1.5" />
    <ellipse cx="80" cy="34" rx="9" ry="3" fill="none" stroke="#e8843c" strokeWidth="2" />
    {/* court */}
    <rect x="0" y="50" width="160" height="50" fill="#c8803f" />
    <rect x="0" y="50" width="160" height="50" fill="url(#wood)" opacity="0.25" />
    <defs><linearGradient id="wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset="0.5" stopColor="#000" stopOpacity="0.2" /><stop offset="1" stopColor="#000" stopOpacity="0" /></linearGradient></defs>
    <path d="M50 100 Q80 60 110 100" fill="none" stroke="#fff" strokeWidth="2" opacity="0.85" />
    <line x1="0" y1="78" x2="160" y2="78" stroke="#fff" strokeWidth="1" opacity="0.4" />
  </g>),

  track: () => (<g>
    <rect width="160" height="100" fill="#c0392b" />
    <rect width="160" height="46" fill="url(#sky2)" />
    <defs><linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffb56b" /><stop offset="1" stopColor="#ffe0c2" /></linearGradient></defs>
    <circle cx="130" cy="20" r="10" fill="#fff5cc" />
    {/* track + lanes */}
    <rect x="0" y="46" width="160" height="54" fill="#b8402f" />
    {[58, 70, 82, 94].map(y => <line key={y} x1="0" y1={y} x2="160" y2={y} stroke="#fff" strokeWidth="1.5" opacity="0.8" />)}
    {[20, 70, 120].map(x => <rect key={x} x={x} y="49" width="2" height="6" fill="#fff" />)}
  </g>),

  park: () => (<g>
    <rect width="160" height="100" fill="#7ec850" />
    <rect width="160" height="56" fill="url(#sky3)" />
    <defs><linearGradient id="sky3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fd0ff" /><stop offset="1" stopColor="#d8f3ff" /></linearGradient></defs>
    <circle cx="135" cy="18" r="9" fill="#fff4b8" />
    <g className="scene-cloud-a"><ellipse cx="40" cy="20" rx="14" ry="7" fill="#fff" opacity="0.9" /></g>
    <g className="scene-cloud-b"><ellipse cx="95" cy="30" rx="11" ry="6" fill="#fff" opacity="0.8" /></g>
    {/* trees */}
    {[18, 142].map(x => <g key={x}><rect x={x - 2} y="48" width="4" height="16" fill="#6b4423" /><circle cx={x} cy="44" r="12" fill="#3f9d4f" /></g>)}
    <rect x="0" y="64" width="160" height="36" fill="#7ec850" />
    <path d="M0 64 H160" stroke="#6cb544" strokeWidth="2" />
  </g>),

  stadium: () => (<g>
    <rect width="160" height="100" fill="#2e7d32" />
    <rect width="160" height="50" fill="#1b2a3a" />
    {/* stands with crowd */}
    <rect x="0" y="14" width="160" height="36" fill="#26384d" />
    <g className="scene-crowd">
      {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={4 + (i % 20) * 8} cy={20 + Math.floor(i / 20) * 9} r="2.4" fill={['#ff5b6e', '#ffd54f', '#82b1ff', '#7CFC00', '#fff'][i % 5]} />)}
    </g>
    {/* floodlights */}
    <rect x="20" y="6" width="10" height="5" fill="#fffac2" /><rect x="130" y="6" width="10" height="5" fill="#fffac2" />
    {/* pitch */}
    <rect x="0" y="50" width="160" height="50" fill="#2e7d32" />
    {[0,1,2,3].map(i => <rect key={i} x={i*40} y="50" width="20" height="50" fill="#2a722e" opacity="0.5" />)}
    <ellipse cx="80" cy="84" rx="24" ry="8" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.8" />
  </g>),

  boxing: () => (<g>
    <rect width="160" height="100" fill="#161a24" />
    <defs><radialGradient id="ringlight" cx="0.5" cy="0.2" r="0.8"><stop offset="0" stopColor="#39425a" /><stop offset="1" stopColor="#12151d" /></radialGradient></defs>
    <rect width="160" height="100" fill="url(#ringlight)" />
    {/* ropes */}
    {[34, 44, 54].map(y => <line key={y} x1="6" y1={y} x2="154" y2={y} stroke="#d23b54" strokeWidth="2.5" />)}
    {/* corner posts */}
    <rect x="4" y="30" width="5" height="50" fill="#1f2533" /><rect x="151" y="30" width="5" height="50" fill="#1f2533" />
    {/* canvas */}
    <rect x="0" y="60" width="160" height="40" fill="#2b3346" />
    <rect x="0" y="60" width="160" height="3" fill="#414b63" />
    <path d="M30 100 L50 64 H110 L130 100" fill="#323b50" opacity="0.6" />
  </g>),

  beach: () => (<g>
    <rect width="160" height="100" fill="#f2e2b8" />
    <rect width="160" height="50" fill="url(#sky4)" />
    <defs><linearGradient id="sky4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5ec6e8" /><stop offset="1" stopColor="#bdeeff" /></linearGradient></defs>
    <circle cx="30" cy="20" r="11" fill="#fff3a0" />
    {/* sea */}
    <rect x="0" y="50" width="160" height="20" fill="#2bb0d6" />
    <path d="M0 54 q20 4 40 0 t40 0 t40 0 t40 0" fill="none" stroke="#bff0ff" strokeWidth="1.5" opacity="0.7" />
    {/* sand */}
    <rect x="0" y="70" width="160" height="30" fill="#f2dca0" />
    {/* palm */}
    <rect x="140" y="40" width="3" height="34" fill="#7a5a2e" />
    <g fill="#3f9d4f"><ellipse cx="142" cy="38" rx="12" ry="4" /><ellipse cx="142" cy="40" rx="4" ry="11" /></g>
  </g>),

  futuristic: () => (<g>
    <rect width="160" height="100" fill="#0a0e1a" />
    <rect width="160" height="100" fill="url(#fut)" />
    <defs><linearGradient id="fut" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#10203a" /><stop offset="1" stopColor="#070a14" /></linearGradient></defs>
    {/* neon grid floor */}
    {[82, 88, 95].map((y, i) => <line key={y} x1="0" y1={y} x2="160" y2={y} stroke="#00e0ff" strokeWidth="1" opacity={0.5 - i * 0.1} />)}
    {[10,40,70,100,130,150].map(x => <line key={x} x1="80" y1="78" x2={x} y2="100" stroke="#00e0ff" strokeWidth="0.8" opacity="0.4" />)}
    {/* neon side panels */}
    <rect x="6" y="20" width="6" height="50" rx="3" fill="#ff2bd6" opacity="0.8" className="scene-neon" />
    <rect x="148" y="20" width="6" height="50" rx="3" fill="#00e0ff" opacity="0.8" className="scene-neon" />
    <circle cx="80" cy="34" r="16" fill="none" stroke="#7b5bff" strokeWidth="2" opacity="0.7" />
  </g>),
};

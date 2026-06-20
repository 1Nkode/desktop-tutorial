import './SceneBackground.css';

/* Renders an animated scene: a base gradient + an ambient fx layer. */
export default function SceneBackground({ bg }) {
  const fx = bg?.fx || 'none';
  return (
    <div className="scene" style={{ background: bg?.css }}>
      {fx === 'lights' && (
        <div className="scene-lights">
          <span style={{ left: '12%', animationDelay: '0s' }} />
          <span style={{ left: '40%', animationDelay: '0.6s' }} />
          <span style={{ left: '68%', animationDelay: '1.2s' }} />
          <span style={{ left: '88%', animationDelay: '0.3s' }} />
        </div>
      )}
      {fx === 'clouds' && (
        <div className="scene-clouds">
          <span style={{ top: '14%', animationDuration: '26s' }} />
          <span style={{ top: '30%', animationDuration: '38s', animationDelay: '-10s' }} />
          <span style={{ top: '8%', animationDuration: '46s', animationDelay: '-20s' }} />
        </div>
      )}
      {fx === 'rays' && <div className="scene-rays" />}
      {fx === 'bokeh' && (
        <div className="scene-bokeh">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} style={{ left: `${(i * 11 + 5) % 100}%`, animationDelay: `${i * 0.7}s`, animationDuration: `${5 + (i % 4)}s` }} />
          ))}
        </div>
      )}
      {fx === 'crowd' && (
        <div className="scene-crowd">
          {Array.from({ length: 22 }).map((_, i) => (
            <span key={i} style={{ animationDelay: `${(i % 6) * 0.25}s` }} />
          ))}
        </div>
      )}
      {fx === 'snow' && (
        <div className="scene-snow">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} style={{ left: `${(i * 7 + 3) % 100}%`, animationDuration: `${5 + (i % 5)}s`, animationDelay: `${-i * 0.6}s` }} />
          ))}
        </div>
      )}
      <div className="scene-floor" />
    </div>
  );
}

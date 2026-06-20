import { garment, DEFAULT_OUTFIT } from '../data/clothing';
import './PetClothes.css';

/* Layered garments drawn over the pet (cap / shirt / pants), Talking-Tom style. */
export default function PetClothes({ outfit, scale = 1 }) {
  const o = outfit || DEFAULT_OUTFIT;
  const hat = garment('hat', o.hat);
  const top = garment('top', o.top);
  const bottom = garment('bottom', o.bottom);

  return (
    <div className="pc-clothes" style={{ '--cl-scale': scale }} aria-hidden="true">
      {/* bottom first (behind), then top, then hat */}
      {bottom?.color && <Bottom id={bottom.id} color={bottom.color} />}
      {top?.color && <Top id={top.id} color={top.color} />}
      {hat?.color && <Hat id={hat.id} color={hat.color} />}
    </div>
  );
}

function Top({ id, color }) {
  const tank = id.startsWith('tank');
  return (
    <div className={`cl-top ${tank ? 'cl-tank' : ''}`}>
      {!tank && <span className="cl-sleeve left" style={{ background: color }} />}
      {!tank && <span className="cl-sleeve right" style={{ background: color }} />}
      <span className="cl-torso" style={{ background: color }}>
        {tank ? <><span className="cl-strap" style={{ background: color }} /><span className="cl-strap r" style={{ background: color }} /></> : <span className="cl-collar" />}
      </span>
    </div>
  );
}

function Bottom({ id, color }) {
  const shorts = id.startsWith('shorts');
  return (
    <div className={`cl-bottom ${shorts ? 'cl-shorts' : ''}`}>
      <span className="cl-leg left" style={{ background: color }} />
      <span className="cl-leg right" style={{ background: color }} />
    </div>
  );
}

function Hat({ id, color }) {
  if (id === 'crown') return <div className="cl-crown">👑</div>;
  if (id.startsWith('band')) return <div className="cl-band" style={{ background: color }} />;
  // cap
  return (
    <div className="cl-cap">
      <span className="cl-cap-dome" style={{ background: color }} />
      <span className="cl-cap-brim" style={{ background: color }} />
    </div>
  );
}

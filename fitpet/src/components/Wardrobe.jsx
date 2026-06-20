import { useStore } from '../store/useStore';
import PetSprite from './PetSprite';
import { FROG_VARIANTS } from './petMeta';
import './Wardrobe.css';

/*
  Estilo de la mascota — recolorea el propio personaje (filtro sobre el vídeo),
  así el color es parte de la mascota y no un PNG encima.
*/
const SWATCH = {
  natural: '#79b13c', lime: '#aadb1f', aqua: '#3fd0e0',
  royal: '#7b5bff', gold: '#ffca4a', shadow: '#5b6470',
};

export default function Wardrobe({ onClose }) {
  const { pet, setPetVariant } = useStore();
  const current = pet.variant || 'natural';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal animate-slideUp wd-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h3 className="modal-title">Estilo de la mascota 🎨</h3>

        <div className="wd-preview">
          <div className="wd-pet">
            <PetSprite pose="stand" emotion="happy" variant={current} />
          </div>
        </div>

        <p className="wd-slot-label">Color / estilo</p>
        <div className="wd-items">
          {Object.entries(FROG_VARIANTS).map(([id, v]) => (
            <button key={id} className={`wd-variant ${current === id ? 'on' : ''}`} onClick={() => setPetVariant(id)}>
              <span className="wd-swatch" style={{ background: SWATCH[id] || '#79b13c' }} />
              <span className="wd-variant-label">{v.label}</span>
            </button>
          ))}
        </div>

        <p className="wd-note">El color se aplica al propio personaje. Cambiar de animal y prendas reales llegará con sets de arte dedicados.</p>

        <button className="btn btn-primary modal-submit" style={{ marginTop: 12 }} onClick={onClose}>Listo</button>
      </div>
    </div>
  );
}

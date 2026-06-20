import { useStore } from '../store/useStore';
import PetSprite from './PetSprite';
import PetClothes from './PetClothes';
import { WARDROBE, SLOT_INFO } from '../data/clothing';
import './Wardrobe.css';

export default function Wardrobe({ onClose }) {
  const { pet, setOutfit } = useStore();
  const outfit = pet.outfit || {};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal animate-slideUp wd-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h3 className="modal-title">Vestuario 👕</h3>

        {/* live preview */}
        <div className="wd-preview">
          <div className="wd-pet">
            <PetSprite pose="stand" emotion="happy" variant={pet.variant || 'natural'} />
            <PetClothes outfit={outfit} />
          </div>
        </div>

        {SLOT_INFO.map(slot => (
          <div className="wd-slot" key={slot.id}>
            <p className="wd-slot-label">{slot.icon} {slot.label}</p>
            <div className="wd-items">
              {WARDROBE[slot.id].map(g => {
                const active = (outfit[slot.id] || 'none') === g.id;
                return (
                  <button key={g.id} className={`wd-item ${active ? 'on' : ''}`} onClick={() => setOutfit(slot.id, g.id)} title={g.label}>
                    {g.color
                      ? <span className="wd-swatch" style={{ background: g.id === 'crown' ? 'transparent' : g.color }}>{g.id === 'crown' ? '👑' : ''}</span>
                      : <span className="wd-swatch wd-none">∅</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <button className="btn btn-primary modal-submit" style={{ marginTop: 12 }} onClick={onClose}>Listo</button>
      </div>
    </div>
  );
}

import { useStore } from '../store/useStore';
import PetSprite, { SPECIES } from './PetSprite';
import { BACKGROUNDS } from './backgrounds';
import './PetCustomize.css';

const COLORS = [
  { id: null, label: 'Auto' },
  '#79b13c', '#3b6fd4', '#c2c1ff', '#FFB951', '#ff5b6e',
  '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#f1c40f',
];

const SPECIES_LIST = Object.entries(SPECIES);

export default function PetCustomize({ onClose }) {
  const { pet, setSpecies, setPetColor, setBackground } = useStore();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal animate-slideUp pc-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h3 className="modal-title">Personalizar mascota</h3>

        {/* live preview */}
        <div className="pc-preview" style={{ background: BACKGROUNDS[pet.background]?.css || BACKGROUNDS.default.css }}>
          <div className="pc-preview-sprite">
            <PetSprite pose="stand" emotion="happy" species={pet.species} color={pet.color} accessory={pet.accessories?.[0]} />
          </div>
        </div>

        <p className="pc-label">Especie</p>
        <div className="pc-species">
          {SPECIES_LIST.map(([id, sp]) => (
            <button key={id} className={`pc-sp ${pet.species === id ? 'on' : ''}`} onClick={() => setSpecies(id)}>
              <span className="pc-sp-emoji">{sp.emoji}</span>
            </button>
          ))}
        </div>

        <p className="pc-label">Color</p>
        <div className="pc-colors">
          {COLORS.map((c, i) => {
            const val = typeof c === 'string' ? c : c.id;
            const isAuto = val === null;
            const active = pet.color === val;
            return (
              <button key={i} className={`pc-color ${active ? 'on' : ''}`}
                style={{ background: isAuto ? 'transparent' : val, border: isAuto ? '1px dashed var(--glass-border)' : 'none' }}
                onClick={() => setPetColor(val)}>
                {isAuto ? 'A' : ''}
              </button>
            );
          })}
        </div>

        <p className="pc-label">Fondo</p>
        <div className="pc-bgs">
          {Object.entries(BACKGROUNDS).map(([id, bg]) => (
            <button key={id} className={`pc-bg ${pet.background === id ? 'on' : ''}`} style={{ background: bg.css }} onClick={() => setBackground(id)}>
              <span>{bg.label}</span>
            </button>
          ))}
        </div>

        <button className="btn btn-primary modal-submit" style={{ marginTop: 16 }} onClick={onClose}>Listo</button>
      </div>
    </div>
  );
}

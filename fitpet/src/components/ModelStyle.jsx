import { useStore } from '../store/useStore';
import './PetCustomize.css';

const COLORS = [
  { id: null, label: 'Original' },
  '#e23b3b', '#2f6fe0', '#2db36b', '#FFB951', '#7b5bff',
  '#aadb1f', '#ff4d6d', '#23262f', '#f1c40f', '#1abc9c',
];

export default function ModelStyle({ onClose }) {
  const { pet, setPetColor, modelAnim, modelAnimList, setModelAnim } = useStore();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal animate-slideUp pc-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h3 className="modal-title">Estilo del personaje 🎨</h3>

        <p className="pc-label">Animación</p>
        <div className="pc-species" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {modelAnimList.length === 0 && <p className="wd-note" style={{ gridColumn: '1 / -1' }}>Cargando animaciones…</p>}
          {modelAnimList.map(name => (
            <button key={name} className={`care-btn ${modelAnim === name ? 'ready' : ''}`} onClick={() => setModelAnim(name)}>
              {name}
            </button>
          ))}
        </div>

        <p className="pc-label">Color / ropa</p>
        <div className="pc-colors">
          {COLORS.map((c, i) => {
            const val = typeof c === 'string' ? c : c.id;
            const isAuto = val === null;
            const active = (pet.color ?? null) === val;
            return (
              <button key={i} className={`pc-color ${active ? 'on' : ''}`}
                style={{ background: isAuto ? 'transparent' : val, border: isAuto ? '1px dashed var(--glass-border)' : 'none' }}
                onClick={() => setPetColor(val)}>
                {isAuto ? 'A' : ''}
              </button>
            );
          })}
        </div>

        <button className="btn btn-primary modal-submit" style={{ marginTop: 16 }} onClick={onClose}>Listo</button>
      </div>
    </div>
  );
}

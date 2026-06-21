import { useState } from 'react';
import { useStore } from '../store/useStore';
import { WARDROBE, SLOT_INFO, garment } from '../data/clothing';
import './PetCustomize.css';

const COLORS = [
  { id: null, label: 'Original' },
  '#e23b3b', '#2f6fe0', '#2db36b', '#ffb951', '#7b5bff',
  '#aadb1f', '#ff4d6d', '#23262f', '#f1c40f', '#1abc9c',
];

const GENDERS = [
  { id: 'default', label: 'Base', icon: 'A' },
  { id: 'male', label: 'Hombre', icon: 'H' },
  { id: 'female', label: 'Mujer', icon: 'M' },
];

export default function ModelStyle({ onClose }) {
  const {
    pet,
    setPetColor,
    setOutfit,
    modelAnim,
    modelAnimList,
    setModelAnim,
    modelGender,
    setModelGender,
    modelZoom,
    modelOffsetY,
    setModelView,
  } = useStore();
  const [tab, setTab] = useState('genero');
  const activeZoom = Math.max(modelZoom || 1.82, 1.72);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal animate-slideUp pc-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h3 className="modal-title">Personalizar personaje</h3>

        <div className="pc-cats">
          {[
            ['genero', 'Genero'],
            ['color', 'Color'],
            ['ropa', 'Ropa'],
            ['animacion', 'Animacion'],
          ].map(([id, label]) => (
            <button key={id} className={`pc-cat ${tab === id ? 'on' : ''}`} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'genero' && (
          <>
            <div className="pc-species" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {GENDERS.map(g => (
                <button key={g.id} className={`pc-sp ${modelGender === g.id ? 'on' : ''}`} onClick={() => setModelGender(g.id)}>
                  <span className="pc-sp-emoji">{g.icon}</span>
                  <span className="wd-variant-label">{g.label}</span>
                </button>
              ))}
            </div>
            <div className="pc-sliders">
              <label>
                <span>Tamano</span>
                <input
                  type="range"
                  min="1.3"
                  max="2.4"
                  step="0.05"
                  value={activeZoom}
                  onChange={e => setModelView({ modelZoom: Number(e.target.value) })}
                />
              </label>
              <label>
                <span>Altura</span>
                <input
                  type="range"
                  min="-0.18"
                  max="0.22"
                  step="0.01"
                  value={modelOffsetY ?? 0.08}
                  onChange={e => setModelView({ modelOffsetY: Number(e.target.value) })}
                />
              </label>
            </div>
            <p className="wd-note">Si existen modelos male.glb o female.glb se usan automaticamente. Si no, se aplica una silueta visual distinta sobre el modelo base.</p>
          </>
        )}

        {tab === 'color' && (
          <>
            <p className="pc-label">Color del personaje</p>
            <div className="pc-colors">
              {COLORS.map((c, i) => {
                const val = typeof c === 'string' ? c : c.id;
                const isAuto = val === null;
                const active = (pet.color ?? null) === val;
                return (
                  <button
                    key={i}
                    className={`pc-color ${active ? 'on' : ''}`}
                    style={{ background: isAuto ? 'transparent' : val, border: isAuto ? '1px dashed var(--glass-border)' : 'none' }}
                    onClick={() => setPetColor(val)}
                    aria-label={isAuto ? 'Color original' : `Color ${val}`}
                  >
                    {isAuto ? 'A' : ''}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {tab === 'ropa' && (
          <>
            {SLOT_INFO.map(slot => (
              <div key={slot.id} className="pc-clothing-slot">
                <p className="pc-label">{slot.label}</p>
                <div className="pc-clothing-grid">
                  {WARDROBE[slot.id].map(item => {
                    const selected = garment(slot.id, item.id);
                    const active = (pet.outfit?.[slot.id] || 'none') === item.id;
                    return (
                      <button
                        key={item.id}
                        className={`pc-garment ${active ? 'on' : ''}`}
                        onClick={() => setOutfit(slot.id, item.id)}
                      >
                        <span
                          className="pc-garment-swatch"
                          style={{ background: selected.color || 'transparent', borderStyle: selected.color ? 'solid' : 'dashed' }}
                        />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}

        {tab === 'animacion' && (
          <>
            <div className="pc-species" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <button className={`care-btn ${!modelAnim ? 'ready' : ''}`} onClick={() => setModelAnim(null)}>Idle</button>
              {modelAnimList.map(name => (
                <button key={name} className={`care-btn ${modelAnim === name ? 'ready' : ''}`} onClick={() => setModelAnim(name)}>
                  {name}
                </button>
              ))}
            </div>
            {modelAnimList.length === 0 && <p className="wd-note">Este modelo no trae clips extra. El idle fluido se mantiene activo igualmente.</p>}
          </>
        )}

        <button className="btn btn-primary modal-submit" style={{ marginTop: 16 }} onClick={onClose}>Listo</button>
      </div>
    </div>
  );
}

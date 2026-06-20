import { useState } from 'react';
import { useStore } from '../store/useStore';
import './PetCustomize.css';

const COLORS = [
  { id: null, label: 'Original' },
  '#e23b3b', '#2f6fe0', '#2db36b', '#FFB951', '#7b5bff',
  '#aadb1f', '#ff4d6d', '#23262f', '#f1c40f', '#1abc9c',
];

const GENDERS = [
  { id: 'default', label: 'Estándar', icon: '🧍' },
  { id: 'male', label: 'Hombre', icon: '👨' },
  { id: 'female', label: 'Mujer', icon: '👩' },
];

export default function ModelStyle({ onClose }) {
  const { pet, setPetColor, modelAnim, modelAnimList, setModelAnim, modelGender, setModelGender, modelZoom, modelOffsetY, setModelView } = useStore();
  const [tab, setTab] = useState('encuadre');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal animate-slideUp pc-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h3 className="modal-title">Personalizar personaje</h3>

        <div className="pc-cats">
          {[['encuadre', '📐 Encuadre'], ['genero', '👤 Género'], ['bailes', '🕺 Bailes'], ['ropa', '👕 Ropa']].map(([id, label]) => (
            <button key={id} className={`pc-cat ${tab === id ? 'on' : ''}`} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>

        {tab === 'encuadre' && (
          <div className="ms-frame">
            <label className="ms-slabel">Zoom: {modelZoom.toFixed(2)}×</label>
            <input className="ms-slider" type="range" min="0.4" max="2.5" step="0.05" value={modelZoom}
              onChange={e => setModelView({ modelZoom: +e.target.value })} />
            <label className="ms-slabel">Altura: {modelOffsetY.toFixed(2)}</label>
            <input className="ms-slider" type="range" min="-1.5" max="1.5" step="0.05" value={modelOffsetY}
              onChange={e => setModelView({ modelOffsetY: +e.target.value })} />
            <button className="care-btn" style={{ marginTop: 6 }} onClick={() => setModelView({ modelZoom: 1, modelOffsetY: 0 })}>↺ Restablecer</button>
            <p className="wd-note">Ajusta el zoom y la altura hasta que el personaje quede bien encuadrado.</p>
          </div>
        )}

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
            <p className="wd-note">Estándar usa el modelo incluido. Hombre/Mujer cargan <code>public/model/male.glb</code> / <code>female.glb</code>; si no existen, se usa el estándar. (Puedes bajarlos gratis de Mixamo y soltarlos ahí.)</p>
          </>
        )}

        {tab === 'bailes' && (
          <>
            <div className="pc-species" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <button className={`care-btn ${!modelAnim ? 'ready' : ''}`} onClick={() => setModelAnim(null)}>Quieto</button>
              {modelAnimList.map(name => (
                <button key={name} className={`care-btn ${modelAnim === name ? 'ready' : ''}`} onClick={() => setModelAnim(name)}>🕺 {name}</button>
              ))}
            </div>
            {modelAnimList.length === 0 && <p className="wd-note">Este modelo no trae animaciones de baile. Añade clips (Mixamo) al GLB para verlos aquí.</p>}
          </>
        )}

        {tab === 'ropa' && (
          <>
            <p className="pc-label">Color del personaje</p>
            <div className="pc-colors">
              {COLORS.map((c, i) => {
                const val = typeof c === 'string' ? c : c.id;
                const isAuto = val === null;
                const active = (pet.color ?? null) === val;
                return (
                  <button key={i} className={`pc-color ${active ? 'on' : ''}`}
                    style={{ background: isAuto ? 'transparent' : val, border: isAuto ? '1px dashed var(--glass-border)' : 'none' }}
                    onClick={() => setPetColor(val)}>{isAuto ? 'A' : ''}</button>
                );
              })}
            </div>
            <p className="wd-note">Las prendas 3D (gorra, polo, pantalón) requieren modelos de ropa propios. Por ahora puedes recolorear el personaje.</p>
          </>
        )}

        <button className="btn btn-primary modal-submit" style={{ marginTop: 16 }} onClick={onClose}>Listo</button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useStore } from '../store/useStore';
import PetSprite, { SPECIES } from './PetSprite';
import SceneBackground from './SceneBackground';
import { BACKGROUNDS, BG_CATEGORIES, bgUnlocked } from './backgrounds';
import './PetCustomize.css';

const COLORS = [
  { id: null, label: 'Auto' },
  '#79b13c', '#3b6fd4', '#c2c1ff', '#FFB951', '#ff5b6e',
  '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#f1c40f',
];

const SPECIES_LIST = Object.entries(SPECIES);

export default function PetCustomize({ onClose }) {
  const { pet, user, setSpecies, setPetColor, setBackground } = useStore();
  const level = Math.max(user.level || 1, pet.level || 1);
  const [cat, setCat] = useState('Gimnasio');
  const curBg = BACKGROUNDS[pet.background] || BACKGROUNDS.default;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal animate-slideUp pc-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h3 className="modal-title">Personalizar mascota</h3>

        {/* live animated preview */}
        <div className="pc-preview">
          <SceneBackground bg={curBg} />
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

        <p className="pc-label">Fondo dinámico</p>
        <div className="pc-cats">
          {BG_CATEGORIES.map(c => (
            <button key={c.id} className={`pc-cat ${cat === c.id ? 'on' : ''}`} onClick={() => setCat(c.id)}>{c.icon} {c.id}</button>
          ))}
        </div>
        <div className="pc-bgs">
          {Object.entries(BACKGROUNDS).filter(([, bg]) => bg.cat === cat).map(([id, bg]) => {
            const unlocked = bgUnlocked(bg, level);
            return (
              <button key={id} className={`pc-bg ${pet.background === id ? 'on' : ''} ${unlocked ? '' : 'locked'}`}
                style={{ background: bg.css }} disabled={!unlocked}
                onClick={() => unlocked && setBackground(id)}>
                <span>{bg.label}</span>
                {!unlocked && <span className="pc-lock">🔒 Nv {bg.unlock}</span>}
              </button>
            );
          })}
        </div>

        <button className="btn btn-primary modal-submit" style={{ marginTop: 16 }} onClick={onClose}>Listo</button>
      </div>
    </div>
  );
}

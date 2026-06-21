import { useStore } from '../store/useStore';
import PetSprite from './PetSprite';
import SceneBackground from './SceneBackground';
import { BACKGROUNDS, bgUnlocked } from './backgrounds';
import { FROG_VARIANTS } from './petMeta';
import './PetCustomize.css';

const VARIANT_LIST = Object.entries(FROG_VARIANTS);

export default function PetCustomize({ onClose, mode = 'style' }) {
  const { pet, user, setPetVariant, setBackground } = useStore();
  const level = Math.max(user.level || 1, pet.level || 1);
  const activeVariant = pet.variant || 'natural';
  const showStyle = mode === 'style';
  const showScene = mode === 'scene';
  const title = showScene ? 'Cambiar escena' : 'Cambiar estilo';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal animate-slideUp pc-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h3 className="modal-title">{title}</h3>

        {/* live animated preview in the chosen scene */}
        <div className="pc-preview">
          <SceneBackground id={pet.background || 'default'} />
          <div className="pc-preview-sprite">
            <PetSprite pose="stand" emotion="happy" variant={activeVariant} />
          </div>
        </div>

        {showStyle && (
          <>
            <p className="pc-label">Estilo de rana animada</p>
            <div className="pc-variants">
              {VARIANT_LIST.map(([id, variant]) => (
                <button
                  key={id}
                  className={`pc-variant ${activeVariant === id ? 'on' : ''}`}
                  onClick={() => setPetVariant(id)}
                  style={{ '--frog-filter': variant.filter, '--frog-glow': variant.glow }}
                >
                  <span className="pc-variant-orb" />
                  <span className="pc-variant-label">{variant.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {showScene && (
          <>
            <p className="pc-label">Fondo (entorno real)</p>
            <div className="pc-bgs">
          {Object.entries(BACKGROUNDS).map(([id, bg]) => {
            const unlocked = bgUnlocked(bg, level);
            return (
              <button key={id} className={`pc-bg ${pet.background === id ? 'on' : ''} ${unlocked ? '' : 'locked'}`}
                disabled={!unlocked} onClick={() => unlocked && setBackground(id)}>
                <div className="pc-bg-scene"><SceneBackground id={id} /></div>
                <span className="pc-bg-label">{bg.label}</span>
                {!unlocked && <span className="pc-lock">🔒 Nv {bg.unlock}</span>}
              </button>
            );
          })}
            </div>
          </>
        )}

        <button className="btn btn-primary modal-submit" style={{ marginTop: 16 }} onClick={onClose}>Listo</button>
      </div>
    </div>
  );
}

import { useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { Avatar } from './Avatar';
import { playSound } from '../sound';
import './ProfileEdit.css';

const EMOJI_CHOICES = ['😄', '🐸', '💪', '🏃', '🧘', '🏋️', '🔥', '⚡', '🦁', '🐆', '🌿', '🥇'];

export default function ProfileEdit({ onClose }) {
  const { user, updateProfile } = useStore();
  const [form, setForm] = useState({
    name: user.name, username: user.username, bio: user.bio, goal: user.goal, avatar: user.avatar,
    privacy: { ...user.privacy },
  });
  const fileRef = useRef(null);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setPriv = (k, v) => setForm(f => ({ ...f, privacy: { ...f.privacy, [k]: v } }));

  function onPhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      // downscale to keep localStorage small
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        const s = 256; c.width = s; c.height = s;
        const ctx = c.getContext('2d');
        const min = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - min) / 2, (img.height - min) / 2, min, min, 0, 0, s, s);
        upd('avatar', c.toDataURL('image/jpeg', 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function save() {
    updateProfile({
      name: form.name.trim() || user.name,
      username: (form.username.trim() || user.username).replace(/\s+/g, '_').toLowerCase(),
      bio: form.bio, goal: form.goal, avatar: form.avatar, privacy: form.privacy,
    });
    playSound('reward');
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal animate-slideUp pe-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h3 className="modal-title">Editar perfil</h3>

        {/* avatar */}
        <div className="pe-avatar-row">
          <Avatar user={{ avatar: form.avatar }} size={80} />
          <div className="pe-avatar-actions">
            <button className="btn btn-primary btn-sm" onClick={() => fileRef.current?.click()}>📷 Subir foto</button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPhoto} />
            <div className="pe-emoji-row">
              {EMOJI_CHOICES.map(e => (
                <button key={e} className={`pe-emoji ${form.avatar === e ? 'on' : ''}`} onClick={() => upd('avatar', e)}>{e}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="pe-field"><span className="label">Nombre visible</span>
          <input className="input" value={form.name} onChange={e => upd('name', e.target.value)} maxLength={24} /></div>
        <div className="pe-field"><span className="label">Nombre de usuario</span>
          <div className="pe-username"><span>@</span><input className="input" value={form.username} onChange={e => upd('username', e.target.value)} maxLength={20} /></div></div>
        <div className="pe-field"><span className="label">Biografía</span>
          <textarea className="input" rows={2} style={{ resize: 'none', fontFamily: 'inherit' }} value={form.bio} onChange={e => upd('bio', e.target.value)} maxLength={80} /></div>
        <div className="pe-field"><span className="label">Objetivo fitness</span>
          <input className="input" value={form.goal} onChange={e => upd('goal', e.target.value)} maxLength={40} /></div>

        <p className="settings-label" style={{ marginTop: 8 }}>Privacidad</p>
        <Toggle label="Mostrar estadísticas públicamente" value={form.privacy.showStats} onChange={v => setPriv('showStats', v)} />
        <Toggle label="Mostrar entrenamientos públicamente" value={form.privacy.showWorkouts} onChange={v => setPriv('showWorkouts', v)} />

        <button className="btn btn-primary modal-submit" style={{ marginTop: 16 }} onClick={save}>Guardar perfil</button>
      </div>
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div className="setting-row">
      <span>{label}</span>
      <button className={`toggle ${value ? 'on' : ''}`} onClick={() => onChange(!value)}><span className="toggle-knob" /></button>
    </div>
  );
}

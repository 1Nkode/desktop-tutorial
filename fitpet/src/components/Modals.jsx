import { useState } from 'react';
import { useStore } from '../store/useStore';
import { playSound } from '../sound';
import './Modals.css';

const workoutTypes = [
  { icon: '🏃', label: 'Running' },
  { icon: '🏋️', label: 'Weight Training' },
  { icon: '🚴', label: 'Cycling' },
  { icon: '🧘', label: 'Yoga' },
  { icon: '🏊', label: 'Swimming' },
  { icon: '⛹️', label: 'Basketball' },
  { icon: '🥊', label: 'Boxing' },
  { icon: '🤸', label: 'HIIT' },
];

const mealTypes = [
  { icon: '🥣', label: 'Breakfast' },
  { icon: '🥗', label: 'Lunch' },
  { icon: '🍽️', label: 'Dinner' },
  { icon: '🍎', label: 'Snack' },
];

function Sheet({ children, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal animate-slideUp" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        {children}
      </div>
    </div>
  );
}

function AddWorkoutModal() {
  const { addWorkout, setShowAddWorkout } = useStore();
  const close = () => setShowAddWorkout(false);
  const [type, setType] = useState('Running');
  const [typeIcon, setTypeIcon] = useState('🏃');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [intensity, setIntensity] = useState('Medium');

  const valid = duration && calories;
  const handleSubmit = () => {
    if (!valid) return;
    addWorkout({ type, icon: typeIcon, duration: +duration, calories: +calories, intensity });
    close();
  };

  return (
    <Sheet onClose={close}>
      <h3 className="modal-title">Log Workout 💪</h3>
      <div style={{ marginBottom: 16 }}>
        <span className="label">Workout Type</span>
        <div className="type-grid">
          {workoutTypes.map(w => (
            <div
              key={w.label}
              className={`type-btn ${type === w.label ? 'selected' : ''}`}
              onClick={() => { setType(w.label); setTypeIcon(w.icon); }}
            >
              <span>{w.icon}</span>
              <span>{w.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="form-row">
        <div style={{ flex: 1 }}>
          <span className="label">Duration (min)</span>
          <input className="input" type="number" placeholder="45" value={duration} onChange={e => setDuration(e.target.value)} />
        </div>
        <div style={{ flex: 1 }}>
          <span className="label">Calories burned</span>
          <input className="input" type="number" placeholder="300" value={calories} onChange={e => setCalories(e.target.value)} />
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <span className="label">Intensity</span>
        <div className="intensity-row">
          {['Low', 'Medium', 'High'].map(lvl => (
            <button key={lvl} className={`intensity-btn ${intensity === lvl ? 'active' : ''}`} onClick={() => setIntensity(lvl)}>{lvl}</button>
          ))}
        </div>
      </div>
      <button className="btn btn-primary modal-submit" disabled={!valid} onClick={handleSubmit}>
        Save Workout (+25 XP)
      </button>
    </Sheet>
  );
}

function AddMealModal() {
  const { addMeal, setShowAddMeal } = useStore();
  const close = () => setShowAddMeal(false);
  const [name, setName] = useState('');
  const [time, setTime] = useState('Breakfast');
  const [timeIcon, setTimeIcon] = useState('🥣');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const valid = name && calories;
  const handleSubmit = () => {
    if (!valid) return;
    addMeal({ name, icon: timeIcon, time, calories: +calories, protein: +protein || 0, carbs: +carbs || 0, fat: +fat || 0 });
    close();
  };

  return (
    <Sheet onClose={close}>
      <h3 className="modal-title">Log Meal 🍽️</h3>
      <div style={{ marginBottom: 16 }}>
        <span className="label">Meal Time</span>
        <div className="type-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {mealTypes.map(m => (
            <div
              key={m.label}
              className={`type-btn ${time === m.label ? 'selected' : ''}`}
              onClick={() => { setTime(m.label); setTimeIcon(m.icon); }}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <span className="label">Meal Name</span>
        <input className="input" placeholder="e.g. Grilled chicken salad" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="form-row">
        <div style={{ flex: 1 }}>
          <span className="label">Calories</span>
          <input className="input" type="number" placeholder="400" value={calories} onChange={e => setCalories(e.target.value)} />
        </div>
        <div style={{ flex: 1 }}>
          <span className="label">Protein (g)</span>
          <input className="input" type="number" placeholder="30" value={protein} onChange={e => setProtein(e.target.value)} />
        </div>
      </div>
      <div className="form-row" style={{ marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <span className="label">Carbs (g)</span>
          <input className="input" type="number" placeholder="40" value={carbs} onChange={e => setCarbs(e.target.value)} />
        </div>
        <div style={{ flex: 1 }}>
          <span className="label">Fat (g)</span>
          <input className="input" type="number" placeholder="15" value={fat} onChange={e => setFat(e.target.value)} />
        </div>
      </div>
      <button className="btn btn-primary modal-submit" disabled={!valid} onClick={handleSubmit}>Save Meal</button>
    </Sheet>
  );
}

function AddWaterModal() {
  const { stats, addWater, setShowAddWater } = useStore();
  const close = () => setShowAddWater(false);
  return (
    <Sheet onClose={close}>
      <h3 className="modal-title">Hydration 💧</h3>
      <p className="water-count">{stats.water} / {stats.waterGoal} <span>glasses today</span></p>
      <div className="water-glasses">
        {Array.from({ length: stats.waterGoal }).map((_, i) => (
          <span key={i} className="water-glass">{i < stats.water ? '💧' : '🥛'}</span>
        ))}
      </div>
      <div className="water-controls">
        <button className="btn btn-outline" onClick={() => addWater(-1)}>− Remove</button>
        <button className="btn btn-primary" onClick={() => addWater(1)}>+ Add glass</button>
      </div>
      <button className="btn btn-primary modal-submit" style={{ marginTop: 16 }} onClick={close}>Done</button>
    </Sheet>
  );
}

function AddPostModal() {
  const { addPost, setShowAddPost, workoutHistory, personalRecords, stats } = useStore();
  const close = () => setShowAddPost(false);
  const [type, setType] = useState('workout');
  const [content, setContent] = useState('');
  const [calories, setCalories] = useState('');
  const [photo, setPhoto] = useState(null);   // real user photo as data URL

  const onPickPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const valid = content.trim().length > 0;
  const handleSubmit = () => {
    if (!valid) return;
    addPost({
      type,
      content: content.trim(),
      calories: calories ? +calories : undefined,
      image: photo || null,
    });
    playSound('celebrate');
    close();
  };

  const types = [
    { id: 'workout', label: '💪 Entreno' },
    { id: 'meal', label: '🍽️ Comida' },
    { id: 'pr', label: '🏆 PR' },
    { id: 'progress', label: '📸 Progreso' },
  ];

  // Quick auto-share from real training data
  const lastWorkout = workoutHistory[0];
  const quickShares = [];
  if (lastWorkout) quickShares.push({
    label: `💪 Último entreno · ${(lastWorkout.volume / 1000).toFixed(1)}t`,
    apply: () => { setType('workout'); setContent(`Terminé "${lastWorkout.name}" 💪 ${lastWorkout.sets} series · ${(lastWorkout.volume / 1000).toFixed(1)}t levantadas #Hevy`); },
  });
  const prKey = Object.keys(personalRecords)[0];
  if (prKey) quickShares.push({
    label: '🏆 Mi último PR',
    apply: () => { const pr = personalRecords[prKey]; setType('pr'); setContent(`¡Nuevo récord personal! ${pr.weight}kg × ${pr.reps} reps 🏆 #PR`); },
  });
  quickShares.push({
    label: `📊 Stats semana`,
    apply: () => { setType('achievement'); setContent(`Esta semana: ${stats.weeklyWorkouts.filter(v => v > 0).length} entrenos · ${stats.caloriesBurned} kcal quemadas 🔥 #consistencia`); },
  });

  return (
    <Sheet onClose={close}>
      <h3 className="modal-title">Nueva publicación 📸</h3>

      <div style={{ marginBottom: 14 }}>
        <span className="label">Compartir rápido</span>
        <div className="ig-quick">
          {quickShares.map((q, i) => (
            <button key={i} className="ig-quick-btn" onClick={q.apply}>{q.label}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <span className="label">Tipo</span>
        <div className="intensity-row" style={{ flexWrap: 'wrap' }}>
          {types.map(t => (
            <button key={t.id} className={`intensity-btn ${type === t.id ? 'active' : ''}`} onClick={() => setType(t.id)}>{t.label}</button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <span className="label">¿Qué quieres compartir?</span>
        <textarea
          className="input"
          rows={3}
          style={{ resize: 'none', fontFamily: 'inherit' }}
          placeholder="Comparte tu progreso con la comunidad…"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: 14 }}>
        <span className="label">📷 Foto (opcional)</span>
        {photo ? (
          <div style={{ position: 'relative' }}>
            <img src={photo} alt="" style={{ width: '100%', borderRadius: 12, display: 'block', aspectRatio: '1/1', objectFit: 'cover' }} />
            <button className="btn btn-sm" style={{ position: 'absolute', top: 8, right: 8 }} onClick={() => setPhoto(null)}>Quitar</button>
          </div>
        ) : (
          <label className="btn btn-outline" style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
            Elegir foto de tu dispositivo
            <input type="file" accept="image/*" hidden onChange={onPickPhoto} />
          </label>
        )}
      </div>
      {(type === 'workout' || type === 'meal') && (
        <div style={{ marginBottom: 20 }}>
          <span className="label">Calorías (opcional)</span>
          <input className="input" type="number" placeholder="320" value={calories} onChange={e => setCalories(e.target.value)} />
        </div>
      )}
      <button className="btn btn-primary modal-submit" disabled={!valid} onClick={handleSubmit}>Publicar</button>
    </Sheet>
  );
}

function NotificationsPanel() {
  const { notifications, setShowNotifications, markNotificationsRead } = useStore();
  const close = () => { markNotificationsRead(); setShowNotifications(false); };
  return (
    <Sheet onClose={close}>
      <div className="panel-head">
        <h3 className="modal-title" style={{ marginBottom: 0 }}>Notifications 🔔</h3>
        <button className="link-btn" onClick={markNotificationsRead}>Mark all read</button>
      </div>
      <div className="notif-list">
        {notifications.map(n => (
          <div key={n.id} className={`notif-item ${n.read ? '' : 'unread'}`}>
            <span className="notif-icon">{n.icon}</span>
            <div className="notif-body">
              <p className="notif-text">{n.text}</p>
              <p className="notif-time">{n.time}</p>
            </div>
            {!n.read && <span className="notif-dot" />}
          </div>
        ))}
      </div>
      <button className="btn btn-primary modal-submit" style={{ marginTop: 8 }} onClick={close}>Close</button>
    </Sheet>
  );
}

function SettingsPanel() {
  const { settings, stats, user, updateSetting, updateGoal, resetApp, setShowSettings } = useStore();
  const close = () => setShowSettings(false);

  return (
    <Sheet onClose={close}>
      <h3 className="modal-title">Settings ⚙️</h3>

      <div className="settings-section">
        <span className="settings-label">Profile</span>
        <div className="setting-row">
          <span>Name</span>
          <input
            className="input setting-input"
            value={user.name}
            onChange={e => useStore.setState(s => ({ user: { ...s.user, name: e.target.value } }))}
          />
        </div>
      </div>

      <div className="settings-section">
        <span className="settings-label">Objetivos diarios</span>
        <div className="setting-row">
          <span>Calorías objetivo</span>
          <input className="input setting-input" type="number" inputMode="numeric" value={stats.caloriesGoal} onChange={e => updateGoal('caloriesGoal', e.target.value)} />
        </div>
        <div className="setting-row">
          <span>Proteínas (g)</span>
          <input className="input setting-input" type="number" inputMode="numeric" value={stats.proteinGoal} onChange={e => updateGoal('proteinGoal', e.target.value)} />
        </div>
        <div className="setting-row">
          <span>Carbohidratos (g)</span>
          <input className="input setting-input" type="number" inputMode="numeric" value={stats.carbsGoal} onChange={e => updateGoal('carbsGoal', e.target.value)} />
        </div>
        <div className="setting-row">
          <span>Grasas (g)</span>
          <input className="input setting-input" type="number" inputMode="numeric" value={stats.fatGoal} onChange={e => updateGoal('fatGoal', e.target.value)} />
        </div>
        <div className="setting-row">
          <span>Pasos objetivo</span>
          <input className="input setting-input" type="number" inputMode="numeric" value={stats.stepsGoal} onChange={e => updateGoal('stepsGoal', e.target.value)} />
        </div>
        <div className="setting-row">
          <span>Minutos activos</span>
          <input className="input setting-input" type="number" inputMode="numeric" value={stats.activeGoal} onChange={e => updateGoal('activeGoal', e.target.value)} />
        </div>
        <div className="setting-row">
          <span>Agua (vasos)</span>
          <input className="input setting-input" type="number" inputMode="numeric" value={stats.waterGoal} onChange={e => updateGoal('waterGoal', e.target.value)} />
        </div>
      </div>

      <div className="settings-section">
        <span className="settings-label">Peso y ritmo</span>
        <div className="setting-row">
          <span>Peso actual (kg)</span>
          <input className="input setting-input" type="number" inputMode="decimal" value={stats.weight} onChange={e => updateGoal('weight', e.target.value)} />
        </div>
        <div className="setting-row">
          <span>Peso objetivo (kg)</span>
          <input className="input setting-input" type="number" inputMode="decimal" value={stats.weightGoal} onChange={e => updateGoal('weightGoal', e.target.value)} />
        </div>
        <div className="setting-row">
          <span>Objetivo</span>
          <div className="seg">
            {[['lose', 'Perder'], ['maintain', 'Mantener'], ['gain', 'Ganar']].map(([id, label]) => (
              <button key={id} className={`seg-btn ${stats.goalMode === id ? 'active' : ''}`} onClick={() => updateGoal('goalMode', id)}>{label}</button>
            ))}
          </div>
        </div>
        <div className="setting-row">
          <span>Ritmo (kg/semana)</span>
          <input className="input setting-input" type="number" inputMode="decimal" step="0.1" value={stats.weeklyRate} onChange={e => updateGoal('weeklyRate', e.target.value)} />
        </div>
      </div>

      <div className="settings-section">
        <span className="settings-label">Preferences</span>
        <Toggle label="Push notifications" value={settings.notificationsEnabled} onChange={v => updateSetting('notificationsEnabled', v)} />
        <Toggle label="Auto-sync wearables" value={settings.autoSync} onChange={v => updateSetting('autoSync', v)} />
        <Toggle label="Sonidos de la mascota" value={settings.sound !== false} onChange={v => updateSetting('sound', v)} />
        <Toggle label="Auto-publicar entrenos" value={settings.autoShareWorkout !== false} onChange={v => updateSetting('autoShareWorkout', v)} />
        <div className="setting-row">
          <span>Units</span>
          <div className="seg">
            {['metric', 'imperial'].map(u => (
              <button key={u} className={`seg-btn ${settings.units === u ? 'active' : ''}`} onClick={() => updateSetting('units', u)}>{u}</button>
            ))}
          </div>
        </div>
      </div>

      <button
        className="btn btn-outline modal-submit reset-btn"
        onClick={() => { if (confirm('Reset all FitPet data to defaults?')) { resetApp(); close(); } }}
      >
        Reset all data
      </button>
      <button className="btn btn-primary modal-submit" style={{ marginTop: 10 }} onClick={close}>Done</button>
    </Sheet>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div className="setting-row">
      <span>{label}</span>
      <button className={`toggle ${value ? 'on' : ''}`} onClick={() => onChange(!value)}>
        <span className="toggle-knob" />
      </button>
    </div>
  );
}

function WorkoutShareSheet() {
  const { pendingShare, shareWorkout, discardPendingShare, pet } = useStore();
  const s = pendingShare;
  const [caption, setCaption] = useState(`Completé ${s.name} 💪`);
  const [photo, setPhoto] = useState(null);

  const onPickPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const publish = () => {
    shareWorkout(caption, photo || null);
    playSound('celebrate');
  };

  return (
    <div className="modal-overlay" onClick={discardPendingShare}>
      <div className="modal animate-slideUp" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h3 className="modal-title">¡Entreno completado! 🎉</h3>

        {/* preview card */}
        <div className="ws-card">
          <div className="ws-row">
            <div className="ws-m"><b>{s.durationMin}m</b><span>Duración</span></div>
            <div className="ws-m"><b>{(s.volume / 1000).toFixed(1)}t</b><span>Volumen</span></div>
            <div className="ws-m"><b>{s.sets}</b><span>Series</span></div>
            <div className="ws-m"><b>🐸{pet.level}</b><span>Rana</span></div>
          </div>
          {s.prs?.length > 0 && (
            <div className="ws-prs">{s.prs.map((p, i) => <span key={i} className="wl-pr">🏆 {p.name} {p.weight}kg×{p.reps}</span>)}</div>
          )}
          <div className="ws-ex">
            {s.exercises.map((e, i) => <p key={i} className="ws-ex-line">{e.icon} {e.sets.length}× {e.name}</p>)}
          </div>
        </div>

        <div style={{ margin: '14px 0' }}>
          <span className="label">Descripción</span>
          <textarea className="input" rows={2} style={{ resize: 'none', fontFamily: 'inherit' }}
            value={caption} onChange={e => setCaption(e.target.value)} />
        </div>
        <div style={{ padding: '0 0 14px' }}>
          {photo ? (
            <div style={{ position: 'relative' }}>
              <img src={photo} alt="" style={{ width: '100%', borderRadius: 12, display: 'block', maxHeight: 220, objectFit: 'cover' }} />
              <button className="btn btn-sm" style={{ position: 'absolute', top: 8, right: 8 }} onClick={() => setPhoto(null)}>Quitar</button>
            </div>
          ) : (
            <label className="btn btn-outline" style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
              📷 Añadir foto (opcional)
              <input type="file" accept="image/*" hidden onChange={onPickPhoto} />
            </label>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={discardPendingShare}>Ahora no</button>
          <button className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={publish}>Compartir con amigos</button>
        </div>
      </div>
    </div>
  );
}

// Renders whichever modal/panel is currently open (driven by store flags).
export default function Modals() {
  const { showAddWorkout, showAddMeal, showAddWater, showAddPost, showNotifications, showSettings, pendingShare } = useStore();
  return (
    <>
      {showAddWorkout && <AddWorkoutModal />}
      {showAddMeal && <AddMealModal />}
      {showAddWater && <AddWaterModal />}
      {showAddPost && <AddPostModal />}
      {showNotifications && <NotificationsPanel />}
      {showSettings && <SettingsPanel />}
      {pendingShare && <WorkoutShareSheet />}
    </>
  );
}

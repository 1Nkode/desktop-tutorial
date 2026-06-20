import { useState } from 'react';
import { useStore } from '../store/useStore';
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
  const { addPost, setShowAddPost } = useStore();
  const close = () => setShowAddPost(false);
  const [type, setType] = useState('workout');
  const [content, setContent] = useState('');
  const [calories, setCalories] = useState('');

  const valid = content.trim().length > 0;
  const handleSubmit = () => {
    if (!valid) return;
    addPost({ type, content: content.trim(), calories: calories ? +calories : undefined });
    close();
  };

  const types = [
    { id: 'workout', label: '💪 Workout' },
    { id: 'meal', label: '🍽️ Meal' },
    { id: 'achievement', label: '🏆 Achievement' },
  ];

  return (
    <Sheet onClose={close}>
      <h3 className="modal-title">New Post 📸</h3>
      <div style={{ marginBottom: 14 }}>
        <span className="label">Post Type</span>
        <div className="intensity-row">
          {types.map(t => (
            <button key={t.id} className={`intensity-btn ${type === t.id ? 'active' : ''}`} onClick={() => setType(t.id)}>{t.label}</button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <span className="label">What's on your mind?</span>
        <textarea
          className="input"
          rows={3}
          style={{ resize: 'none', fontFamily: 'inherit' }}
          placeholder="Share your progress with the community..."
          value={content}
          onChange={e => setContent(e.target.value)}
        />
      </div>
      {type !== 'achievement' && (
        <div style={{ marginBottom: 20 }}>
          <span className="label">Calories (optional)</span>
          <input className="input" type="number" placeholder="320" value={calories} onChange={e => setCalories(e.target.value)} />
        </div>
      )}
      <button className="btn btn-primary modal-submit" disabled={!valid} onClick={handleSubmit}>Share Post</button>
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
        <span className="settings-label">Daily Goals</span>
        <div className="setting-row">
          <span>Calorie goal</span>
          <input className="input setting-input" type="number" value={stats.caloriesGoal} onChange={e => updateGoal('caloriesGoal', e.target.value)} />
        </div>
        <div className="setting-row">
          <span>Steps goal</span>
          <input className="input setting-input" type="number" value={stats.stepsGoal} onChange={e => updateGoal('stepsGoal', e.target.value)} />
        </div>
        <div className="setting-row">
          <span>Active minutes goal</span>
          <input className="input setting-input" type="number" value={stats.activeGoal} onChange={e => updateGoal('activeGoal', e.target.value)} />
        </div>
        <div className="setting-row">
          <span>Water goal (glasses)</span>
          <input className="input setting-input" type="number" value={stats.waterGoal} onChange={e => updateGoal('waterGoal', e.target.value)} />
        </div>
      </div>

      <div className="settings-section">
        <span className="settings-label">Preferences</span>
        <Toggle label="Push notifications" value={settings.notificationsEnabled} onChange={v => updateSetting('notificationsEnabled', v)} />
        <Toggle label="Auto-sync wearables" value={settings.autoSync} onChange={v => updateSetting('autoSync', v)} />
        <Toggle label="Sonidos de la mascota" value={settings.sound !== false} onChange={v => updateSetting('sound', v)} />
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

// Renders whichever modal/panel is currently open (driven by store flags).
export default function Modals() {
  const { showAddWorkout, showAddMeal, showAddWater, showAddPost, showNotifications, showSettings } = useStore();
  return (
    <>
      {showAddWorkout && <AddWorkoutModal />}
      {showAddMeal && <AddMealModal />}
      {showAddWater && <AddWaterModal />}
      {showAddPost && <AddPostModal />}
      {showNotifications && <NotificationsPanel />}
      {showSettings && <SettingsPanel />}
    </>
  );
}

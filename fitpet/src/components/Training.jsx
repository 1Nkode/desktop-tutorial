import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { EXERCISES, MUSCLES, e1rm } from '../data/exercises';
import { playSound } from '../sound';
import './Training.css';

const fmtDate = (ts) => new Date(ts).toLocaleDateString('es', { day: 'numeric', month: 'short' });
function prevFor(history, name) {
  for (const s of history) { const ex = s.exercises.find(e => e.name === name); if (ex) return ex.sets; }
  return [];
}

export default function Training() {
  const active = useStore(s => s.activeWorkout);
  return active ? <ActiveSession /> : <TrainingHome />;
}

/* ---------------- HOME: routines + stats + history ---------------- */
function TrainingHome() {
  const { routines, workoutHistory, startWorkout, duplicateRoutine, deleteRoutine } = useStore();
  const [builder, setBuilder] = useState(false);

  const weekAgo = Date.now() - 7 * 864e5;
  const weekSessions = workoutHistory.filter(s => s.date >= weekAgo);
  const weekVolume = weekSessions.reduce((a, s) => a + s.volume, 0);

  return (
    <div className="tr-home">
      {/* quick stats */}
      <div className="tr-stats">
        <div className="tr-stat"><span className="tr-stat-v">{weekSessions.length}</span><span className="tr-stat-l">esta semana</span></div>
        <div className="tr-stat"><span className="tr-stat-v">{(weekVolume / 1000).toFixed(1)}t</span><span className="tr-stat-l">volumen 7d</span></div>
        <div className="tr-stat"><span className="tr-stat-v">{workoutHistory.length}</span><span className="tr-stat-l">total sesiones</span></div>
      </div>

      <button className="tr-start-empty" onClick={() => startWorkout(null)}>
        <span className="material-symbols-outlined">add</span> Empezar entrenamiento vacío
      </button>

      <div className="section-header" style={{ marginTop: 18 }}>
        <span className="section-title">Mis rutinas</span>
        <button className="see-all" onClick={() => setBuilder(true)}>+ Nueva</button>
      </div>

      <div className="tr-routines">
        {routines.map(r => (
          <div className="tr-routine" key={r.id}>
            <div className="tr-routine-main" onClick={() => startWorkout(r)}>
              <p className="tr-routine-name">{r.name}</p>
              <p className="tr-routine-sub">{r.items.length} ejercicios</p>
              <p className="tr-routine-ex">{r.items.map(it => (EXERCISES.find(e => e.id === it.exerciseId)?.name || '')).filter(Boolean).slice(0, 3).join(' · ')}{r.items.length > 3 ? '…' : ''}</p>
            </div>
            <div className="tr-routine-actions">
              <button className="tr-play" onClick={() => startWorkout(r)} title="Empezar"><span className="material-symbols-outlined">play_arrow</span></button>
              <button className="tr-mini" onClick={() => duplicateRoutine(r.id)} title="Duplicar"><span className="material-symbols-outlined">content_copy</span></button>
              <button className="tr-mini" onClick={() => deleteRoutine(r.id)} title="Eliminar"><span className="material-symbols-outlined">delete</span></button>
            </div>
          </div>
        ))}
      </div>

      {workoutHistory.length > 0 && (
        <>
          <div className="section-header" style={{ marginTop: 18 }}><span className="section-title">Historial</span></div>
          <div className="tr-history">
            {workoutHistory.slice(0, 8).map(s => (
              <div className="tr-hist" key={s.id}>
                <div className="tr-hist-top">
                  <span className="tr-hist-name">{s.name}</span>
                  <span className="tr-hist-date">{fmtDate(s.date)}</span>
                </div>
                <div className="tr-hist-stats">
                  <span>🏋️ {(s.volume / 1000).toFixed(1)}t</span>
                  <span>📋 {s.sets} series</span>
                  <span>⏱ {s.durationMin}m</span>
                  <span>💪 {s.exercises.length} ej.</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ height: 110 }} />
      {builder && <RoutineBuilder onClose={() => setBuilder(false)} />}
    </div>
  );
}

/* ---------------- ACTIVE SESSION ---------------- */
function ActiveSession() {
  const {
    activeWorkout: w, workoutHistory, personalRecords,
    updateSet, toggleSetDone, addSet, removeSet, addExerciseToWorkout,
    setExerciseNote, setWorkoutNote, moveExercise, removeExerciseFromWorkout,
    finishWorkout, cancelWorkout,
  } = useStore();

  const [elapsed, setElapsed] = useState(0);
  const [picker, setPicker] = useState(false);
  const [rest, setRest] = useState(0);
  const [restTotal, setRestTotal] = useState(90);
  const restRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.round((Date.now() - w.startedAt) / 1000)), 1000);
    return () => clearInterval(t);
  }, [w.startedAt]);

  // rest timer
  useEffect(() => {
    if (rest <= 0) return;
    restRef.current = setInterval(() => {
      setRest(r => {
        if (r <= 1) { clearInterval(restRef.current); playSound('celebrate'); notify(); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(restRef.current);
  }, [rest > 0]);

  function notify() {
    try { if ('Notification' in window && Notification.permission === 'granted') new Notification('FitPet', { body: '¡Descanso terminado! 💪' }); } catch {}
  }
  function startRest(sec = 90) { setRestTotal(sec); setRest(sec); if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission(); }

  function onToggle(ei, si) {
    const wasDone = w.exercises[ei].sets[si].done;
    toggleSetDone(ei, si);
    if (!wasDone) { playSound('tap'); startRest(90); }
  }

  const totalVol = w.exercises.reduce((a, e) => a + e.sets.reduce((b, s) => b + (s.done ? (+s.weight || 0) * (+s.reps || 0) : 0), 0), 0);
  const doneSets = w.exercises.reduce((a, e) => a + e.sets.filter(s => s.done).length, 0);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  return (
    <div className="tr-session">
      <div className="tr-session-head">
        <div>
          <p className="tr-session-name">{w.name}</p>
          <p className="tr-session-time">⏱ {mm}:{ss} · 🏋️ {(totalVol / 1000).toFixed(1)}t · {doneSets} series</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => finishWorkout()}>Terminar</button>
      </div>

      {w.exercises.map((ex, ei) => {
        const prev = prevFor(workoutHistory, ex.name);
        const pr = personalRecords[ex.exerciseId];
        return (
          <div className="card tr-ex" key={ei}>
            <div className="tr-ex-head">
              <span className="tr-ex-icon">{ex.icon}</span>
              <div className="tr-ex-titles">
                <p className="tr-ex-name">{ex.name}</p>
                <p className="tr-ex-muscle">{ex.muscle}{pr ? ` · 🏆 PR ${pr.weight}kg×${pr.reps}` : ''}</p>
              </div>
              <div className="tr-ex-menu">
                <button className="tr-mini" onClick={() => moveExercise(ei, -1)}><span className="material-symbols-outlined">keyboard_arrow_up</span></button>
                <button className="tr-mini" onClick={() => moveExercise(ei, 1)}><span className="material-symbols-outlined">keyboard_arrow_down</span></button>
                <button className="tr-mini" onClick={() => removeExerciseFromWorkout(ei)}><span className="material-symbols-outlined">close</span></button>
              </div>
            </div>

            <input className="tr-ex-note" placeholder="Nota del ejercicio…" value={ex.note} onChange={e => setExerciseNote(ei, e.target.value)} />

            <div className="tr-set-headrow">
              <span>SERIE</span><span>ANTERIOR</span><span>KG</span><span>REPS</span><span>✓</span>
            </div>
            {ex.sets.map((s, si) => {
              const p = prev[si];
              const isPR = pr && (+s.weight || 0) > 0 && e1rm(+s.weight, +s.reps) > (pr.e1rm - 0.01) && s.done;
              return (
                <div className={`tr-set ${s.done ? 'done' : ''}`} key={si}>
                  <button className="tr-set-num" onClick={() => removeSet(ei, si)} title="Mantener para quitar">{si + 1}</button>
                  <span className="tr-set-prev">{p ? `${p.weight}×${p.reps}` : '—'}</span>
                  <input className="tr-set-in" type="number" inputMode="decimal" placeholder={p ? p.weight : '0'} value={s.weight} onChange={e => updateSet(ei, si, 'weight', e.target.value)} />
                  <input className="tr-set-in" type="number" inputMode="numeric" placeholder={p ? p.reps : '0'} value={s.reps} onChange={e => updateSet(ei, si, 'reps', e.target.value)} />
                  <button className={`tr-set-check ${s.done ? 'on' : ''}`} onClick={() => onToggle(ei, si)}>
                    {isPR ? '🏆' : '✓'}
                  </button>
                </div>
              );
            })}
            <button className="tr-add-set" onClick={() => addSet(ei)}>＋ Añadir serie</button>
          </div>
        );
      })}

      <button className="tr-add-ex" onClick={() => setPicker(true)}>＋ Añadir ejercicio</button>

      <textarea className="tr-wnote input" rows={2} placeholder="Notas del entrenamiento…" value={w.note} onChange={e => setWorkoutNote(e.target.value)} />

      <button className="tr-cancel" onClick={() => { if (confirm('¿Descartar este entrenamiento?')) cancelWorkout(); }}>Descartar entrenamiento</button>

      <div style={{ height: 120 }} />

      {/* rest timer bar */}
      {rest > 0 && (
        <div className="tr-rest">
          <div className="tr-rest-bar" style={{ width: `${(rest / restTotal) * 100}%` }} />
          <div className="tr-rest-row">
            <span className="material-symbols-outlined">timer</span>
            <span className="tr-rest-time">{Math.floor(rest / 60)}:{String(rest % 60).padStart(2, '0')}</span>
            <button onClick={() => setRest(r => Math.max(1, r - 15))}>−15</button>
            <button onClick={() => setRest(r => r + 15)}>+15</button>
            <button className="tr-rest-skip" onClick={() => setRest(0)}>Omitir</button>
          </div>
        </div>
      )}

      {picker && <ExercisePicker onPick={(ex) => { addExerciseToWorkout(ex); setPicker(false); }} onClose={() => setPicker(false)} />}
    </div>
  );
}

/* ---------------- EXERCISE PICKER ---------------- */
function ExercisePicker({ onPick, onClose, multi = false, selected = [], onToggle }) {
  const { customExercises, addCustomExercise } = useStore();
  const [q, setQ] = useState('');
  const [muscle, setMuscle] = useState('Todos');
  const [creating, setCreating] = useState(false);
  const all = [...customExercises, ...EXERCISES];
  const list = all.filter(e =>
    (muscle === 'Todos' || e.muscle === muscle) &&
    (!q.trim() || e.name.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal animate-slideUp fs-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="fs-searchbar">
          <span className="material-symbols-outlined">search</span>
          <input className="fs-input" placeholder="Buscar ejercicio…" value={q} onChange={e => setQ(e.target.value)} autoFocus />
        </div>
        <div className="tr-muscle-row">
          {['Todos', ...MUSCLES].map(m => (
            <button key={m} className={`tr-muscle ${muscle === m ? 'active' : ''}`} onClick={() => setMuscle(m)}>{m}</button>
          ))}
        </div>
        <button className="fs-create" onClick={() => setCreating(true)}>＋ Crear ejercicio</button>
        {creating && <CreateExercise onClose={() => setCreating(false)} onSave={(ex) => { addCustomExercise(ex); setCreating(false); }} />}
        <div className="fs-list">
          {list.map(ex => {
            const on = selected.includes(ex.id);
            return (
              <div key={ex.id} className={`fs-row ${on ? 'sel' : ''}`} onClick={() => multi ? onToggle(ex) : onPick(ex)}>
                <span className="fs-row-icon">{ex.icon}</span>
                <div className="fs-row-info">
                  <p className="fs-row-name">{ex.name}</p>
                  <p className="fs-row-sub">{ex.muscle}{ex.custom ? ' · propio' : ''}</p>
                </div>
                {multi && <span className={`tr-check ${on ? 'on' : ''}`}>{on ? '✓' : '+'}</span>}
              </div>
            );
          })}
        </div>
        {multi && <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }} onClick={onClose}>Listo ({selected.length})</button>}
      </div>
    </div>
  );
}

function CreateExercise({ onSave, onClose }) {
  const [name, setName] = useState('');
  const [muscle, setMuscle] = useState('Pecho');
  return (
    <div className="tr-create-ex">
      <input className="input" placeholder="Nombre del ejercicio" value={name} onChange={e => setName(e.target.value)} />
      <select className="select" value={muscle} onChange={e => setMuscle(e.target.value)} style={{ marginTop: 8 }}>
        {MUSCLES.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={!name.trim()} onClick={() => onSave({ name: name.trim(), muscle, icon: '🏋️' })}>Guardar</button>
      </div>
    </div>
  );
}

/* ---------------- ROUTINE BUILDER ---------------- */
function RoutineBuilder({ onClose }) {
  const { saveRoutine } = useStore();
  const [name, setName] = useState('');
  const [picked, setPicked] = useState([]);   // exercise ids
  const [showPick, setShowPick] = useState(false);

  function toggle(ex) {
    setPicked(p => p.includes(ex.id) ? p.filter(x => x !== ex.id) : [...p, ex.id]);
  }
  function save() {
    saveRoutine({ name: name.trim() || 'Rutina', items: picked.map(id => ({ exerciseId: id, sets: 3 })) });
    onClose();
  }

  if (showPick) return <ExercisePicker multi selected={picked} onToggle={toggle} onClose={() => setShowPick(false)} />;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal animate-slideUp" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h3 className="modal-title">Nueva rutina 📋</h3>
        <input className="input" placeholder="Nombre (ej. Push)" value={name} onChange={e => setName(e.target.value)} />
        <button className="fs-create" style={{ marginTop: 12 }} onClick={() => setShowPick(true)}>＋ Añadir ejercicios ({picked.length})</button>
        <div className="tr-picked">
          {picked.map(id => { const ex = EXERCISES.find(e => e.id === id); return <span key={id} className="tr-chip">{ex?.icon} {ex?.name}</span>; })}
        </div>
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }} disabled={!picked.length} onClick={save}>Guardar rutina</button>
      </div>
    </div>
  );
}

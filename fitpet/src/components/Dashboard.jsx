import { useState } from 'react';
import { useStore } from '../store/useStore';
import { WIDGET_COMPONENTS } from './Widgets';
import { WIDGET_META, ALL_WIDGETS, PRESET_INFO } from '../data/dashboard';
import './Dashboard.css';

export default function Dashboard() {
  const {
    user, stats, dashboardLayout, dashboardTemplates,
    addDashWidget, removeDashWidget, moveDashWidget, resizeDashWidget,
    applyDashPreset, saveDashTemplate, applyDashTemplate, deleteDashTemplate,
    updateGoal, setActiveTab,
  } = useStore();
  const [edit, setEdit] = useState(false);
  const [adding, setAdding] = useState(false);
  const [tpl, setTpl] = useState(false);

  const used = dashboardLayout.map(w => w.id);
  const available = ALL_WIDGETS.filter(id => !used.includes(id));

  return (
    <div className="dashboard animate-fadeIn">
      <div className="dash-greeting">
        <div>
          <p className="greeting">Hola de nuevo 👋</p>
          <h1 className="username">{user.name}</h1>
        </div>
        <div className="dash-head-actions">
          <button className="dash-tpl-btn" onClick={() => setTpl(t => !t)}><span className="material-symbols-outlined">dashboard_customize</span></button>
          <button className={`dash-edit-btn ${edit ? 'on' : ''}`} onClick={() => { setEdit(e => !e); setAdding(false); }}>
            {edit ? 'Listo' : 'Editar'}
          </button>
        </div>
      </div>

      {/* template / preset menu */}
      {tpl && (
        <div className="card dash-tpl">
          <p className="dash-tpl-label">Plantillas por objetivo</p>
          <div className="dash-presets">
            {PRESET_INFO.map(p => (
              <button key={p.id} className="dash-preset" onClick={() => { applyDashPreset(p.id); setTpl(false); }}>
                <span>{p.icon}</span>{p.label}
              </button>
            ))}
          </div>
          {Object.keys(dashboardTemplates).length > 0 && (
            <>
              <p className="dash-tpl-label" style={{ marginTop: 12 }}>Mis plantillas</p>
              <div className="dash-presets">
                {Object.keys(dashboardTemplates).map(name => (
                  <span key={name} className="dash-mine">
                    <button className="dash-preset" onClick={() => { applyDashTemplate(name); setTpl(false); }}>💾 {name}</button>
                    <button className="dash-del" onClick={() => deleteDashTemplate(name)}>✕</button>
                  </span>
                ))}
              </div>
            </>
          )}
          <button className="dash-save" onClick={() => { const n = prompt('Nombre de la plantilla:'); if (n?.trim()) saveDashTemplate(n.trim()); }}>
            💾 Guardar layout actual
          </button>
        </div>
      )}

      {/* widget grid */}
      <div className="dash-grid">
        {dashboardLayout.map((w, i) => {
          const meta = WIDGET_META[w.id];
          const Comp = WIDGET_COMPONENTS[w.id];
          if (!meta || !Comp) return null;
          return (
            <div key={w.id} className={`dash-cell card ${w.size === 'full' ? 'full' : ''} ${edit ? 'editing' : ''}`}>
              {edit && (
                <div className="dash-ctrl">
                  <span className="dash-ctrl-title">{meta.icon} {meta.label}</span>
                  <div className="dash-ctrl-btns">
                    <button onClick={() => moveDashWidget(i, -1)} title="Subir"><span className="material-symbols-outlined">keyboard_arrow_up</span></button>
                    <button onClick={() => moveDashWidget(i, 1)} title="Bajar"><span className="material-symbols-outlined">keyboard_arrow_down</span></button>
                    <button onClick={() => resizeDashWidget(w.id)} title="Tamaño"><span className="material-symbols-outlined">aspect_ratio</span></button>
                    <button onClick={() => removeDashWidget(w.id)} title="Quitar"><span className="material-symbols-outlined">close</span></button>
                  </div>
                </div>
              )}
              <Comp />
              {edit && meta.goalKey && (
                <div className="dash-goal">
                  <span>Meta</span>
                  <input className="dash-goal-in" type="number" value={stats[meta.goalKey]}
                    onChange={e => updateGoal(meta.goalKey, e.target.value)} onClick={e => e.stopPropagation()} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* add widget */}
      {edit && (
        <div className="dash-add-zone">
          <button className="dash-add" onClick={() => setAdding(a => !a)}>＋ Añadir widget</button>
          {adding && (
            <div className="dash-add-grid">
              {available.length === 0 && <p className="wg-sub">Ya tienes todos los widgets ✓</p>}
              {available.map(id => (
                <button key={id} className="dash-add-item" onClick={() => addDashWidget(id)}>
                  <span>{WIDGET_META[id].icon}</span> {WIDGET_META[id].label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ height: 110 }} />
    </div>
  );
}

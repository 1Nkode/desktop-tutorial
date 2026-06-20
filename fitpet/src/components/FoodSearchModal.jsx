import { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { FOODS, MEAL_TYPES, scaleFood } from '../data/foods';
import BarcodeScanner from './BarcodeScanner';
import './FoodSearchModal.css';

/*
  FoodSearchModal — MyFitnessPal-style food picker.
  Tabs: Buscar (DB) · Favoritos · Mis alimentos · Recetas. Plus barcode scan
  and "crear alimento / receta". Select a food → set servings → confirm →
  logged to the diary under the chosen meal type.
*/
export default function FoodSearchModal({ mealType = 'Snack', onClose }) {
  const { favorites, customFoods, recipes, addFoodToDiary, toggleFavorite, addCustomFood, addRecipe } = useStore();
  const [tab, setTab] = useState('search');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState(null);     // food being added
  const [servings, setServings] = useState(1);
  const [meal, setMeal] = useState(mealType);
  const [scan, setScan] = useState(false);
  const [creating, setCreating] = useState(null);     // 'food' | 'recipe' | null

  const results = useMemo(() => {
    const base = tab === 'favorites' ? favorites : tab === 'custom' ? customFoods : tab === 'recipes' ? recipes : FOODS;
    if (!q.trim()) return base;
    const term = q.toLowerCase();
    return base.filter(f => f.name.toLowerCase().includes(term));
  }, [tab, q, favorites, customFoods, recipes]);

  const isFav = (food) => favorites.some(f => f.id === food.id);

  function confirmAdd() {
    const scaled = scaleFood(selected, servings);
    addFoodToDiary({
      name: servings !== 1 ? `${selected.name} ×${servings}` : selected.name,
      icon: selected.icon, mealType: meal, servings: Number(servings), ...scaled,
    });
    onClose();
  }

  // --- quantity editor view ---
  if (selected) {
    const scaled = scaleFood(selected, servings);
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal animate-slideUp" onClick={e => e.stopPropagation()}>
          <div className="modal-handle" />
          <button className="fs-back" onClick={() => setSelected(null)}>‹ Volver</button>
          <div className="fs-detail-head">
            <span className="fs-detail-icon">{selected.icon}</span>
            <div>
              <h3 className="fs-detail-name">{selected.name}</h3>
              <p className="fs-detail-serv">{selected.serving} · {selected.calories} kcal</p>
            </div>
          </div>

          <div style={{ margin: '16px 0' }}>
            <span className="label">Comida</span>
            <div className="fs-meal-row">
              {MEAL_TYPES.map(m => (
                <button key={m.id} className={`fs-meal-btn ${meal === m.id ? 'active' : ''}`} onClick={() => setMeal(m.id)}>
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <span className="label">Porciones</span>
            <div className="fs-qty">
              <button onClick={() => setServings(s => Math.max(0.5, +(s - 0.5).toFixed(1)))}>−</button>
              <input type="number" step="0.5" min="0.5" value={servings}
                onChange={e => setServings(Math.max(0.5, +e.target.value || 0.5))} />
              <button onClick={() => setServings(s => +(s + 0.5).toFixed(1))}>+</button>
            </div>
          </div>

          <div className="fs-macros">
            <Macro v={scaled.calories} l="kcal" c="var(--lime)" />
            <Macro v={`${scaled.protein}g`} l="Proteína" c="var(--lavender)" />
            <Macro v={`${scaled.carbs}g`} l="Carbos" c="var(--orange)" />
            <Macro v={`${scaled.fat}g`} l="Grasa" c="#ff7a59" />
          </div>

          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 18 }} onClick={confirmAdd}>
            Añadir al diario
          </button>
        </div>
      </div>
    );
  }

  // --- create food / recipe view ---
  if (creating) {
    return <CreateForm kind={creating} onCancel={() => setCreating(null)}
      onSave={(food) => { creating === 'recipe' ? addRecipe(food) : addCustomFood(food); setCreating(null); setTab(creating === 'recipe' ? 'recipes' : 'custom'); }} />;
  }

  // --- list view ---
  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal animate-slideUp fs-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-handle" />
          <div className="fs-searchbar">
            <span className="material-symbols-outlined">search</span>
            <input className="fs-input" placeholder="Buscar alimento…" value={q} onChange={e => setQ(e.target.value)} autoFocus />
            <button className="fs-scan" onClick={() => setScan(true)} title="Escanear código">
              <span className="material-symbols-outlined">qr_code_scanner</span>
            </button>
          </div>

          <div className="fs-tabs">
            {[['search', 'Buscar'], ['favorites', 'Favoritos'], ['custom', 'Mis alimentos'], ['recipes', 'Recetas']].map(([id, label]) => (
              <button key={id} className={`fs-tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>{label}</button>
            ))}
          </div>

          {(tab === 'custom' || tab === 'recipes') && (
            <button className="fs-create" onClick={() => setCreating(tab === 'recipes' ? 'recipe' : 'food')}>
              ＋ Crear {tab === 'recipes' ? 'receta' : 'alimento'}
            </button>
          )}

          <div className="fs-list">
            {results.length === 0 && <p className="fs-empty">Sin resultados. Prueba buscar o escanear 📷</p>}
            {results.map(food => (
              <div key={food.id} className="fs-row" onClick={() => { setSelected(food); setServings(1); setMeal(mealType); }}>
                <span className="fs-row-icon">{food.icon || '🍽️'}</span>
                <div className="fs-row-info">
                  <p className="fs-row-name">{food.name}</p>
                  <p className="fs-row-sub">{food.serving || '1 porción'} · {food.calories} kcal · P{food.protein} C{food.carbs} G{food.fat}</p>
                </div>
                <button className={`fs-fav ${isFav(food) ? 'on' : ''}`} onClick={(e) => { e.stopPropagation(); toggleFavorite(food); }}>
                  {isFav(food) ? '★' : '☆'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {scan && <BarcodeScanner onClose={() => setScan(false)} onFound={(food) => { setScan(false); setSelected(food); setServings(1); setMeal(mealType); }} />}
    </>
  );
}

function Macro({ v, l, c }) {
  return (
    <div className="fs-macro">
      <p className="fs-macro-v" style={{ color: c }}>{v}</p>
      <p className="fs-macro-l">{l}</p>
    </div>
  );
}

function CreateForm({ kind, onSave, onCancel }) {
  const [f, setF] = useState({ name: '', serving: kind === 'recipe' ? '1 porción' : '100 g', calories: '', protein: '', carbs: '', fat: '', fiber: '' });
  const valid = f.name.trim() && f.calories;
  const upd = (k, v) => setF(s => ({ ...s, [k]: v }));
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal animate-slideUp" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h3 className="modal-title">{kind === 'recipe' ? 'Nueva receta 🍲' : 'Nuevo alimento 🥗'}</h3>
        <div style={{ marginBottom: 12 }}>
          <span className="label">Nombre</span>
          <input className="input" value={f.name} onChange={e => upd('name', e.target.value)} placeholder={kind === 'recipe' ? 'Bowl de pollo' : 'Mi cereal'} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <span className="label">Porción</span>
          <input className="input" value={f.serving} onChange={e => upd('serving', e.target.value)} />
        </div>
        <div className="fs-create-grid">
          {[['calories', 'Calorías'], ['protein', 'Proteína g'], ['carbs', 'Carbos g'], ['fat', 'Grasa g']].map(([k, l]) => (
            <div key={k}>
              <span className="label">{l}</span>
              <input className="input" type="number" value={f[k]} onChange={e => upd(k, e.target.value)} />
            </div>
          ))}
        </div>
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }} disabled={!valid}
          onClick={() => onSave({
            name: f.name.trim(), icon: kind === 'recipe' ? '🍲' : '🥗', serving: f.serving,
            calories: +f.calories || 0, protein: +f.protein || 0, carbs: +f.carbs || 0, fat: +f.fat || 0, fiber: +f.fiber || 0,
          })}>
          Guardar
        </button>
      </div>
    </div>
  );
}

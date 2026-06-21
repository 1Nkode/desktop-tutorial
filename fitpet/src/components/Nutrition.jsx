import { useState } from 'react';
import { useStore, petState } from '../store/useStore';
import { MEAL_TYPES } from '../data/foods';
import FoodSearchModal from './FoodSearchModal';
import './Nutrition.css';

const PET_EMOJI = { strong: '🦁', fit: '🐆', chubby: '🐻', normal: '🐱' };

function Ring({ value, max }) {
  const pct = Math.min(value / max, 1);
  const r = 45, circ = 2 * Math.PI * r, off = circ * (1 - pct);
  const over = value > max;
  return (
    <div className="nut-ring">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#2E2E32" strokeWidth="9" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={over ? 'var(--orange)' : 'var(--lime)'} strokeWidth="9"
          strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
          transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 0.7s ease' }} />
      </svg>
      <div className="nut-ring-center">
        <span className="nut-ring-num">{Math.max(0, max - value)}</span>
        <span className="nut-ring-lbl">{over ? 'kcal de más' : 'kcal restantes'}</span>
      </div>
    </div>
  );
}

export default function Nutrition() {
  const { meals, stats, pet, user, removeMeal } = useStore();
  const [picker, setPicker] = useState(null);   // mealType to add into, or null

  const consumed = stats.caloriesConsumed;
  const goal = stats.caloriesGoal;
  const totals = meals.reduce((a, m) => ({
    p: a.p + (m.protein || 0), c: a.c + (m.carbs || 0), f: a.f + (m.fat || 0), fb: a.fb + (m.fiber || 0),
  }), { p: 0, c: 0, f: 0, fb: 0 });

  const state = petState(pet, stats, user);
  const ratio = consumed / goal;
  const petMsg = ratio > 1.25
    ? `${PET_EMOJI[pet.physique]} ¡Ojo! Te pasaste de tu meta. Mañana lo equilibramos 💪`
    : ratio >= 0.8 && ratio <= 1.05
      ? `${PET_EMOJI[pet.physique]} ¡Vas perfecto con tu meta de hoy! 🎉`
      : consumed === 0
        ? `${PET_EMOJI[pet.physique]} ¡Registra tu primera comida del día!`
        : `${PET_EMOJI[pet.physique]} Te quedan ${Math.max(0, goal - consumed)} kcal por hoy`;

  return (
    <div className="nutrition animate-fadeIn">
      {/* Summary */}
      <div className="card nut-summary">
        <div className="nut-top">
          <div className="nut-goal-col">
            <p className="nut-eq"><strong>{consumed}</strong> consumidas</p>
            <p className="nut-eq-sub">de {goal} kcal · {stats.caloriesBurned} quemadas</p>
          </div>
          <Ring value={consumed} max={goal} />
        </div>
        <div className="progress-bar" style={{ marginTop: 4 }}>
          <div className="progress-fill" style={{ width: `${Math.min(ratio * 100, 100)}%`, background: ratio > 1 ? 'var(--orange)' : 'linear-gradient(90deg, var(--lime), var(--lime-dim))' }} />
        </div>
        <div className="nut-macros">
          <MacroBar label="Proteína" v={totals.p} goal={stats.proteinGoal || Math.round(goal * 0.3 / 4)} color="var(--lavender)" />
          <MacroBar label="Carbos" v={totals.c} goal={stats.carbsGoal || Math.round(goal * 0.45 / 4)} color="var(--orange)" />
          <MacroBar label="Grasa" v={totals.f} goal={stats.fatGoal || Math.round(goal * 0.25 / 9)} color="#ff7a59" />
          <MacroBar label="Fibra" v={totals.fb} goal={30} color="var(--lime)" />
        </div>
      </div>

      {/* Pet reaction */}
      <div className="nut-pet-msg">{petMsg}</div>

      {/* Diary by meal */}
      {MEAL_TYPES.map(mt => {
        const items = meals.filter(m => (m.time || 'Snack') === mt.id);
        const cal = items.reduce((s, m) => s + (m.calories || 0), 0);
        return (
          <div className="card nut-meal" key={mt.id}>
            <div className="nut-meal-head">
              <span className="nut-meal-title">{mt.icon} {mt.label}</span>
              <span className="nut-meal-cal">{cal} kcal</span>
            </div>
            {items.map(m => (
              <div className="nut-item" key={m.id}>
                <span className="nut-item-icon">{m.icon}</span>
                <div className="nut-item-info">
                  <p className="nut-item-name">{m.name}</p>
                  <p className="nut-item-macros">P{m.protein || 0} · C{m.carbs || 0} · G{m.fat || 0}</p>
                </div>
                <span className="nut-item-cal">{m.calories}</span>
                <button className="nut-item-del" onClick={() => removeMeal(m.id)}>×</button>
              </div>
            ))}
            <button className="nut-add" onClick={() => setPicker(mt.id)}>＋ Añadir alimento</button>
          </div>
        );
      })}

      {/* Weekly */}
      <div className="card">
        <div className="section-header"><span className="section-title">Progreso semanal</span></div>
        <div className="nut-week">
          {stats.weeklyCalories.map((c, i) => {
            const h = Math.min((c / goal) * 100, 130);
            const over = c > goal;
            return (
              <div className="nut-week-col" key={i}>
                <div className="nut-week-track">
                  <div className="nut-week-fill" style={{ height: `${h}%`, background: over ? 'var(--orange)' : 'linear-gradient(180deg, var(--lime), var(--lime-dim))' }} />
                </div>
                <span className="nut-week-day">{['L','M','X','J','V','S','D'][i]}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ height: 110 }} />

      {picker && <FoodSearchModal mealType={picker} onClose={() => setPicker(null)} />}
    </div>
  );
}

function MacroBar({ label, v, goal, color }) {
  const pct = Math.min((v / goal) * 100, 100);
  return (
    <div className="nut-macro">
      <div className="nut-macro-head">
        <span>{label}</span>
        <span className="nut-macro-v">{Math.round(v)} / {goal}g</span>
      </div>
      <div className="progress-bar" style={{ height: 6 }}>
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

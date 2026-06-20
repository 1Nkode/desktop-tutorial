/*
  Local food database (per serving). Macros in grams, calories in kcal.
  serving = human label for one unit; users scale by servings count.
  This is a compact seed; barcode scans add products from Open Food Facts.
*/
export const FOODS = [
  { id: 'f1', name: 'Huevo', icon: '🥚', serving: '1 unidad (50g)', calories: 78, protein: 6, carbs: 0.6, fat: 5, fiber: 0 },
  { id: 'f2', name: 'Avena', icon: '🥣', serving: '1 taza (80g)', calories: 307, protein: 11, carbs: 55, fat: 5, fiber: 8 },
  { id: 'f3', name: 'Pechuga de pollo', icon: '🍗', serving: '100g', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
  { id: 'f4', name: 'Arroz blanco cocido', icon: '🍚', serving: '1 taza (158g)', calories: 205, protein: 4.3, carbs: 45, fat: 0.4, fiber: 0.6 },
  { id: 'f5', name: 'Arroz integral cocido', icon: '🍚', serving: '1 taza (195g)', calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5 },
  { id: 'f6', name: 'Plátano', icon: '🍌', serving: '1 mediano (118g)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1 },
  { id: 'f7', name: 'Manzana', icon: '🍎', serving: '1 mediana (182g)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4 },
  { id: 'f8', name: 'Aguacate', icon: '🥑', serving: '1/2 (100g)', calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7 },
  { id: 'f9', name: 'Pan integral', icon: '🍞', serving: '1 rebanada (28g)', calories: 69, protein: 3.6, carbs: 12, fat: 1, fiber: 1.9 },
  { id: 'f10', name: 'Leche descremada', icon: '🥛', serving: '1 taza (240ml)', calories: 83, protein: 8, carbs: 12, fat: 0.2, fiber: 0 },
  { id: 'f11', name: 'Yogur griego', icon: '🥛', serving: '170g', calories: 100, protein: 17, carbs: 6, fat: 0.7, fiber: 0 },
  { id: 'f12', name: 'Almendras', icon: '🥜', serving: '28g', calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5 },
  { id: 'f13', name: 'Salmón', icon: '🐟', serving: '100g', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0 },
  { id: 'f14', name: 'Atún en agua', icon: '🐟', serving: '1 lata (142g)', calories: 128, protein: 28, carbs: 0, fat: 1, fiber: 0 },
  { id: 'f15', name: 'Brócoli', icon: '🥦', serving: '1 taza (91g)', calories: 31, protein: 2.5, carbs: 6, fat: 0.3, fiber: 2.4 },
  { id: 'f16', name: 'Papa', icon: '🥔', serving: '1 mediana (173g)', calories: 161, protein: 4.3, carbs: 37, fat: 0.2, fiber: 3.8 },
  { id: 'f17', name: 'Pasta cocida', icon: '🍝', serving: '1 taza (140g)', calories: 220, protein: 8, carbs: 43, fat: 1.3, fiber: 2.5 },
  { id: 'f18', name: 'Proteína en polvo', icon: '🥤', serving: '1 scoop (30g)', calories: 120, protein: 24, carbs: 3, fat: 1.5, fiber: 1 },
  { id: 'f19', name: 'Mantequilla de maní', icon: '🥜', serving: '1 cda (16g)', calories: 94, protein: 4, carbs: 3, fat: 8, fiber: 1 },
  { id: 'f20', name: 'Arándanos', icon: '🫐', serving: '1 taza (148g)', calories: 84, protein: 1.1, carbs: 21, fat: 0.5, fiber: 3.6 },
  { id: 'f21', name: 'Lentejas cocidas', icon: '🫘', serving: '1 taza (198g)', calories: 230, protein: 18, carbs: 40, fat: 0.8, fiber: 16 },
  { id: 'f22', name: 'Queso cheddar', icon: '🧀', serving: '28g', calories: 113, protein: 7, carbs: 0.4, fat: 9, fiber: 0 },
  { id: 'f23', name: 'Tortilla de maíz', icon: '🌮', serving: '1 unidad (24g)', calories: 52, protein: 1.4, carbs: 11, fat: 0.7, fiber: 1.5 },
  { id: 'f24', name: 'Carne molida 90/10', icon: '🥩', serving: '100g', calories: 176, protein: 20, carbs: 0, fat: 10, fiber: 0 },
  { id: 'f25', name: 'Espinaca', icon: '🥬', serving: '1 taza (30g)', calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1, fiber: 0.7 },
  { id: 'f26', name: 'Café con leche', icon: '☕', serving: '1 taza (240ml)', calories: 60, protein: 3, carbs: 6, fat: 2.5, fiber: 0 },
  { id: 'f27', name: 'Chocolate negro', icon: '🍫', serving: '30g', calories: 170, protein: 2, carbs: 13, fat: 12, fiber: 3 },
  { id: 'f28', name: 'Pizza', icon: '🍕', serving: '1 rebanada (107g)', calories: 285, protein: 12, carbs: 36, fat: 10, fiber: 2.5 },
  { id: 'f29', name: 'Hamburguesa', icon: '🍔', serving: '1 unidad (215g)', calories: 540, protein: 25, carbs: 40, fat: 31, fiber: 3 },
  { id: 'f30', name: 'Ensalada mixta', icon: '🥗', serving: '1 bowl (200g)', calories: 120, protein: 4, carbs: 12, fat: 7, fiber: 4 },
  { id: 'f31', name: 'Batido de proteína', icon: '🥤', serving: '1 vaso (300ml)', calories: 220, protein: 28, carbs: 22, fat: 4, fiber: 2 },
  { id: 'f32', name: 'Tostada con aguacate', icon: '🥑', serving: '1 unidad', calories: 195, protein: 6, carbs: 18, fat: 12, fiber: 5 },
];

export const MEAL_TYPES = [
  { id: 'Breakfast', label: 'Desayuno', icon: '🥣' },
  { id: 'Lunch', label: 'Comida', icon: '🥗' },
  { id: 'Dinner', label: 'Cena', icon: '🍽️' },
  { id: 'Snack', label: 'Snack', icon: '🍎' },
];

export function scaleFood(food, servings) {
  const s = Number(servings) || 1;
  return {
    calories: Math.round(food.calories * s),
    protein: +(food.protein * s).toFixed(1),
    carbs: +(food.carbs * s).toFixed(1),
    fat: +(food.fat * s).toFixed(1),
    fiber: +((food.fiber || 0) * s).toFixed(1),
  };
}

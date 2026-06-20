/*
  Wardrobe — equippable garments by slot (Talking-Tom style).
  Each garment: { id, label, color } ; 'none' means nothing equipped.
  Rendered as layered shapes over the pet by PetClothes.
*/
export const WARDROBE = {
  hat: [
    { id: 'none', label: 'Sin gorra', color: null },
    { id: 'cap-red', label: 'Gorra roja', color: '#e23b3b' },
    { id: 'cap-blue', label: 'Gorra azul', color: '#2f6fe0' },
    { id: 'cap-black', label: 'Gorra negra', color: '#2b2f3a' },
    { id: 'cap-lime', label: 'Gorra lima', color: '#aadb1f' },
    { id: 'band-pink', label: 'Cinta', color: '#ff4d6d' },
    { id: 'crown', label: 'Corona', color: '#FFD54F' },
  ],
  top: [
    { id: 'none', label: 'Sin polo', color: null },
    { id: 'polo-red', label: 'Polo rojo', color: '#e23b3b' },
    { id: 'polo-blue', label: 'Polo azul', color: '#2f6fe0' },
    { id: 'polo-green', label: 'Polo verde', color: '#2db36b' },
    { id: 'polo-black', label: 'Polo negro', color: '#2b2f3a' },
    { id: 'polo-purple', label: 'Polo morado', color: '#7b5bff' },
    { id: 'tank-lime', label: 'Camiseta lima', color: '#aadb1f' },
    { id: 'tank-orange', label: 'Camiseta naranja', color: '#ff8c2b' },
  ],
  bottom: [
    { id: 'none', label: 'Sin pantalón', color: null },
    { id: 'pants-blue', label: 'Pantalón azul', color: '#3457a8' },
    { id: 'pants-black', label: 'Pantalón negro', color: '#23262f' },
    { id: 'pants-grey', label: 'Pantalón gris', color: '#6b7280' },
    { id: 'shorts-red', label: 'Short rojo', color: '#e23b3b' },
    { id: 'shorts-lime', label: 'Short lima', color: '#aadb1f' },
  ],
};

export const SLOT_INFO = [
  { id: 'hat', label: 'Gorra', icon: '🧢' },
  { id: 'top', label: 'Polo / Camiseta', icon: '👕' },
  { id: 'bottom', label: 'Pantalón', icon: '👖' },
];

export const DEFAULT_OUTFIT = { hat: 'none', top: 'polo-blue', bottom: 'none' };

export function garment(slot, id) {
  return (WARDROBE[slot] || []).find(g => g.id === id) || WARDROBE[slot]?.[0];
}

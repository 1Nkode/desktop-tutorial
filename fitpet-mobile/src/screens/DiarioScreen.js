import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { colors, radius, spacing, type } from '../theme';
import { useStore } from '../store/useStore';
import { Card, Ring, ProgressBar, SectionHeader } from '../components/ui';

function MacroRow({ label, value, goal, color }) {
  return (
    <View style={styles.macroRow}>
      <View style={styles.macroTop}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroVal}>
          {value}g <Text style={{ color: colors.textFaint }}>/ {goal}g</Text>
        </Text>
      </View>
      <ProgressBar value={value} max={goal} color={color} height={8} />
    </View>
  );
}

function MealCard({ meal }) {
  return (
    <View style={styles.mealCard}>
      <View style={styles.mealThumb}>
        <Text style={{ fontSize: 24 }}>{meal.img}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.mealName} numberOfLines={1}>{meal.name}</Text>
        <Text style={styles.mealDetail}>{meal.detail}</Text>
      </View>
      <Pressable style={styles.addBtn} hitSlop={8}>
        <Text style={styles.addBtnText}>＋</Text>
      </Pressable>
    </View>
  );
}

export default function DiarioScreen() {
  const { meals, goals, consumedKcal } = useStore();
  const consumed = consumedKcal();
  const remaining = goals.kcalGoal - consumed;

  const totals = { protein: 85, carbs: 120, fat: 42, fiber: 12 }; // shown vs goals

  const slots = [
    { key: 'Desayuno', icon: '🌅', kcal: 420 },
    { key: 'Almuerzo', icon: '☀️', kcal: 680 },
    { key: 'Cena', icon: '🌙', kcal: null },
    { key: 'Snacks', icon: '🍫', kcal: 150 },
  ];

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingHorizontal: spacing.margin, paddingBottom: 110 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Calorie ring */}
      <Card style={{ alignItems: 'center', marginBottom: spacing.sm }} padding={spacing.lg}>
        <Ring value={consumed} max={goals.kcalGoal} size={170} stroke={16}>
          <Text style={styles.kcalBig}>{remaining.toLocaleString()}</Text>
          <Text style={styles.kcalLabel}>KCAL RESTANTES</Text>
        </Ring>
      </Card>

      {/* Macronutrients */}
      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.cardTitle}>Macronutrientes</Text>
        <MacroRow label="Proteína" value={totals.protein} goal={goals.proteinGoal} color={colors.protein} />
        <MacroRow label="Carbos" value={totals.carbs} goal={goals.carbsGoal} color={colors.carbs} />
        <MacroRow label="Grasas" value={totals.fat} goal={goals.fatGoal} color={colors.fat} />
        <MacroRow label="Fibra" value={totals.fiber} goal={goals.fiberGoal} color={colors.fiber} />
      </Card>

      {/* Meal diary */}
      <SectionHeader title="Diario de Comidas" action="Ver historial" />
      {slots.map((slot) => {
        const slotMeals = meals.filter((m) => m.slot === slot.key);
        return (
          <View key={slot.key} style={{ marginBottom: spacing.md }}>
            <View style={styles.slotHeader}>
              <Text style={styles.slotTitle}>
                {slot.icon}  {slot.key}
              </Text>
              <Text style={styles.slotKcal}>{slot.kcal != null ? `${slot.kcal} Kcal` : '--- Kcal'}</Text>
            </View>
            {slotMeals.length > 0 ? (
              slotMeals.map((m) => <MealCard key={m.id} meal={m} />)
            ) : (
              <Pressable style={styles.emptySlot}>
                <Text style={styles.emptySlotText}>＋  Registrar {slot.key.toLowerCase()}</Text>
              </Pressable>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  kcalBig: { ...type.statXl, color: colors.primary },
  kcalLabel: { ...type.label, color: colors.textMuted, marginTop: 2 },
  cardTitle: { ...type.h3, color: colors.text, marginBottom: spacing.sm },
  macroRow: { marginBottom: 14 },
  macroTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  macroLabel: { color: colors.text, fontWeight: '600', fontSize: 14 },
  macroVal: { color: colors.text, fontWeight: '700', fontSize: 13 },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  slotTitle: { color: colors.text, fontWeight: '700', fontSize: 16 },
  slotKcal: { color: colors.textMuted, fontWeight: '700', fontSize: 13 },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surfaceHigh,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 8,
  },
  mealThumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surfaceHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealName: { color: colors.text, fontWeight: '700', fontSize: 14 },
  mealDetail: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surfaceHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: colors.primary, fontSize: 18, fontWeight: '700', lineHeight: 20 },
  emptySlot: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.track,
    borderRadius: radius.md,
    paddingVertical: 18,
    alignItems: 'center',
  },
  emptySlotText: { color: colors.textMuted, fontWeight: '700', fontSize: 13 },
});

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing, type } from '../theme';
import { useStore } from '../store/useStore';
import { Card, ProgressBar, PillButton, SectionHeader } from '../components/ui';

// Pet visual per physique state
const PHYSIQUE = {
  fuerte: { emoji: '🦾', label: 'Modo Bestia Activo', char: '💪🐸', desc: '¡Mascota al máximo! Entrena un día más para que no pierda su físico musculoso.', mode: 'MODO BESTIA ACTIVO', color: colors.primary },
  fit: { emoji: '🐆', label: 'En Forma', char: '🐸', desc: 'Tu mascota está activa y saludable. ¡Sigue así!', mode: 'MODO ACTIVO', color: colors.primary },
  normal: { emoji: '🐱', label: 'Normal', char: '🐸', desc: 'Tu mascota está estable. Entrena para que evolucione.', mode: 'MODO NORMAL', color: colors.secondary },
  sedentario: { emoji: '🐻', label: 'Modo Sedentario', char: '😔🐸', desc: 'Tu mascota ha perdido su forma física. ¡Entrena para recuperar su fuerza!', mode: 'MODO SEDENTARIO', color: colors.warning },
};

const MOODS = {
  feliz: { emoji: '😸', label: 'Feliz' },
  motivada: { emoji: '😤', label: 'Motivada' },
  cansada: { emoji: '😴', label: 'Cansada' },
  triste: { emoji: '😿', label: 'Triste' },
};

const ACCESSORIES = [
  { id: 'corona', name: 'Corona Titan', emoji: '👑', unlocked: true },
  { id: 'cinturon', name: 'Cinturón Pro', emoji: '🥇', unlocked: true },
  { id: 'guantes', name: 'Guantes', emoji: '🥊', unlocked: false },
  { id: 'capa', name: 'Capa Hero', emoji: '🦸', unlocked: false },
];

function Gauge({ label, value, color }) {
  return (
    <Card style={{ flex: 1 }} padding={14}>
      <Text style={styles.gaugeLabel}>{label}</Text>
      <ProgressBar value={value} max={1} color={color} height={8} />
    </Card>
  );
}

export default function MascotaScreen() {
  const { pet } = useStore();
  const phys = PHYSIQUE[pet.physique] || PHYSIQUE.normal;
  const mood = MOODS[pet.mood] || MOODS.feliz;

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingHorizontal: spacing.margin, paddingBottom: 110 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Mood + strength gauges */}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: spacing.md }}>
        <View style={{ flex: 1 }}>
          <Card padding={14}>
            <Text style={styles.gaugeLabel}>ESTADO DE ÁNIMO</Text>
            <Text style={styles.gaugeValue}>{mood.emoji} {mood.label}</Text>
          </Card>
        </View>
        <View style={{ flex: 1 }}>
          <Card padding={14}>
            <Text style={styles.gaugeLabel}>FUERZA</Text>
            <ProgressBar value={pet.xp} max={pet.xpToNext} color={colors.primary} height={8} />
          </Card>
        </View>
      </View>

      {/* Pet stage */}
      <Card style={{ alignItems: 'center', marginBottom: spacing.md, overflow: 'hidden' }} padding={0}>
        <LinearGradient
          colors={['rgba(204,255,0,0.10)', 'rgba(18,18,18,0)']}
          style={styles.stageGlow}
        />
        <View style={styles.petRing}>
          <Text style={styles.petChar}>{phys.char}</Text>
        </View>
        <Text style={styles.petName}>{pet.name}</Text>
        <Text style={styles.petLevel}>Level {pet.level} {pet.title}</Text>
        <View style={{ height: spacing.md }} />
      </Card>

      {/* Mode banner */}
      <View style={[styles.modeBanner, { borderColor: phys.color }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.modeTitle, { color: phys.color }]}>⚡ {phys.mode}</Text>
          <Text style={styles.modeDesc}>{phys.desc}</Text>
        </View>
        <Pressable style={[styles.playBtn, { backgroundColor: phys.color }]}>
          <Text style={{ fontSize: 18, color: colors.onPrimary }}>▶</Text>
        </Pressable>
      </View>

      {/* XP progress */}
      <Card style={{ marginTop: spacing.md, marginBottom: spacing.md }}>
        <View style={styles.xpHeader}>
          <Text style={styles.cardTitle}>Experiencia</Text>
          <Text style={styles.xpNum}>{pet.xp} / {pet.xpToNext} XP</Text>
        </View>
        <ProgressBar value={pet.xp} max={pet.xpToNext} color={colors.primary} height={12} />
        <Text style={styles.xpSub}>{pet.xpToNext - pet.xp} XP para Level {pet.level + 1}</Text>
      </Card>

      {/* Accessories */}
      <SectionHeader title="Accesorios desbloqueados" action="Ver todos" />
      <View style={styles.accGrid}>
        {ACCESSORIES.map((a) => (
          <View key={a.id} style={[styles.accCard, !a.unlocked && styles.accLocked]}>
            <Text style={{ fontSize: 28 }}>{a.unlocked ? a.emoji : '🔒'}</Text>
            <Text style={styles.accName}>{a.name}</Text>
          </View>
        ))}
      </View>

      <View style={{ height: spacing.md }} />
      <PillButton label="Alimentar a tu mascota" icon="🍖" onPress={() => {}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  gaugeLabel: { ...type.label, color: colors.textMuted, fontSize: 10, marginBottom: 8 },
  gaugeValue: { color: colors.text, fontWeight: '800', fontSize: 16 },
  stageGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: 160 },
  petRing: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    backgroundColor: 'rgba(204,255,0,0.04)',
  },
  petChar: { fontSize: 80 },
  petName: { ...type.h1, color: colors.text, marginTop: spacing.md },
  petLevel: { color: colors.textMuted, fontWeight: '600', fontSize: 14, marginTop: 2 },
  modeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.glass,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    padding: spacing.md,
  },
  modeTitle: { fontWeight: '800', fontSize: 13, marginBottom: 4 },
  modeDesc: { color: colors.textMuted, fontSize: 12, lineHeight: 17 },
  playBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { ...type.h3, color: colors.text },
  xpHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  xpNum: { color: colors.primary, fontWeight: '800', fontSize: 13 },
  xpSub: { color: colors.textMuted, fontSize: 12, marginTop: 8 },
  accGrid: { flexDirection: 'row', gap: 12 },
  accCard: {
    flex: 1,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  accLocked: { opacity: 0.5 },
  accName: { color: colors.textMuted, fontSize: 10, fontWeight: '700', textAlign: 'center' },
});

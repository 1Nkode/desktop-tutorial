import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { colors, radius, spacing, type } from '../theme';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui';

const MENU = [
  { id: 'devices', icon: '⌚', label: 'Dispositivos' },
  { id: 'weight', icon: '⚖️', label: 'Mi Peso' },
  { id: 'achievements', icon: '⭐', label: 'Mis logros' },
  { id: 'reminders', icon: '⏰', label: 'Recordatorios' },
  { id: 'album', icon: '🖼️', label: 'Álbum de fotos' },
  { id: 'privacy', icon: '🔒', label: 'Comunicación y privacidad' },
  { id: 'contact', icon: '🎧', label: 'Contáctenos' },
];

function StatChip({ icon, value, wide }) {
  return (
    <View style={[styles.statChip, wide && { flex: 1.4 }]}>
      <Text style={{ fontSize: 16 }}>{icon}</Text>
      <Text style={styles.statText}>{value}</Text>
    </View>
  );
}

export default function PerfilScreen() {
  const { user } = useStore();

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingHorizontal: spacing.margin, paddingBottom: 110 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Identity */}
      <View style={styles.identity}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{user.name}-</Text>
          <Text style={styles.handle} numberOfLines={1}>{user.handle}</Text>
          <Text style={styles.account}>
            Tipo de cuenta: <Text style={{ color: colors.primary, fontWeight: '700' }}>{user.account}</Text>
          </Text>
        </View>
        <Pressable style={styles.editBox}>
          <Text style={{ fontSize: 22 }}>📷</Text>
          <Text style={styles.editText}>EDITAR</Text>
        </Pressable>
      </View>

      {/* Quick actions */}
      <View style={styles.quickRow}>
        <Pressable style={styles.configBtn}>
          <Text style={styles.configText}>⚙️  Configuración</Text>
        </Pressable>
        <Pressable style={styles.notifBtn}>
          <Text style={styles.notifText}>🔔 {user.notifications}</Text>
        </Pressable>
      </View>

      {/* Stat chips */}
      <View style={styles.statsGrid}>
        <StatChip icon="🍽️" value={`${user.calsIn} cal`} wide />
        <StatChip icon="🏃" value={`${user.calsOut} cal`} wide />
      </View>
      <View style={[styles.statsGrid, { marginTop: 12 }]}>
        <StatChip icon="⚖️" value={`${user.weight} kg`} wide />
        <StatChip icon="📷" value="" />
        <StatChip icon="📝" value="" />
      </View>

      {/* Menu */}
      <View style={{ marginTop: spacing.md }}>
        {MENU.map((m) => (
          <Pressable key={m.id} style={styles.menuRow}>
            <View style={styles.menuIcon}>
              <Text style={{ fontSize: 18 }}>{m.icon}</Text>
            </View>
            <Text style={styles.menuLabel}>{m.label}</Text>
            <Text style={styles.menuChevron}>›</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  identity: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: spacing.md },
  name: { ...type.h1, color: colors.text },
  handle: { color: colors.textMuted, fontSize: 13, marginTop: 4 },
  account: { color: colors.textMuted, fontSize: 13, fontStyle: 'italic', marginTop: 6 },
  editBox: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  editText: { color: colors.primary, fontSize: 9, fontWeight: '800' },
  quickRow: { flexDirection: 'row', gap: 12, marginBottom: spacing.md },
  configBtn: {
    flex: 1,
    backgroundColor: colors.surfaceHigh,
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  configText: { color: colors.text, fontWeight: '700', fontSize: 14 },
  notifBtn: {
    backgroundColor: 'rgba(255,180,171,0.12)',
    borderRadius: radius.pill,
    paddingVertical: 14,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifText: { color: colors.error, fontWeight: '800', fontSize: 14 },
  statsGrid: { flexDirection: 'row', gap: 12 },
  statChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surfaceHigh,
    borderRadius: radius.md,
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 54,
  },
  statText: { color: colors.text, fontWeight: '800', fontSize: 15 },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surfaceHigh,
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 12,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { flex: 1, color: colors.text, fontWeight: '700', fontSize: 15 },
  menuChevron: { color: colors.textMuted, fontSize: 22, fontWeight: '300' },
});

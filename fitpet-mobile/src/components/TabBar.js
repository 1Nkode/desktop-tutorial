import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

const TABS = [
  { key: 'diario', label: 'Diario', icon: '📋' },
  { key: 'entreno', label: 'Entreno', icon: '🏋️' },
  { key: 'comunidad', label: 'Comunidad', icon: '👥' },
  { key: 'mascota', label: 'Mascota', icon: '🐾' },
  { key: 'perfil', label: 'Perfil', icon: '👤' },
];

export default function TabBar({ active, onChange, bottomInset = 0 }) {
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(bottomInset, 10) }]}>
      {TABS.map((t) => {
        const isActive = active === t.key;
        return (
          <Pressable key={t.key} style={styles.tab} onPress={() => onChange(t.key)} hitSlop={6}>
            <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
              <Text style={[styles.icon, { opacity: isActive ? 1 : 0.55 }]}>{t.icon}</Text>
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 10,
    paddingHorizontal: spacing.sm,
  },
  tab: { flex: 1, alignItems: 'center', gap: 4 },
  iconWrap: {
    width: 44,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: { backgroundColor: 'rgba(204,255,0,0.14)' },
  icon: { fontSize: 18 },
  label: { fontSize: 10, fontWeight: '600', color: colors.textFaint },
  labelActive: { color: colors.primary, fontWeight: '800' },
});

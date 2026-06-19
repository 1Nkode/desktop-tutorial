import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';
import { StreakBadge } from './ui';

export default function Header({ streak = 7 }) {
  return (
    <View style={styles.header}>
      <View style={styles.logoRow}>
        <View style={styles.logoMark}>
          <Text style={{ fontSize: 16 }}>🐾</Text>
        </View>
        <Text style={styles.logoText}>FitPet</Text>
      </View>
      <StreakBadge days={streak} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.margin,
    paddingBottom: spacing.sm,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoMark: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  logoText: { color: colors.text, fontWeight: '800', fontSize: 20, letterSpacing: -0.5 },
});

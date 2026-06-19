import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing, type } from '../theme';

// Glassmorphic card
export function Card({ children, style, padding = spacing.md }) {
  return <View style={[styles.card, { padding }, style]}>{children}</View>;
}

// Section header with optional "Ver todos" action
export function SectionHeader({ title, action, onAction }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

// Pill button (primary = neon green, secondary = violet outline)
export function PillButton({ label, onPress, variant = 'primary', icon, style }) {
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        isPrimary && styles.pillPrimary,
        variant === 'secondary' && styles.pillSecondary,
        isGhost && styles.pillGhost,
        pressed && { opacity: 0.85 },
        style,
      ]}
    >
      {icon ? <Text style={styles.pillIcon}>{icon}</Text> : null}
      <Text
        style={[
          styles.pillLabel,
          isPrimary ? { color: colors.onPrimary } : { color: variant === 'secondary' ? colors.secondary : colors.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// Thick rounded progress bar with neon gradient fill
export function ProgressBar({ value, max = 1, color = colors.primary, height = 10, track = colors.track }) {
  const pct = Math.max(0, Math.min(value / max, 1));
  return (
    <View style={[styles.track, { height, borderRadius: height / 2, backgroundColor: track }]}>
      <LinearGradient
        colors={[color, color === colors.primary ? colors.primaryDim : color]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ width: `${pct * 100}%`, height: '100%', borderRadius: height / 2 }}
      />
    </View>
  );
}

// Circular SVG progress ring
export function Ring({ value, max = 1, size = 120, stroke = 12, color = colors.primary, children }) {
  const pct = Math.max(0, Math.min(value / max, 1));
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.track} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
        />
      </Svg>
      <View style={{ alignItems: 'center' }}>{children}</View>
    </View>
  );
}

// Small rounded chip/tag
export function Chip({ label, color = colors.primary, bg, textColor }) {
  return (
    <View style={[styles.chip, { backgroundColor: bg || 'rgba(204,255,0,0.15)' }]}>
      <Text style={[styles.chipText, { color: textColor || color }]}>{label}</Text>
    </View>
  );
}

// Streak badge used in headers
export function StreakBadge({ days }) {
  return (
    <View style={styles.streak}>
      <Text style={styles.streakText}>{days} DAY STREAK</Text>
      <Text style={{ fontSize: 13 }}>🔥</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.glass,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionTitle: { ...type.h2, color: colors.text },
  sectionAction: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: radius.pill,
  },
  pillPrimary: { backgroundColor: colors.primary },
  pillSecondary: { borderWidth: 2, borderColor: colors.secondary, backgroundColor: 'transparent' },
  pillGhost: { backgroundColor: colors.surfaceHigh },
  pillIcon: { fontSize: 16 },
  pillLabel: { fontWeight: '800', fontSize: 15 },
  track: { width: '100%', overflow: 'hidden' },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  chipText: { fontSize: 11, fontWeight: '800' },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(204,255,0,0.12)',
    borderColor: 'rgba(204,255,0,0.4)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  streakText: { color: colors.primary, fontWeight: '800', fontSize: 11, letterSpacing: 0.5 },
});

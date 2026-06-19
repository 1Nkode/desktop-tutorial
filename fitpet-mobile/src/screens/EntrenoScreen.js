import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { colors, radius, spacing, type } from '../theme';
import { useStore } from '../store/useStore';
import { Card, PillButton, ProgressBar, Chip } from '../components/ui';

const QUICK = [
  { type: 'Running', detail: 'Outdoor Track', icon: '🏃' },
  { type: 'Weightlifting', detail: 'Strength Training', icon: '🏋️' },
  { type: 'Cycling', detail: 'Road Trip', icon: '🚴' },
  { type: 'Swimming', detail: 'Laps', icon: '🏊' },
];

function fmt(secs) {
  const h = String(Math.floor(secs / 3600)).padStart(2, '0');
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export default function EntrenoScreen() {
  const { session, stats, setRpe } = useStore();
  const [selected, setSelected] = useState('Running');
  const rpe = session.rpe;

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingHorizontal: spacing.margin, paddingBottom: 110 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Connection row */}
      <View style={styles.connRow}>
        <Text style={styles.connText}>● Connected</Text>
        <Text style={{ color: colors.textMuted, fontSize: 18 }}>⌚</Text>
      </View>

      {/* Active session */}
      <Card style={{ alignItems: 'center', marginBottom: spacing.md }} padding={spacing.lg}>
        <Text style={styles.sessionLabel}>ACTIVE SESSION</Text>
        <Text style={styles.timer}>{fmt(session.seconds)}</Text>
        <View style={styles.metricRow}>
          <View style={styles.metric}>
            <Text style={styles.metricVal}>{session.bpm}</Text>
            <Text style={styles.metricKey}>BPM</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text style={styles.metricVal}>{session.calories}</Text>
            <Text style={styles.metricKey}>Calories</Text>
          </View>
        </View>
      </Card>

      {/* Quick start */}
      <Text style={styles.heading}>Quick Start</Text>
      <View style={styles.grid}>
        {QUICK.map((q) => {
          const active = selected === q.type;
          return (
            <Pressable
              key={q.type}
              onPress={() => setSelected(q.type)}
              style={[styles.quickCard, active && styles.quickCardActive]}
            >
              <Text style={{ fontSize: 24 }}>{q.icon}</Text>
              <Text style={[styles.quickType, active && { color: colors.primary }]}>{q.type}</Text>
              <Text style={styles.quickDetail}>{q.detail}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Intensity / RPE */}
      <Card style={{ marginTop: spacing.md, marginBottom: spacing.md }}>
        <View style={styles.rpeHeader}>
          <Text style={styles.cardTitle}>Intensity (RPE)</Text>
          <Chip label={`Hard (${rpe}/10)`} />
        </View>
        <View style={styles.sliderTrack}>
          <View style={[styles.sliderFill, { width: `${(rpe / 10) * 100}%` }]} />
          <View style={[styles.sliderThumb, { left: `${(rpe / 10) * 100}%` }]} />
        </View>
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>Very Easy</Text>
          <Text style={styles.sliderLabel}>Max Effort</Text>
        </View>
        <View style={styles.rpeButtons}>
          {[2, 4, 6, 8, 10].map((n) => (
            <Pressable key={n} style={styles.rpeBtn} onPress={() => setRpe(n)}>
              <Text style={[styles.rpeBtnText, rpe === n && { color: colors.primary }]}>{n}</Text>
            </Pressable>
          ))}
        </View>
      </Card>

      {/* Heart rate zones */}
      <Card style={{ marginBottom: spacing.md }}>
        <Text style={styles.cardTitle}>Heart Rate Zones</Text>
        {stats.hrZones.map((z) => (
          <View key={z.zone} style={styles.zoneRow}>
            <View style={styles.zoneTop}>
              <Text style={styles.zoneName}>{z.zone}</Text>
              <Text style={styles.zoneTime}>{z.time}</Text>
            </View>
            <ProgressBar value={z.pct} max={1} color={z.color} height={7} />
          </View>
        ))}
      </Card>

      <PillButton label="Finish Workout" onPress={() => {}} icon="🏁" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  connRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 4,
  },
  connText: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  sessionLabel: { ...type.label, color: colors.textMuted, marginBottom: 6 },
  timer: { fontSize: 52, fontWeight: '800', color: colors.text, letterSpacing: -1, marginBottom: 18 },
  metricRow: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  metric: { alignItems: 'center' },
  metricVal: { fontSize: 26, fontWeight: '800', color: colors.text },
  metricKey: { color: colors.textMuted, fontSize: 12, fontWeight: '600', marginTop: 2 },
  metricDivider: { width: 1, height: 36, backgroundColor: colors.glassBorder },
  heading: { ...type.h2, color: colors.text, marginBottom: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickCard: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 8,
  },
  quickCardActive: { borderColor: colors.primary, backgroundColor: 'rgba(204,255,0,0.06)' },
  quickType: { color: colors.text, fontWeight: '800', fontSize: 16 },
  quickDetail: { color: colors.textMuted, fontSize: 12 },
  cardTitle: { ...type.h3, color: colors.text },
  rpeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sliderTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.track,
    justifyContent: 'center',
  },
  sliderFill: { height: 8, borderRadius: 4, backgroundColor: colors.primary },
  sliderThumb: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    marginLeft: -11,
    borderWidth: 3,
    borderColor: colors.bg,
  },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  sliderLabel: { color: colors.textFaint, fontSize: 12 },
  rpeButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  rpeBtn: {
    width: 44,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rpeBtnText: { color: colors.textMuted, fontWeight: '800', fontSize: 15 },
  zoneRow: { marginTop: 14 },
  zoneTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  zoneName: { color: colors.text, fontWeight: '600', fontSize: 13 },
  zoneTime: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
});

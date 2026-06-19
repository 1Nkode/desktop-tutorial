import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { colors, radius, spacing, type } from '../theme';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui';

const STORIES = [
  { name: 'Tú', avatar: '➕', me: true },
  { name: 'Luna', avatar: '🐱' },
  { name: 'Rocky', avatar: '🐶' },
  { name: 'Max', avatar: '🐰' },
  { name: 'Kira', avatar: '🦊' },
];

function Story({ s }) {
  return (
    <View style={styles.story}>
      <View style={[styles.storyRing, s.me && styles.storyRingMe]}>
        <View style={styles.storyAvatar}>
          <Text style={{ fontSize: 22 }}>{s.avatar}</Text>
        </View>
      </View>
      <Text style={styles.storyName}>{s.name}</Text>
    </View>
  );
}

function Post({ post, onLike }) {
  return (
    <Card style={{ marginBottom: spacing.md }} padding={0}>
      {/* header */}
      <View style={styles.postHeader}>
        <View style={styles.postAvatar}>
          <Text style={{ fontSize: 20 }}>{post.avatar}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.postUser}>{post.user}</Text>
          <Text style={styles.postTag}>{post.tag}</Text>
        </View>
        <Text style={{ color: colors.textFaint, fontSize: 20 }}>⋯</Text>
      </View>

      {/* media block */}
      <View style={styles.postMedia}>
        <Text style={{ fontSize: 46 }}>
          {post.type === 'workout' ? '🌃' : post.type === 'meal' ? '🥗' : '🏆'}
        </Text>
        {post.stat ? (
          <View style={styles.statOverlay}>
            <Text style={styles.statOverlayText}>{post.stat}</Text>
          </View>
        ) : null}
        {post.macro ? (
          <View style={styles.macroOverlay}>
            <Text style={styles.macroPill}>🥩 {post.macro.p}</Text>
            <Text style={styles.macroPill}>🍞 {post.macro.c}</Text>
            <Text style={styles.macroPill}>🥑 {post.macro.f}</Text>
          </View>
        ) : null}
      </View>

      {/* actions */}
      <View style={styles.postActions}>
        <Pressable style={styles.actionBtn} onPress={onLike} hitSlop={6}>
          <Text style={{ fontSize: 16 }}>{post.liked ? '💚' : '🤍'}</Text>
          <Text style={[styles.actionText, post.liked && { color: colors.primary }]}>{post.likes}</Text>
        </Pressable>
        <View style={styles.actionBtn}>
          <Text style={{ fontSize: 16 }}>💬</Text>
          <Text style={styles.actionText}>{post.comments}</Text>
        </View>
        <View style={[styles.actionBtn, { marginLeft: 'auto' }]}>
          <Text style={{ fontSize: 16 }}>↗️</Text>
        </View>
      </View>

      {/* caption */}
      <Text style={styles.postText}>{post.text}</Text>
    </Card>
  );
}

export default function ComunidadScreen() {
  const { feed, toggleLike } = useStore();

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 110 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Stories rail */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.margin, gap: 14, paddingBottom: spacing.md }}
      >
        {STORIES.map((s) => (
          <Story key={s.name} s={s} />
        ))}
      </ScrollView>

      <View style={{ paddingHorizontal: spacing.margin }}>
        {feed.map((p) => (
          <Post key={p.id} post={p} onLike={() => toggleLike(p.id)} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  story: { alignItems: 'center', gap: 6, width: 64 },
  storyRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyRingMe: { borderColor: colors.primary, borderStyle: 'dashed' },
  storyAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyName: { color: colors.textMuted, fontSize: 11, fontWeight: '600' },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postUser: { color: colors.text, fontWeight: '800', fontSize: 14 },
  postTag: { color: colors.textMuted, fontSize: 11, marginTop: 1 },
  postMedia: {
    height: 180,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  statOverlay: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  statOverlayText: { color: colors.primary, fontWeight: '800', fontSize: 13 },
  macroOverlay: { position: 'absolute', bottom: 12, flexDirection: 'row', gap: 8 },
  macroPill: {
    color: colors.text,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.sm,
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
  },
  postActions: { flexDirection: 'row', alignItems: 'center', gap: 18, padding: 14, paddingBottom: 8 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { color: colors.text, fontWeight: '700', fontSize: 13 },
  postText: { color: colors.textMuted, fontSize: 14, lineHeight: 20, paddingHorizontal: 14, paddingBottom: 16 },
});

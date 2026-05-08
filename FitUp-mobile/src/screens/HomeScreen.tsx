import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';
import { getNextWorkout } from '../data/workouts';
import { getWeekActivity, getRelativeDate, formatDuration } from '../utils/history';
import { colors, font } from '../theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

const WEEK_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function HomeScreen({ navigation }: Props) {
  const { profile, streak, history, achievements } = useApp();
  const insets = useSafeAreaInsets();
  const level = profile?.level ?? 'Beginner';
  const nextWorkout = getNextWorkout(history, level);
  const weekActivity = getWeekActivity(history);
  const recent = [...history].reverse().slice(0, 3);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <View style={s.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[s.header, { paddingTop: insets.top + 16 }]}>
          <View style={{ flex: 1 }}>
            <Text style={s.greeting}>
              {greeting()}, {profile?.name?.split(' ')[0] ?? 'Atleta'}! 👋
            </Text>
            {streak.current > 0 && (
              <Text style={s.streakText}>
                🔥 Sequência de <Text style={s.streakNum}>{streak.current} dias</Text>
              </Text>
            )}
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Profile')}
            style={s.avatarBtn}
          >
            <Text style={s.avatarText}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Next workout */}
        <View style={s.sectionHeader}>
          <Text style={[s.sectionLabel, s.sectionLabelFlush]}>PRÓXIMO TREINO</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('WorkoutSelection', { level })}
            activeOpacity={0.75}
            accessibilityRole="button"
          >
            <Text style={s.sectionAction}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={s.quickStartBtn}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Workout', { workoutKey: nextWorkout.key })}
        >
          <Text style={s.quickStartText}>⚡ Iniciar Treino Rápido</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.nextCard}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Workout', { workoutKey: nextWorkout.key })}
        >
          <Text style={s.nextEmoji}>{nextWorkout.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.nextTitle}>{nextWorkout.label}</Text>
            <Text style={s.nextSub}>
              {nextWorkout.focus} · {nextWorkout.exercises.length} exercícios · ~
              {nextWorkout.durationMinutes}min
            </Text>
            <View style={s.exercisePreview}>
              {nextWorkout.exercises.slice(0, 3).map((ex, i) => (
                <Text key={i} style={s.exercisePreviewText}>
                  • {ex.name}
                </Text>
              ))}
              {nextWorkout.exercises.length > 3 && (
                <Text style={s.exercisePreviewText}>+ {nextWorkout.exercises.length - 3} mais</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {/* Week calendar */}
        <Text style={s.sectionLabel}>ESTA SEMANA</Text>
        <View style={s.weekRow}>
          {WEEK_LABELS.map((label, i) => (
            <View key={i} style={s.dayCol}>
              <View style={[s.dayCircle, weekActivity[i] && s.dayCircleActive]}>
                <Text style={[s.dayCheck, weekActivity[i] && s.dayCheckActive]}>
                  {weekActivity[i] ? '✓' : ''}
                </Text>
              </View>
              <Text style={s.dayLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Stats row */}
        <View style={s.statsRow}>
          {[
            { label: 'Treinos', value: String(history.length) },
            { label: 'Melhor streak', value: `🔥 ${streak.best}` },
            { label: 'Conquistas', value: String(achievements.length) },
          ].map(({ label, value }) => (
            <TouchableOpacity
              key={label}
              style={s.statCard}
              activeOpacity={0.7}
              onPress={() =>
                label === 'Conquistas'
                  ? navigation.navigate('Achievements')
                  : navigation.navigate('Progress')
              }
            >
              <Text style={s.statValue}>{value}</Text>
              <Text style={s.statLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent history */}
        {recent.length > 0 && (
          <>
            <Text style={s.sectionLabel}>ÚLTIMOS TREINOS</Text>
            {recent.map((entry) => (
              <View key={entry.id} style={s.recentItem}>
                <View style={s.recentDot} />
                <View style={{ flex: 1 }}>
                  <Text style={s.recentLabel}>{entry.workoutLabel}</Text>
                  <Text style={s.recentSub}>{formatDuration(entry.durationSeconds)}</Text>
                </View>
                <Text style={s.recentDate}>{getRelativeDate(entry.completedAt)}</Text>
              </View>
            ))}
            <TouchableOpacity onPress={() => navigation.navigate('Progress')} style={s.seeAll} activeOpacity={0.7}>
              <Text style={s.seeAllText}>Ver histórico completo →</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, flexDirection: 'column' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 24 },
  greeting: { fontSize: font.xl, fontWeight: '800', color: colors.white },
  streakText: { fontSize: font.sm, color: colors.muted, marginTop: 4 },
  streakNum: { color: colors.green, fontWeight: '700' },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarText: { fontSize: 20 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.muted,
    letterSpacing: 1.5,
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 8,
  },
  sectionLabelFlush: { marginHorizontal: 0, marginBottom: 0, marginTop: 0 },
  sectionAction: { color: colors.green, fontSize: font.sm, fontWeight: '700' },
  quickStartBtn: {
    backgroundColor: colors.green,
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  quickStartText: { color: colors.white, fontWeight: '800', fontSize: font.lg },
  nextCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 20,
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  nextEmoji: { fontSize: 32, marginBottom: 8 },
  nextTitle: { fontSize: font.lg, fontWeight: '700', color: colors.white },
  nextSub: { fontSize: font.sm, color: colors.muted, marginTop: 2, marginBottom: 8 },
  exercisePreview: { marginTop: 8, gap: 4 },
  exercisePreviewText: { fontSize: 12, color: colors.muted },
  startBadge: {
    backgroundColor: colors.green,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  startText: { color: colors.white, fontWeight: '700', fontSize: font.sm },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 24,
  },
  dayCol: { alignItems: 'center', gap: 4 },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayCircleActive: { backgroundColor: colors.green, borderColor: colors.green },
  dayCheck: { fontSize: 14, color: 'transparent' },
  dayCheckActive: { color: colors.white, fontWeight: '900' },
  dayLabel: { fontSize: 11, color: colors.muted },
  statsRow: { flexDirection: 'row', gap: 10, marginHorizontal: 20, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: { fontSize: font.lg, fontWeight: '800', color: colors.white },
  statLabel: { fontSize: 11, color: colors.muted, marginTop: 4 },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
    marginRight: 12,
  },
  recentLabel: { fontSize: font.md, fontWeight: '600', color: colors.white },
  recentSub: { fontSize: font.sm, color: colors.muted, marginTop: 2 },
  recentDate: { fontSize: font.sm, color: colors.muted },
  seeAll: { marginHorizontal: 20, marginTop: 4 },
  seeAllText: { color: colors.green, fontSize: font.sm, fontWeight: '600' },
});

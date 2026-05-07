import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';
import { ACHIEVEMENTS } from '../utils/streak';
import { colors, font } from '../theme';

type Props = BottomTabScreenProps<MainTabParamList, 'Achievements'>;

export default function AchievementsScreen(_props: Props) {
  const { achievements, streak } = useApp();
  const insets = useSafeAreaInsets();
  const unlockedIds = new Set(achievements.map((a) => a.id));

  return (
    <View style={s.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[s.header, { paddingTop: insets.top + 16 }]}>
          <View>
            <Text style={s.title}>Conquistas 🏆</Text>
            <Text style={s.sub}>
              {achievements.length}/{ACHIEVEMENTS.length} desbloqueadas
            </Text>
          </View>
        </View>

        <View style={s.streakCard}>
          <Text style={s.streakEmoji}>🔥</Text>
          <View>
            <Text style={s.streakVal}>{streak.current} dias</Text>
            <Text style={s.streakLabel}>Sequência atual · Melhor: {streak.best} dias</Text>
          </View>
        </View>

        <Text style={s.sectionLabel}>TODAS AS CONQUISTAS</Text>
        {ACHIEVEMENTS.map((a) => {
          const unlocked = unlockedIds.has(a.id);
          const entry = achievements.find((u) => u.id === a.id);
          const progress = Math.min(streak.current / a.requiredStreak, 1);
          return (
            <View key={a.id} style={[s.card, !unlocked && s.cardLocked]}>
              <Text style={[s.emoji, !unlocked && s.emojiLocked]}>{unlocked ? a.emoji : '🔒'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[s.label, !unlocked && s.labelLocked]}>{a.label}</Text>
                <Text style={s.req}>{a.requiredStreak} dias consecutivos</Text>
                {!unlocked && (
                  <View style={s.progressBg}>
                    <View style={[s.progressFill, { width: `${progress * 100}%` }]} />
                  </View>
                )}
                {unlocked && entry?.unlockedAt && (
                  <Text style={s.unlockedDate}>
                    Desbloqueado em {new Date(entry.unlockedAt).toLocaleDateString('pt-BR')}
                  </Text>
                )}
              </View>
              {unlocked && <Text style={s.check}>✅</Text>}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 8 },
  title: { fontSize: font.xl, fontWeight: '800', color: colors.white },
  sub: { fontSize: font.sm, color: colors.muted, marginTop: 4 },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 20,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: colors.green,
    gap: 14,
  },
  streakEmoji: { fontSize: 36 },
  streakVal: { fontSize: font.xl, fontWeight: '800', color: colors.green },
  streakLabel: { fontSize: font.sm, color: colors.muted, marginTop: 2 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.muted,
    letterSpacing: 1.5,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.green,
    gap: 14,
  },
  cardLocked: { borderColor: colors.border, opacity: 0.6 },
  emoji: { fontSize: 32 },
  emojiLocked: { opacity: 0.4 },
  label: { fontSize: font.md, fontWeight: '700', color: colors.white },
  labelLocked: { color: colors.muted },
  req: { fontSize: font.sm, color: colors.muted, marginTop: 2 },
  progressBg: { height: 4, backgroundColor: colors.border, borderRadius: 2, marginTop: 8 },
  progressFill: { height: 4, backgroundColor: colors.green, borderRadius: 2 },
  unlockedDate: { fontSize: 11, color: colors.green, marginTop: 4 },
  check: { fontSize: 20 },
});

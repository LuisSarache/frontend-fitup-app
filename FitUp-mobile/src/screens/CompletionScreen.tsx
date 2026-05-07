import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';
import { formatDuration } from '../utils/history';
import { colors, font } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Completion'>;

export default function CompletionScreen({ navigation, route }: Props) {
  const { workoutKey, workoutLabel, durationSeconds, exercisesTotal } = route.params;
  const { addWorkoutEntry, streak } = useApp();
  const insets = useSafeAreaInsets();
  const savedRef = useRef(false);

  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;
    addWorkoutEntry(workoutKey, workoutLabel, durationSeconds, exercisesTotal);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [addWorkoutEntry, durationSeconds, exercisesTotal, workoutKey, workoutLabel]);

  return (
    <View style={[s.container, { paddingBottom: insets.bottom + 24 }]}>
      <Text style={s.trophy}>🏆</Text>
      <Text style={s.title}>Parabéns!</Text>
      <Text style={s.sub}>Você completou o {workoutLabel} com sucesso!</Text>

      <View style={s.statsRow}>
        {[
          { label: 'Duração', value: formatDuration(durationSeconds) },
          { label: 'Streak', value: `🔥 ${streak.current}` },
          { label: 'Exercícios', value: String(exercisesTotal) },
        ].map(({ label, value }) => (
          <View key={label} style={s.statCard}>
            <Text style={s.statValue}>{value}</Text>
            <Text style={s.statLabel}>{label}</Text>
          </View>
        ))}
      </View>

      <Text style={s.motivational}>
        Cada treino é um passo a mais na sua jornada. Continue assim! 💪
      </Text>

      <TouchableOpacity
        style={s.btn}
        onPress={() =>
          navigation.reset({ index: 0, routes: [{ name: 'MainTabs', params: { screen: 'Home' } }] })
        }
        accessibilityRole="button"
      >
        <Text style={s.btnText}>Finalizar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={s.btnSecondary}
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs', params: { screen: 'Progress' } }],
          })
        }
        accessibilityRole="button"
      >
        <Text style={s.btnSecondaryText}>Ver progresso →</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  trophy: { fontSize: 80, marginBottom: 16 },
  title: { fontSize: font.xxl, fontWeight: '900', color: colors.white, marginBottom: 8 },
  sub: { fontSize: font.md, color: colors.muted, textAlign: 'center', marginBottom: 32 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 32 },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.green,
  },
  statValue: { fontSize: font.sm, fontWeight: '700', color: colors.green },
  statLabel: { fontSize: 11, color: colors.muted, marginTop: 4 },
  motivational: {
    fontSize: font.sm,
    color: colors.muted,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 40,
    lineHeight: 22,
  },
  btn: {
    backgroundColor: colors.green,
    borderRadius: 14,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  btnText: { color: colors.white, fontWeight: '700', fontSize: font.lg },
  btnSecondary: { width: '100%', alignItems: 'center', padding: 12 },
  btnSecondaryText: { color: colors.green, fontWeight: '600', fontSize: font.md },
});

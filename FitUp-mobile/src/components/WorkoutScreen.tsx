import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { RootStackParamList } from '../navigation/types';
import { WORKOUT_MAP } from '../data/workouts';
import { save, load, remove, KEYS } from '../storage/storage';
import { Analytics } from '../services/analytics';
import { RestTimerModal } from './RestTimerModal';
import { useRestTimer } from '../hooks/useRestTimer';
import { colors, font } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Workout'>;

export default function WorkoutScreen({ navigation, route }: Props) {
  const { workoutKey } = route.params;
  const workout = WORKOUT_MAP[workoutKey];
  const insets = useSafeAreaInsets();
  const startTime = useRef(Date.now());
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const timer = useRestTimer(60);

  // Load saved progress
  useEffect(() => {
    load<Record<string, boolean>>(`${KEYS.workoutProgress}:${workoutKey}`).then(saved => {
      if (saved && Object.keys(saved).length > 0) {
        Alert.alert(
          'Continuar treino?',
          'Você tem progresso salvo neste treino.',
          [
            { text: 'Recomeçar', style: 'destructive', onPress: () => remove(`${KEYS.workoutProgress}:${workoutKey}`) },
            { text: 'Continuar', onPress: () => setChecked(saved) },
          ]
        );
      }
    });
    Analytics.workoutStarted(workoutKey);
    startTime.current = Date.now();
  }, [workoutKey]);

  const toggle = useCallback((id: string, name: string, restSeconds: number) => {
    setChecked(prev => {
      const newValue = !prev[id];
      Haptics.impactAsync(newValue ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light);
      const next = { ...prev, [id]: newValue };
      save(`${KEYS.workoutProgress}:${workoutKey}`, next);
      if (newValue) {
        Analytics.exerciseChecked(name, workoutKey);
        timer.start(restSeconds);
      }
      return next;
    });
  }, [workoutKey, timer]);

  const completedCount = Object.values(checked).filter(Boolean).length;
  const total = workout.exercises.length;
  const allDone = completedCount === total;
  const progress = total > 0 ? (completedCount / total) * 100 : 0;

  const handleFinish = async () => {
    const duration = Math.floor((Date.now() - startTime.current) / 1000);
    await remove(`${KEYS.workoutProgress}:${workoutKey}`);
    Analytics.workoutCompleted(workoutKey, duration);
    navigation.navigate('Completion', { workoutKey, workoutLabel: workout.label, durationSeconds: duration });
  };

  const handleBack = () => {
    Analytics.workoutAbandoned(workoutKey, completedCount, total);
    navigation.goBack();
  };

  return (
    <View style={s.container}>
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={handleBack} style={s.backBtn} accessibilityLabel="Voltar" accessibilityRole="button">
          <Text style={s.backText}>‹</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>{workout.label}</Text>
          <Text style={s.sub}>{workout.focus} · ~{workout.durationMinutes}min</Text>
        </View>
        <View style={s.badge}>
          <Text style={s.badgeText}>{completedCount}/{total}</Text>
        </View>
      </View>

      <View style={s.progressBg}>
        <View style={[s.progressFill, { width: `${progress}%` }]} />
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {workout.exercises.map(({ id, name, sets, tip, restSeconds }) => {
          const done = !!checked[id];
          return (
            <TouchableOpacity
              key={id}
              style={[s.card, done && s.cardDone]}
              onPress={() => toggle(id, name, restSeconds)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: done }}
              accessibilityLabel={`${name}, ${sets}`}
            >
              <View style={[s.checkbox, done && s.checkboxDone]}>
                {done && <Text style={s.checkmark}>✓</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.exName, done && s.textDone]}>{name}</Text>
                <Text style={s.sets}>{sets}</Text>
                <Text style={s.tip}>💡 {tip}</Text>
              </View>
              <Text style={s.rest}>⏱ {restSeconds}s</Text>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={[s.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[s.finishBtn, !allDone && s.finishBtnDisabled]}
          onPress={allDone ? handleFinish : () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)}
          accessibilityRole="button"
          accessibilityState={{ disabled: !allDone }}
        >
          <Text style={s.finishText}>
            {allDone ? '🎉 Finalizar Treino' : `Complete todos os exercícios (${completedCount}/${total})`}
          </Text>
        </TouchableOpacity>
      </View>

      <RestTimerModal
        visible={timer.active}
        seconds={timer.seconds}
        totalSeconds={60}
        onSkip={timer.skip}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { marginRight: 12, padding: 4 },
  backText: { color: colors.white, fontSize: 32, lineHeight: 34 },
  title: { fontSize: font.xl, fontWeight: '800', color: colors.white },
  sub: { fontSize: font.sm, color: colors.muted, marginTop: 2 },
  badge: { backgroundColor: colors.card, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: colors.green },
  badgeText: { color: colors.green, fontWeight: '700', fontSize: font.sm },
  progressBg: { height: 4, backgroundColor: colors.card, marginHorizontal: 20, borderRadius: 2, marginBottom: 20 },
  progressFill: { height: 4, backgroundColor: colors.green, borderRadius: 2 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginHorizontal: 20, marginBottom: 12, flexDirection: 'row', alignItems: 'flex-start', borderWidth: 1, borderColor: colors.border },
  cardDone: { borderColor: colors.green, opacity: 0.7 },
  checkbox: { width: 26, height: 26, borderRadius: 8, borderWidth: 2, borderColor: colors.muted, marginRight: 14, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  checkboxDone: { backgroundColor: colors.green, borderColor: colors.green },
  checkmark: { color: colors.white, fontWeight: '900', fontSize: 14 },
  exName: { fontSize: font.md, fontWeight: '700', color: colors.white },
  textDone: { textDecorationLine: 'line-through', color: colors.muted },
  sets: { fontSize: font.sm, color: colors.green, fontWeight: '600', marginTop: 2 },
  tip: { fontSize: 12, color: colors.muted, marginTop: 4 },
  rest: { fontSize: 11, color: colors.muted, marginTop: 2 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 12, backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border },
  finishBtn: { backgroundColor: colors.green, borderRadius: 14, padding: 16, alignItems: 'center' },
  finishBtnDisabled: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  finishText: { color: colors.white, fontWeight: '700', fontSize: font.md },
});

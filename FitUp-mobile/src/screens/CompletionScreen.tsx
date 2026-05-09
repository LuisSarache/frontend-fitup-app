import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  const { addWorkoutEntry, streak, profile } = useApp();
  const insets = useSafeAreaInsets();
  const savedRef = useRef(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const estimatedCalories = Math.round((durationSeconds / 60) * 5 * (profile?.weightKg || 70) * 0.1);

  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;
    addWorkoutEntry(workoutKey, workoutLabel, durationSeconds, exercisesTotal);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🏆 Acabei de completar o ${workoutLabel}!\n⏱️ ${formatDuration(durationSeconds)}\n💪 ${exercisesTotal} exercícios\n🔥 Streak: ${streak.current} dias\n\nTreine comigo no FitUp!`,
      });
    } catch {}
  };

  return (
    <LinearGradient colors={['#0A0A0A', '#111827', '#0A0A0A']} style={{ flex: 1 }}>
      <Animated.View style={[s.container, { paddingBottom: insets.bottom + 24, opacity: fadeAnim }]}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <View style={s.trophyWrapper}>
            <Text style={s.trophy}>🏆</Text>
          </View>
        </Animated.View>
        
        <Text style={s.title}>Parabéns!</Text>
        <Text style={s.sub}>Você completou o {workoutLabel} com sucesso!</Text>

        <View style={s.statsRow}>
          {[
            { label: 'Duração', value: formatDuration(durationSeconds), icon: '⏱️' },
            { label: 'Streak', value: String(streak.current), icon: '🔥' },
            { label: 'Exercícios', value: String(exercisesTotal), icon: '💪' },
            { label: 'Calorias', value: `~${estimatedCalories}`, icon: '⚡' },
          ].map(({ label, value, icon }) => (
            <View key={label} style={s.statCard}>
              <Text style={s.statIcon}>{icon}</Text>
              <Text style={s.statValue}>{value}</Text>
              <Text style={s.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        <View style={s.motivationalCard}>
          <Text style={s.motivational}>
            "Cada treino é um passo a mais na sua jornada. Continue assim! 💪"
          </Text>
        </View>

        <TouchableOpacity
          style={s.btnWrapper}
          activeOpacity={0.9}
          onPress={() =>
            navigation.reset({ index: 0, routes: [{ name: 'MainTabs', params: { screen: 'Home' } }] })
          }
        >
          <LinearGradient colors={['#22C55E', '#16A34A']} style={s.btn}>
            <Text style={s.btnText}>Finalizar</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={s.btnSecondary} activeOpacity={0.8} onPress={handleShare}>
          <Text style={s.btnSecondaryText}>📤 Compartilhar conquista</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.btnSecondary}
          activeOpacity={0.8}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'MainTabs', params: { screen: 'Progress' } }],
            })
          }
        >
          <Text style={s.btnSecondaryText}>Ver progresso →</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  trophyWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(34,197,94,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  trophy: { fontSize: 64 },
  title: { fontSize: font.xxl, fontWeight: '900', color: colors.white, marginBottom: 8 },
  sub: { fontSize: font.md, color: colors.muted, textAlign: 'center', marginBottom: 32 },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  statCard: {
    minWidth: '45%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
  },
  statIcon: { fontSize: 28, marginBottom: 8 },
  statValue: { fontSize: 24, fontWeight: '800', color: colors.green, marginBottom: 4 },
  statLabel: { fontSize: 12, color: colors.muted, fontWeight: '600' },
  motivationalCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  motivational: {
    fontSize: font.sm,
    color: colors.muted,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  btnWrapper: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#22C55E',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },
  btn: {
    height: 62,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: { color: colors.white, fontWeight: '800', fontSize: font.lg },
  btnSecondary: {
    width: '100%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  btnSecondaryText: { color: colors.green, fontWeight: '700', fontSize: font.md },
});

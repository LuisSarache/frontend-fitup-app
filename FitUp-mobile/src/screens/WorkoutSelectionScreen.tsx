import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Play } from 'lucide-react-native';
import { RootStackParamList } from '../navigation/types';
import { getWorkoutsByLevel } from '../data/workouts';
import { colors } from '../theme';
import BackButton from '../components/BackButton';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutSelection'>;

export default function WorkoutSelectionScreen({ navigation, route }: Props) {
  const { level } = route.params;
  const insets = useSafeAreaInsets();
  const workouts = getWorkoutsByLevel(level);

  const levelLabel =
    level === 'Beginner' ? 'Iniciante' : level === 'Intermediate' ? 'Intermediário' : 'Avançado';

  const handleSkip = () => {
    navigation.replace('MainTabs', { screen: 'Home' });
  };

  return (
    <LinearGradient colors={['#0A0A0A', '#111827', '#0A0A0A']} style={s.container}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.backWrapper}>
          <BackButton />
        </View>

        <View style={s.header}>
          <Text style={s.badge}>{levelLabel.toUpperCase()}</Text>
          <Text style={s.title}>Escolha seu{'\n'}treino de hoje 💪</Text>
          <Text style={s.subtitle}>
            {workouts.length} treinos disponíveis para o seu nível.
          </Text>
        </View>

        {workouts.map(({ key, label, focus, emoji, durationMinutes, exercises }) => (
          <TouchableOpacity
            key={key}
            activeOpacity={0.88}
            style={s.card}
            onPress={() => navigation.navigate('Workout', { workoutKey: key })}
            accessibilityRole="button"
            accessibilityLabel={`${label}: ${focus}`}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
              style={s.cardGradient}
            >
              <View style={s.emojiWrapper}>
                <Text style={s.emoji}>{emoji}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={s.cardTitle}>{label}</Text>
                <Text style={s.cardDesc}>{focus}</Text>
                <Text style={s.cardMeta}>
                  {exercises.length} exercícios · ~{durationMinutes}min
                </Text>
              </View>

              <View style={s.playButton}>
                <Play size={20} color="#fff" fill="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}

        {/* SKIP BUTTON */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleSkip}
          style={s.skipButton}
        >
          <Text style={s.skipText}>
            Pular e ir para Home
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  backWrapper: { paddingHorizontal: 24, marginBottom: 20 },
  header: { paddingHorizontal: 24, marginBottom: 34 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(34,197,94,0.12)',
    color: '#4ADE80',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 18,
  },
  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 42,
    marginBottom: 12,
  },
  subtitle: { color: '#9CA3AF', fontSize: 15, lineHeight: 24 },
  card: {
    marginHorizontal: 24,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 18,
    shadowColor: '#22C55E',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  emojiWrapper: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginRight: 18,
  },
  emoji: { fontSize: 34 },
  cardTitle: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 6 },
  cardDesc: { color: '#9CA3AF', fontSize: 14, lineHeight: 22, marginBottom: 8 },
  cardMeta: { color: '#6B7280', fontSize: 12, fontWeight: '600' },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(34,197,94,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 14,
  },
  skipButton: {
    marginHorizontal: 24,
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  skipText: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '600',
  },
});

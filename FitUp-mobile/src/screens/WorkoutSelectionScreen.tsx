import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { getWorkoutsByLevel } from '../data/workouts';
import { colors, font } from '../theme';
import BackButton from '../components/BackButton';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutSelection'>;

export default function WorkoutSelectionScreen({ navigation, route }: Props) {
  const { level } = route.params;
  const insets = useSafeAreaInsets();
  const workouts = getWorkoutsByLevel(level);

  const levelLabel = level === 'Beginner' ? 'Iniciante' : level === 'Intermediate' ? 'Intermediário' : 'Avançado';

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: insets.top + 24 }}>
        <BackButton />
        <Text style={s.title}>Escolha seu{'\n'}treino de hoje 🏠</Text>
        <Text style={s.sub}>Nível: {levelLabel}</Text>

        {workouts.map(({ key, label, focus, emoji, durationMinutes, exercises }) => (
          <TouchableOpacity
            key={key}
            style={s.card}
            onPress={() => navigation.navigate('Workout', { workoutKey: key })}
            accessibilityRole="button"
            accessibilityLabel={`${label}: ${focus}`}
          >
            <Text style={s.emoji}>{emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.cardTitle}>{label}</Text>
              <Text style={s.cardDesc}>{focus}</Text>
              <Text style={s.cardMeta}>{exercises.length} exercícios · ~{durationMinutes}min</Text>
            </View>
            <View style={s.startBadge}>
              <Text style={s.startText}>Iniciar</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  title: { fontSize: font.xl, fontWeight: '800', color: colors.white, marginBottom: 8, lineHeight: 34 },
  sub: { fontSize: font.sm, color: colors.green, marginBottom: 32, fontWeight: '600' },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 14, borderWidth: 1, borderColor: colors.border },
  emoji: { fontSize: 28, marginRight: 14 },
  cardTitle: { fontSize: font.lg, fontWeight: '700', color: colors.white },
  cardDesc: { fontSize: font.sm, color: colors.muted, marginTop: 2 },
  cardMeta: { fontSize: 11, color: colors.muted, marginTop: 4 },
  startBadge: { backgroundColor: colors.green, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  startText: { color: colors.white, fontWeight: '700', fontSize: font.sm },
});

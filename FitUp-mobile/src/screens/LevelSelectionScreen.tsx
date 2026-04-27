import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Analytics } from '../services/analytics';
import { colors, font } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'LevelSelection'>;

const LEVELS = [
  { key: 'Beginner', label: 'Iniciante', emoji: '🌱', desc: 'Nunca treinou ou está voltando' },
  { key: 'Intermediate', label: 'Intermediário', emoji: '🔥', desc: 'Já treina há alguns meses' },
  { key: 'Advanced', label: 'Avançado', emoji: '⚡', desc: 'Treina consistentemente há mais de 1 ano' },
] as const;

export default function LevelSelectionScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const handleSelect = (key: typeof LEVELS[number]['key']) => {
    Analytics.levelSelected(key);
    navigation.navigate('WorkoutSelection', { level: key });
  };

  return (
    <View style={[s.container, { paddingTop: insets.top + 24 }]}>
      <Text style={s.title}>Qual é o seu{'\n'}nível atual? 🎯</Text>
      <Text style={s.sub}>Escolha com honestidade para melhores resultados</Text>

      {LEVELS.map(({ key, label, emoji, desc }) => (
        <TouchableOpacity key={key} style={s.card} onPress={() => handleSelect(key)}
          accessibilityRole="button" accessibilityLabel={`${label}: ${desc}`}>
          <Text style={s.emoji}>{emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.cardTitle}>{label}</Text>
            <Text style={s.cardDesc}>{desc}</Text>
          </View>
          <Text style={s.arrow}>›</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 24 },
  title: { fontSize: font.xl, fontWeight: '800', color: colors.white, marginBottom: 8, lineHeight: 34 },
  sub: { fontSize: font.sm, color: colors.muted, marginBottom: 32 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 14, borderWidth: 1, borderColor: colors.border },
  emoji: { fontSize: 28, marginRight: 14 },
  cardTitle: { fontSize: font.lg, fontWeight: '700', color: colors.white },
  cardDesc: { fontSize: font.sm, color: colors.muted, marginTop: 2 },
  arrow: { color: colors.green, fontSize: 20 },
});

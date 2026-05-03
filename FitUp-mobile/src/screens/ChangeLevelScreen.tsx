import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';
import { WorkoutLevel } from '../types';
import BackButton from '../components/BackButton';
import { colors, font } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ChangeLevel'>;

const LEVELS: { key: WorkoutLevel; label: string; emoji: string; desc: string }[] = [
  { key: 'Beginner', label: 'Iniciante', emoji: '🌱', desc: 'Nunca treinou ou está voltando' },
  { key: 'Intermediate', label: 'Intermediário', emoji: '🔥', desc: 'Já treina há alguns meses' },
  { key: 'Advanced', label: 'Avançado', emoji: '⚡', desc: 'Treina consistentemente há mais de 1 ano' },
];

export default function ChangeLevelScreen({ navigation }: Props) {
  const { profile, setLevel } = useApp();
  const insets = useSafeAreaInsets();

  const handleSelect = (key: WorkoutLevel) => {
    if (key === profile?.level) { navigation.goBack(); return; }
    Alert.alert(
      'Mudar nível',
      `Deseja mudar para ${LEVELS.find(l => l.key === key)?.label}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: async () => { await setLevel(key); navigation.goBack(); } },
      ]
    );
  };

  return (
    <View style={[s.container, { paddingTop: insets.top + 24 }]}>
      <View style={s.header}>
        <BackButton />
        <Text style={s.title}>Nível de treino</Text>
      </View>
      <Text style={s.sub}>Nível atual: <Text style={s.current}>{LEVELS.find(l => l.key === profile?.level)?.label}</Text></Text>

      {LEVELS.map(({ key, label, emoji, desc }) => {
        const active = profile?.level === key;
        return (
          <TouchableOpacity key={key} style={[s.card, active && s.cardActive]} onPress={() => handleSelect(key)}>
            <Text style={s.emoji}>{emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[s.cardTitle, active && s.cardTitleActive]}>{label}</Text>
              <Text style={s.cardDesc}>{desc}</Text>
            </View>
            {active && <Text style={s.check}>✓</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 24 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: font.xl, fontWeight: '800', color: colors.white },
  sub: { fontSize: font.sm, color: colors.muted, marginBottom: 32 },
  current: { color: colors.green, fontWeight: '700' },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 14, borderWidth: 1, borderColor: colors.border },
  cardActive: { borderColor: colors.green },
  emoji: { fontSize: 28, marginRight: 14 },
  cardTitle: { fontSize: font.lg, fontWeight: '700', color: colors.white },
  cardTitleActive: { color: colors.green },
  cardDesc: { fontSize: font.sm, color: colors.muted, marginTop: 2 },
  check: { color: colors.green, fontSize: 20, fontWeight: '900' },
});

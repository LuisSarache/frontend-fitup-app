import React from 'react';
import { Alert, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Check } from 'lucide-react-native';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';
import { WorkoutLevel } from '../types';
import BackButton from '../components/BackButton';
import api from '../services/api';
import { env } from '../config/env';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ChangeLevel'>;

const LEVELS: { key: WorkoutLevel; label: string; emoji: string; desc: string }[] = [
  { key: 'Beginner', label: 'Iniciante', emoji: '🌱', desc: 'Nunca treinou ou está voltando' },
  { key: 'Intermediate', label: 'Intermediário', emoji: '🔥', desc: 'Já treina há alguns meses' },
  {
    key: 'Advanced',
    label: 'Avançado',
    emoji: '⚡',
    desc: 'Treina consistentemente há mais de 1 ano',
  },
];

export default function ChangeLevelScreen({ navigation }: Props) {
  const { profile, setLevel } = useApp();
  const insets = useSafeAreaInsets();

  const handleSelect = async (key: WorkoutLevel) => {
    if (!profile) return;
    if (key === profile.level) {
      navigation.goBack();
      return;
    }
    try {
      if (!env.useMock) {
        await api.put('/profile/level', { level: key });
      }

      await setLevel(key);
      navigation.goBack();
    } catch (err) {
      console.error('[ChangeLevel] Failed to sync level:', err);
      Alert.alert('Erro', 'Nao foi possivel salvar o nivel. Tente novamente.');
    }
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
          <Text style={s.badge}>CONFIGURAÇÕES</Text>
          <Text style={s.title}>Nível de{'\n'}treino 🎯</Text>
          <Text style={s.subtitle}>
            Nível atual:{' '}
            <Text style={s.current}>{LEVELS.find((l) => l.key === profile?.level)?.label}</Text>
          </Text>
        </View>

        {LEVELS.map(({ key, label, emoji, desc }) => {
          const active = profile?.level === key;
          return (
            <TouchableOpacity
              key={key}
              activeOpacity={0.88}
              style={s.card}
              onPress={() => handleSelect(key)}
              disabled={active}
            >
              <LinearGradient
                colors={
                  active
                    ? ['rgba(34,197,94,0.15)', 'rgba(34,197,94,0.05)']
                    : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']
                }
                style={s.cardGradient}
              >
                <View style={s.emojiWrapper}>
                  <Text style={s.emoji}>{emoji}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[s.cardTitle, active && s.cardTitleActive]}>{label}</Text>
                  <Text style={s.cardDesc}>{desc}</Text>
                </View>

                {active && (
                  <View style={s.checkCircle}>
                    <Check size={20} color="#fff" strokeWidth={3} />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
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
  current: { color: colors.green, fontWeight: '700' },
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
  cardTitleActive: { color: colors.green },
  cardDesc: { color: '#9CA3AF', fontSize: 14, lineHeight: 22 },
  checkCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 14,
  },
});

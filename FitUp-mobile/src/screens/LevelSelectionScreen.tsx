import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/types';

import { useApp } from '../context/AppContext';

import { Analytics } from '../services/analytics';

import BackButton from '../components/BackButton';
import api from '../services/api';
import { env } from '../config/env';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'LevelSelection'
>;

const LEVELS = [
  {
    key: 'Beginner',
    label: 'Iniciante',
    emoji: '🌱',
    desc: 'Nunca treinou ou está voltando',
  },

  {
    key: 'Intermediate',
    label: 'Intermediário',
    emoji: '🔥',
    desc: 'Já treina há alguns meses',
  },

  {
    key: 'Advanced',
    label: 'Avançado',
    emoji: '⚡',
    desc:
      'Treina consistentemente há mais de 1 ano',
  },
] as const;

export default function LevelSelectionScreen({
  navigation,
}: Props) {
  const { setLevel } = useApp();

  const insets = useSafeAreaInsets();

  const handleSelect = async (
    key: (typeof LEVELS)[number]['key']
  ) => {
    Analytics.levelSelected(key);

    await setLevel(key);

    if (!env.useMock) {
      try {
        await api.put('/profile/level', { level: key });
      } catch (err) {
        console.error('[LevelSelection] Failed to sync level:', err);
      }
    }

    navigation.navigate(
      'WorkoutSelection',
      {
        level: key,
      }
    );
  };

  return (
    <LinearGradient
      colors={['#0A0A0A', '#111827', '#0A0A0A']}
      style={s.container}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* BACK */}
        <View style={s.backWrapper}>
          <BackButton />
        </View>

        {/* HEADER */}
        <View style={s.header}>
          <Text style={s.badge}>
            PERSONALIZAÇÃO
          </Text>

          <Text style={s.title}>
            Qual é o seu{"\n"}nível atual?
            🎯
          </Text>

          <Text style={s.subtitle}>
            Escolha seu nível para
            receber treinos ideais para
            você.
          </Text>
        </View>

        {/* LEVELS */}
        {LEVELS.map(
          ({
            key,
            label,
            emoji,
            desc,
          }) => (
            <TouchableOpacity
              key={key}
              activeOpacity={0.88}
              style={s.card}
              onPress={() =>
                handleSelect(key)
              }
              accessibilityRole="button"
              accessibilityLabel={`${label}: ${desc}`}
            >
              <View style={s.cardContent}>
                <View
                  style={s.emojiWrapper}
                >
                  <Text
                    style={s.emoji}
                  >
                    {emoji}
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <Text
                    style={
                      s.cardTitle
                    }
                  >
                    {label}
                  </Text>

                  <Text
                    style={
                      s.cardDesc
                    }
                  >
                    {desc}
                  </Text>
                </View>

                <View
                  style={s.arrowCircle}
                >
                  <Text
                    style={s.arrow}
                  >
                    →
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )
        )}

        {/* FOOTER */}
        <View style={s.footer}>
          <Text style={s.footerText}>
            Você poderá alterar isso
            depois no perfil ⚙️
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },

  backWrapper: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },

  header: {
    paddingHorizontal: 24,
    marginBottom: 34,
  },

  badge: {
    alignSelf: 'flex-start',

    backgroundColor:
      'rgba(34,197,94,0.12)',

    color: '#4ADE80',

    paddingHorizontal: 14,
    paddingVertical: 8,

    borderRadius: 999,

    overflow: 'hidden',

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

  subtitle: {
    color: '#9CA3AF',

    fontSize: 15,

    lineHeight: 24,
  },

  card: {
    marginHorizontal: 24,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 18,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 22,
  },

  emojiWrapper: {
    width: 72,
    height: 72,

    borderRadius: 24,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor:
      'rgba(255,255,255,0.06)',

    marginRight: 18,
  },

  emoji: {
    fontSize: 34,
  },

  cardTitle: {
    color: '#fff',

    fontSize: 22,

    fontWeight: '800',

    marginBottom: 6,
  },

  cardDesc: {
    color: '#9CA3AF',

    fontSize: 14,

    lineHeight: 22,
  },

  arrowCircle: {
    width: 42,
    height: 42,

    borderRadius: 21,

    backgroundColor:
      'rgba(34,197,94,0.14)',

    justifyContent: 'center',
    alignItems: 'center',

    marginLeft: 14,
  },

  arrow: {
    color: '#4ADE80',

    fontSize: 22,

    fontWeight: '800',
  },

  footer: {
    marginTop: 12,
    paddingHorizontal: 24,
  },

  footerText: {
    color: '#6B7280',

    fontSize: 13,

    textAlign: 'center',

    lineHeight: 22,
  },
});

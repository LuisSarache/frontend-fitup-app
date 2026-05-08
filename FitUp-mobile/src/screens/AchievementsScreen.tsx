import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { MainTabParamList } from '../navigation/types';

import { useApp } from '../context/AppContext';

import { ACHIEVEMENTS } from '../utils/streak';

type Props = BottomTabScreenProps<
  MainTabParamList,
  'Achievements'
>;

export default function AchievementsScreen(
  _props: Props
) {
  const { achievements, streak } =
    useApp();

  const insets =
    useSafeAreaInsets();

  const unlockedIds = new Set(
    achievements.map((a) => a.id)
  );

  return (
    <LinearGradient
      colors={[
        '#0A0A0A',
        '#111827',
        '#0A0A0A',
      ]}
      style={s.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom:
            insets.bottom + 40,
        }}
      >
        {/* HEADER */}
        <View
          style={[
            s.header,
            {
              paddingTop:
                insets.top + 20,
            },
          ]}
        >
          <Text style={s.title}>
            Conquistas 🏆
          </Text>

          <Text style={s.subtitle}>
            {achievements.length}/
            {ACHIEVEMENTS.length}{' '}
            desbloqueadas
          </Text>
        </View>

        {/* STREAK CARD */}
        <LinearGradient
          colors={[
            '#22C55E',
            '#16A34A',
          ]}
          style={s.streakCard}
        >
          <View style={s.streakEmojiBox}>
            <Text
              style={s.streakEmoji}
            >
              🔥
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={s.streakVal}>
              {streak.current} dias
            </Text>

            <Text
              style={s.streakLabel}
            >
              Sequência atual
            </Text>

            <Text
              style={
                s.streakBest
              }
            >
              Melhor streak:{' '}
              {streak.best} dias
            </Text>
          </View>
        </LinearGradient>

        {/* SECTION */}
        <Text style={s.sectionLabel}>
          TODAS AS CONQUISTAS
        </Text>

        {ACHIEVEMENTS.map((a) => {
          const unlocked =
            unlockedIds.has(a.id);

          const entry =
            achievements.find(
              (u) => u.id === a.id
            );

          const progress =
            Math.min(
              streak.current /
                a.requiredStreak,
              1
            );

          return (
            <View
              key={a.id}
              style={[
                s.card,

                !unlocked &&
                  s.cardLocked,
              ]}
            >
              {/* ICON */}
              <View
                style={[
                  s.iconWrapper,

                  !unlocked &&
                    s.iconWrapperLocked,
                ]}
              >
                <Text
                  style={[
                    s.emoji,

                    !unlocked &&
                      s.emojiLocked,
                  ]}
                >
                  {unlocked
                    ? a.emoji
                    : '🔒'}
                </Text>
              </View>

              {/* INFO */}
              <View
                style={{
                  flex: 1,
                }}
              >
                <Text
                  style={[
                    s.label,

                    !unlocked &&
                      s.labelLocked,
                  ]}
                >
                  {a.label}
                </Text>

                <Text style={s.req}>
                  {
                    a.requiredStreak
                  }{' '}
                  dias consecutivos
                </Text>

                {!unlocked && (
                  <>
                    <View
                      style={
                        s.progressBg
                      }
                    >
                      <View
                        style={[
                          s.progressFill,

                          {
                            width: `${
                              progress *
                              100
                            }%`,
                          },
                        ]}
                      />
                    </View>

                    <Text
                      style={
                        s.progressText
                      }
                    >
                      {Math.round(
                        progress * 100
                      )}
                      % concluído
                    </Text>
                  </>
                )}

                {unlocked &&
                  entry?.unlockedAt && (
                    <Text
                      style={
                        s.unlockedDate
                      }
                    >
                      Desbloqueado em{' '}
                      {new Date(
                        entry.unlockedAt
                      ).toLocaleDateString(
                        'pt-BR'
                      )}
                    </Text>
                  )}
              </View>

              {unlocked && (
                <View
                  style={s.checkBadge}
                >
                  <Text
                    style={
                      s.check
                    }
                  >
                    ✓
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },

  title: {
    color: '#fff',

    fontSize: 34,

    fontWeight: '800',
  },

  subtitle: {
    color: '#9CA3AF',

    fontSize: 15,

    marginTop: 8,
  },

  streakCard: {
    flexDirection: 'row',

    alignItems: 'center',

    marginHorizontal: 24,

    marginBottom: 30,

    borderRadius: 30,

    padding: 24,

    shadowColor: '#22C55E',
    shadowOpacity: 0.3,
    shadowRadius: 20,

    elevation: 10,
  },

  streakEmojiBox: {
    width: 72,
    height: 72,

    borderRadius: 24,

    backgroundColor:
      'rgba(255,255,255,0.18)',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 18,
  },

  streakEmoji: {
    fontSize: 38,
  },

  streakVal: {
    color: '#fff',

    fontSize: 32,

    fontWeight: '800',
  },

  streakLabel: {
    color:
      'rgba(255,255,255,0.88)',

    fontSize: 14,

    marginTop: 2,
  },

  streakBest: {
    color:
      'rgba(255,255,255,0.75)',

    fontSize: 13,

    marginTop: 6,
  },

  sectionLabel: {
    color: '#9CA3AF',

    fontSize: 12,

    fontWeight: '700',

    letterSpacing: 1.5,

    marginHorizontal: 24,

    marginBottom: 16,
  },

  card: {
    flexDirection: 'row',

    alignItems: 'center',

    marginHorizontal: 24,

    marginBottom: 16,

    padding: 18,

    borderRadius: 28,

    backgroundColor:
      'rgba(255,255,255,0.04)',

    borderWidth: 1,

    borderColor:
      'rgba(34,197,94,0.24)',
  },

  cardLocked: {
    borderColor:
      'rgba(255,255,255,0.06)',

    opacity: 0.72,
  },

  iconWrapper: {
    width: 70,
    height: 70,

    borderRadius: 22,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor:
      'rgba(34,197,94,0.14)',

    marginRight: 16,
  },

  iconWrapperLocked: {
    backgroundColor:
      'rgba(255,255,255,0.05)',
  },

  emoji: {
    fontSize: 34,
  },

  emojiLocked: {
    opacity: 0.45,
  },

  label: {
    color: '#fff',

    fontSize: 18,

    fontWeight: '800',
  },

  labelLocked: {
    color: '#D1D5DB',
  },

  req: {
    color: '#9CA3AF',

    fontSize: 13,

    marginTop: 6,
  },

  progressBg: {
    height: 8,

    borderRadius: 999,

    backgroundColor:
      'rgba(255,255,255,0.08)',

    marginTop: 14,

    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',

    borderRadius: 999,

    backgroundColor: '#22C55E',
  },

  progressText: {
    color: '#6EE7B7',

    fontSize: 12,

    fontWeight: '700',

    marginTop: 8,
  },

  unlockedDate: {
    color: '#4ADE80',

    fontSize: 12,

    marginTop: 10,

    fontWeight: '600',
  },

  checkBadge: {
    width: 34,
    height: 34,

    borderRadius: 999,

    backgroundColor:
      'rgba(34,197,94,0.18)',

    justifyContent: 'center',
    alignItems: 'center',

    marginLeft: 12,
  },

  check: {
    color: '#4ADE80',

    fontSize: 18,

    fontWeight: '900',
  },
});
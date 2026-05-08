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

import { CompositeScreenProps } from '@react-navigation/native';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  MainTabParamList,
  RootStackParamList,
} from '../navigation/types';

import { useApp } from '../context/AppContext';

import { getNextWorkout } from '../data/workouts';

import {
  getWeekActivity,
  getRelativeDate,
  formatDuration,
} from '../utils/history';

import { colors } from '../theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<
    MainTabParamList,
    'Home'
  >,
  NativeStackScreenProps<RootStackParamList>
>;

const WEEK_LABELS = [
  'D',
  'S',
  'T',
  'Q',
  'Q',
  'S',
  'S',
];

export default function HomeScreen({
  navigation,
}: Props) {
  const {
    profile,
    streak,
    history,
    achievements,
  } = useApp();

  const insets = useSafeAreaInsets();

  const level =
    profile?.level ?? 'Beginner';

  const nextWorkout = getNextWorkout(
    history,
    level
  );

  const weekActivity =
    getWeekActivity(history);

  const recent = [...history]
    .reverse()
    .slice(0, 3);

  const greeting = () => {
    const h = new Date().getHours();

    if (h < 12) return 'Bom dia';

    if (h < 18) return 'Boa tarde';

    return 'Boa noite';
  };

  return (
    <LinearGradient
      colors={['#0A0A0A', '#111827', '#0A0A0A']}
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
          <View style={{ flex: 1 }}>
            <Text style={s.greeting}>
              {greeting()},{' '}
              {profile?.name?.split(
                ' '
              )[0] ?? 'Atleta'}{' '}
              👋
            </Text>

            <Text style={s.subGreeting}>
              Continue evoluindo hoje
              💪
            </Text>

            {streak.current > 0 && (
              <View
                style={s.streakBadge}
              >
                <Text
                  style={s.streakText}
                >
                  🔥 {streak.current}{' '}
                  dias seguidos
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={s.avatarBtn}
            onPress={() =>
              navigation.navigate(
                'Profile'
              )
            }
          >
            <Text style={s.avatarText}>
              👤
            </Text>
          </TouchableOpacity>
        </View>

        {/* HERO */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={s.heroCard}
          onPress={() =>
            navigation.navigate(
              'Workout',
              {
                workoutKey:
                  nextWorkout.key,
              }
            )
          }
        >
          <LinearGradient
            colors={[
              '#22C55E',
              '#16A34A',
            ]}
            style={s.heroGradient}
          >
            <Text style={s.heroBadge}>
              PRÓXIMO TREINO
            </Text>

            <Text style={s.heroEmoji}>
              {nextWorkout.emoji}
            </Text>

            <Text style={s.heroTitle}>
              {nextWorkout.label}
            </Text>

            <Text style={s.heroSub}>
              {nextWorkout.focus} •{' '}
              {
                nextWorkout.exercises
                  .length
              }{' '}
              exercícios • ~
              {
                nextWorkout.durationMinutes
              }
              min
            </Text>

            <View
              style={s.heroButton}
            >
              <Text
                style={
                  s.heroButtonText
                }
              >
                Iniciar agora →
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* WEEK */}
        <Text style={s.sectionLabel}>
          ATIVIDADE SEMANAL
        </Text>

        <View style={s.weekCard}>
          <View style={s.weekRow}>
            {WEEK_LABELS.map(
              (label, i) => (
                <View
                  key={i}
                  style={s.dayCol}
                >
                  <View
                    style={[
                      s.dayCircle,
                      weekActivity[
                        i
                      ] &&
                        s.dayCircleActive,
                    ]}
                  >
                    <Text
                      style={[
                        s.dayCheck,
                        weekActivity[
                          i
                        ] &&
                          s.dayCheckActive,
                      ]}
                    >
                      {weekActivity[
                        i
                      ]
                        ? '✓'
                        : ''}
                    </Text>
                  </View>

                  <Text
                    style={s.dayLabel}
                  >
                    {label}
                  </Text>
                </View>
              )
            )}
          </View>
        </View>

        {/* STATS */}
        <Text style={s.sectionLabel}>
          SEU PROGRESSO
        </Text>

        <View style={s.statsRow}>
          {[
            {
              label: 'Treinos',
              value: String(
                history.length
              ),
            },

            {
              label: 'Streak',
              value: `🔥 ${streak.best}`,
            },

            {
              label: 'Conquistas',
              value: String(
                achievements.length
              ),
            },
          ].map(
            ({ label, value }) => (
              <TouchableOpacity
                key={label}
                activeOpacity={0.8}
                style={s.statCard}
                onPress={() =>
                  label ===
                  'Conquistas'
                    ? navigation.navigate(
                        'Achievements'
                      )
                    : navigation.navigate(
                        'Progress'
                      )
                }
              >
                <Text
                  style={
                    s.statValue
                  }
                >
                  {value}
                </Text>

                <Text
                  style={
                    s.statLabel
                  }
                >
                  {label}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* RECENT */}
        {recent.length > 0 && (
          <>
            <Text
              style={
                s.sectionLabel
              }
            >
              ÚLTIMOS TREINOS
            </Text>

            {recent.map(
              (entry) => (
                <View
                  key={entry.id}
                  style={
                    s.recentItem
                  }
                >
                  <View
                    style={
                      s.recentDot
                    }
                  />

                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text
                      style={
                        s.recentLabel
                      }
                    >
                      {
                        entry.workoutLabel
                      }
                    </Text>

                    <Text
                      style={
                        s.recentSub
                      }
                    >
                      {formatDuration(
                        entry.durationSeconds
                      )}
                    </Text>
                  </View>

                  <Text
                    style={
                      s.recentDate
                    }
                  >
                    {getRelativeDate(
                      entry.completedAt
                    )}
                  </Text>
                </View>
              )
            )}

            <TouchableOpacity
              activeOpacity={0.8}
              style={s.historyBtn}
              onPress={() =>
                navigation.navigate(
                  'Progress'
                )
              }
            >
              <Text
                style={
                  s.historyBtnText
                }
              >
                Ver histórico
                completo →
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 30,
  },

  greeting: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
  },

  subGreeting: {
    color: '#9CA3AF',
    fontSize: 15,
    marginTop: 6,
  },

  streakBadge: {
    alignSelf: 'flex-start',

    backgroundColor:
      'rgba(34,197,94,0.14)',

    paddingHorizontal: 14,
    paddingVertical: 8,

    borderRadius: 999,

    marginTop: 14,
  },

  streakText: {
    color: '#4ADE80',
    fontWeight: '700',
    fontSize: 13,
  },

  avatarBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,

    backgroundColor:
      'rgba(255,255,255,0.05)',

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.08)',
  },

  avatarText: {
    fontSize: 22,
  },

  heroCard: {
    marginHorizontal: 24,

    borderRadius: 32,

    overflow: 'hidden',

    marginBottom: 28,

    shadowColor: '#22C55E',
    shadowOpacity: 0.35,
    shadowRadius: 24,

    elevation: 12,
  },

  heroGradient: {
    padding: 26,
  },

  heroBadge: {
    color:
      'rgba(255,255,255,0.8)',

    fontWeight: '700',

    letterSpacing: 1,

    fontSize: 12,
  },

  heroEmoji: {
    fontSize: 48,
    marginTop: 14,
  },

  heroTitle: {
    color: '#fff',

    fontSize: 30,

    fontWeight: '800',

    marginTop: 12,
  },

  heroSub: {
    color:
      'rgba(255,255,255,0.85)',

    marginTop: 8,

    fontSize: 15,
  },

  heroButton: {
    marginTop: 24,

    backgroundColor:
      'rgba(255,255,255,0.16)',

    alignSelf: 'flex-start',

    paddingHorizontal: 18,
    paddingVertical: 12,

    borderRadius: 999,
  },

  heroButtonText: {
    color: '#fff',
    fontWeight: '700',
  },

  sectionLabel: {
    color: '#9CA3AF',

    fontSize: 12,

    fontWeight: '700',

    letterSpacing: 1.5,

    marginBottom: 14,

    marginHorizontal: 24,
  },

  weekCard: {
    marginHorizontal: 24,

    backgroundColor:
      'rgba(255,255,255,0.04)',

    borderRadius: 24,

    padding: 20,

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.06)',

    marginBottom: 28,
  },

  weekRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
  },

  dayCol: {
    alignItems: 'center',
  },

  dayCircle: {
    width: 42,
    height: 42,

    borderRadius: 21,

    backgroundColor:
      'rgba(255,255,255,0.05)',

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 8,
  },

  dayCircleActive: {
    backgroundColor: '#22C55E',
  },

  dayCheck: {
    color: 'transparent',
    fontWeight: '900',
  },

  dayCheckActive: {
    color: '#fff',
  },

  dayLabel: {
    color: '#9CA3AF',
    fontSize: 12,
  },

  statsRow: {
    flexDirection: 'row',

    gap: 12,

    marginHorizontal: 24,

    marginBottom: 28,
  },

  statCard: {
    flex: 1,

    backgroundColor:
      'rgba(255,255,255,0.04)',

    borderRadius: 22,

    paddingVertical: 22,

    alignItems: 'center',

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.06)',
  },

  statValue: {
    color: '#fff',

    fontSize: 24,

    fontWeight: '800',
  },

  statLabel: {
    color: '#9CA3AF',

    marginTop: 8,

    fontSize: 12,
  },

  recentItem: {
    flexDirection: 'row',

    alignItems: 'center',

    marginHorizontal: 24,

    marginBottom: 14,

    backgroundColor:
      'rgba(255,255,255,0.04)',

    borderRadius: 20,

    padding: 18,

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.06)',
  },

  recentDot: {
    width: 10,
    height: 10,

    borderRadius: 999,

    backgroundColor: '#22C55E',

    marginRight: 14,
  },

  recentLabel: {
    color: '#fff',

    fontSize: 16,

    fontWeight: '700',
  },

  recentSub: {
    color: '#9CA3AF',

    marginTop: 4,

    fontSize: 13,
  },

  recentDate: {
    color: '#9CA3AF',

    fontSize: 12,
  },

  historyBtn: {
    marginHorizontal: 24,
    marginTop: 6,
  },

  historyBtnText: {
    color: '#22C55E',
    fontWeight: '700',
    fontSize: 14,
  },
});
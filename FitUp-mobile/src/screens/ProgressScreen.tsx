import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { Dumbbell } from 'lucide-react-native';

import { MainTabParamList } from '../navigation/types';

import { useApp } from '../context/AppContext';

import {
  groupByDate,
  formatDuration,
  getWeekActivity,
} from '../utils/history';

import { EmptyState } from '../components/ui';

type Props = BottomTabScreenProps<
  MainTabParamList,
  'Progress'
>;

const WEEK_LABELS = [
  'Dom',
  'Seg',
  'Ter',
  'Qua',
  'Qui',
  'Sex',
  'Sáb',
];

export default function ProgressScreen(
  _props: Props
) {
  const { history, streak } =
    useApp();

  const insets =
    useSafeAreaInsets();

  const [filter, setFilter] =
    useState<
      'all' | 'week' | 'month'
    >('all');

  const [refreshing, setRefreshing] =
    useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    setRefreshing(false);
  };

  const filteredHistory =
    history.filter((entry) => {
      if (filter === 'all')
        return true;

      const entryDate = new Date(
        entry.completedAt
      );

      const now = new Date();

      if (filter === 'week') {
        const weekAgo = new Date(
          now.getTime() -
            7 *
              24 *
              60 *
              60 *
              1000
        );

        return entryDate >= weekAgo;
      }

      if (filter === 'month') {
        const monthAgo =
          new Date(
            now.getTime() -
              30 *
                24 *
                60 *
                60 *
                1000
          );

        return entryDate >= monthAgo;
      }

      return true;
    });

  const grouped = groupByDate(
    [...filteredHistory].reverse()
  );

  const weekActivity =
    getWeekActivity(history);

  const avgDuration =
    filteredHistory.length > 0
      ? Math.round(
          filteredHistory.reduce(
            (s, e) =>
              s + e.durationSeconds,
            0
          ) /
            filteredHistory.length /
            60
        )
      : 0;

  const totalMinutes = Math.round(
    filteredHistory.reduce(
      (s, e) =>
        s + e.durationSeconds,
      0
    ) / 60
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#22C55E"
          />
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
            Meu progresso 📈
          </Text>

          <Text style={s.subtitle}>
            Veja sua evolução nos
            treinos
          </Text>
        </View>

        {/* STATS */}
        <View style={s.statsGrid}>
          {[
            {
              label: 'Treinos',
              value: String(
                filteredHistory.length
              ),
            },

            {
              label: 'Streak',
              value: `🔥 ${streak.current}`,
            },

            {
              label: 'Média',
              value: `${avgDuration}min`,
            },

            {
              label: 'Total',
              value: `${totalMinutes}min`,
            },
          ].map(
            ({ label, value }) => (
              <View
                key={label}
                style={s.statCard}
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
              </View>
            )
          )}
        </View>

        {/* FILTERS */}
        <View style={s.filterRow}>
          {[
            {
              key: 'all',
              label: 'Todos',
            },

            {
              key: 'week',
              label: 'Semana',
            },

            {
              key: 'month',
              label: 'Mês',
            },
          ].map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              activeOpacity={0.8}
              style={[
                s.filterBtn,

                filter === key &&
                  s.filterBtnActive,
              ]}
              onPress={() =>
                setFilter(key as any)
              }
            >
              <Text
                style={[
                  s.filterText,

                  filter === key &&
                    s.filterTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* WEEK CHART */}
        <Text style={s.sectionLabel}>
          FREQUÊNCIA SEMANAL
        </Text>

        <View style={s.chartCard}>
          <View style={s.chartRow}>
            {WEEK_LABELS.map(
              (label, i) => (
                <View
                  key={i}
                  style={s.barCol}
                >
                  <View
                    style={s.barBg}
                  >
                    <View
                      style={[
                        s.barFill,

                        weekActivity[
                          i
                        ] &&
                          s.barFillActive,
                      ]}
                    />
                  </View>

                  <Text
                    style={s.barLabel}
                  >
                    {label}
                  </Text>
                </View>
              )
            )}
          </View>
        </View>

        {/* HISTORY */}
        <Text style={s.sectionLabel}>
          HISTÓRICO
        </Text>

        {Object.keys(grouped)
          .length === 0 && (
          <View style={s.emptyCard}>
            <EmptyState
              icon={
                <Dumbbell
                  color="#22C55E"
                  size={22}
                />
              }
              title="Nenhum treino ainda"
              description="Quando você finalizar o primeiro treino, seu progresso aparecerá aqui."
            />
          </View>
        )}

        {Object.entries(grouped).map(
          ([date, entries]) => (
            <View key={date}>
              <Text
                style={s.dateHeader}
              >
                {date}
              </Text>

              {entries.map((entry) => (
                <View
                  key={entry.id}
                  style={s.entryCard}
                >
                  <View
                    style={s.entryDot}
                  />

                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text
                      style={
                        s.entryLabel
                      }
                    >
                      {
                        entry.workoutLabel
                      }
                    </Text>

                    <Text
                      style={
                        s.entrySub
                      }
                    >
                      {formatDuration(
                        entry.durationSeconds
                      )}{' '}
                      •{' '}
                      {
                        entry.exercisesTotal
                      }{' '}
                      exercícios
                    </Text>
                  </View>

                  <Text
                    style={
                      s.entryCheck
                    }
                  >
                    ✅
                  </Text>
                </View>
              ))}
            </View>
          )
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

  statsGrid: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    gap: 14,

    marginHorizontal: 24,

    marginBottom: 30,
  },

  statCard: {
    width: '47%',

    backgroundColor:
      'rgba(255,255,255,0.04)',

    borderRadius: 24,

    paddingVertical: 24,

    alignItems: 'center',

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.06)',
  },

  statValue: {
    color: '#fff',

    fontSize: 28,

    fontWeight: '800',
  },

  statLabel: {
    color: '#9CA3AF',

    marginTop: 8,

    fontSize: 13,
  },

  filterRow: {
    flexDirection: 'row',

    gap: 10,

    marginHorizontal: 24,

    marginBottom: 28,
  },

  filterBtn: {
    flex: 1,

    backgroundColor:
      'rgba(255,255,255,0.04)',

    borderRadius: 14,

    paddingVertical: 14,

    alignItems: 'center',

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.06)',
  },

  filterBtnActive: {
    backgroundColor:
      'rgba(34,197,94,0.18)',

    borderColor:
      'rgba(34,197,94,0.4)',
  },

  filterText: {
    color: '#9CA3AF',

    fontSize: 13,

    fontWeight: '700',
  },

  filterTextActive: {
    color: '#4ADE80',
  },

  sectionLabel: {
    color: '#9CA3AF',

    fontSize: 12,

    fontWeight: '700',

    letterSpacing: 1.5,

    marginHorizontal: 24,

    marginBottom: 14,
  },

  chartCard: {
    marginHorizontal: 24,

    marginBottom: 30,

    backgroundColor:
      'rgba(255,255,255,0.04)',

    borderRadius: 26,

    padding: 22,

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.06)',
  },

  chartRow: {
    flexDirection: 'row',

    justifyContent:
      'space-between',

    alignItems: 'flex-end',
  },

  barCol: {
    alignItems: 'center',
    flex: 1,
  },

  barBg: {
    width: 30,

    height: 90,

    borderRadius: 999,

    justifyContent: 'flex-end',

    overflow: 'hidden',

    backgroundColor:
      'rgba(255,255,255,0.05)',
  },

  barFill: {
    width: '100%',

    height: '18%',

    borderRadius: 999,

    backgroundColor:
      'rgba(255,255,255,0.12)',
  },

  barFillActive: {
    height: '100%',

    backgroundColor: '#22C55E',
  },

  barLabel: {
    color: '#9CA3AF',

    fontSize: 11,

    marginTop: 8,
  },

  emptyCard: {
    marginHorizontal: 24,
  },

  dateHeader: {
    color: '#9CA3AF',

    fontSize: 13,

    fontWeight: '700',

    marginHorizontal: 24,

    marginBottom: 10,

    marginTop: 8,
  },

  entryCard: {
    flexDirection: 'row',

    alignItems: 'center',

    marginHorizontal: 24,

    marginBottom: 14,

    padding: 18,

    borderRadius: 22,

    backgroundColor:
      'rgba(255,255,255,0.04)',

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.06)',
  },

  entryDot: {
    width: 10,
    height: 10,

    borderRadius: 999,

    backgroundColor: '#22C55E',

    marginRight: 14,
  },

  entryLabel: {
    color: '#fff',

    fontSize: 16,

    fontWeight: '700',
  },

  entrySub: {
    color: '#9CA3AF',

    fontSize: 13,

    marginTop: 4,
  },

  entryCheck: {
    fontSize: 18,
  },
});
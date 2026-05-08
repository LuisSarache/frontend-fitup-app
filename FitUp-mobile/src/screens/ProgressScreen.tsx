import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Dumbbell } from 'lucide-react-native';
import { MainTabParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';
import { groupByDate, formatDuration, getWeekActivity } from '../utils/history';
import { EmptyState, StatCard } from '../components/ui';
import { colors, font } from '../theme';

type Props = BottomTabScreenProps<MainTabParamList, 'Progress'>;

const WEEK_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function ProgressScreen(_props: Props) {
  const { history, streak } = useApp();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const filteredHistory = history.filter(entry => {
    if (filter === 'all') return true;
    const entryDate = new Date(entry.completedAt);
    const now = new Date();
    if (filter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return entryDate >= weekAgo;
    }
    if (filter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return entryDate >= monthAgo;
    }
    return true;
  });

  const grouped = groupByDate([...filteredHistory].reverse());
  const weekActivity = getWeekActivity(history);
  const avgDuration =
    filteredHistory.length > 0
      ? Math.round(filteredHistory.reduce((s, e) => s + e.durationSeconds, 0) / filteredHistory.length / 60)
      : 0;
  const totalMinutes = Math.round(filteredHistory.reduce((s, e) => s + e.durationSeconds, 0) / 60);

  return (
    <View style={s.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.green} />
        }
      >
        <View style={[s.header, { paddingTop: insets.top + 16 }]}>
          <Text style={s.title}>Meu Progresso</Text>
        </View>

        {/* Summary */}
        <View style={s.statsRow}>
          {[
            { label: 'Treinos', value: String(filteredHistory.length) },
            { label: 'Streak 🔥', value: String(streak.current) },
            { label: 'Média', value: `${avgDuration}min` },
            { label: 'Total', value: `${totalMinutes}min` },
          ].map(({ label, value }) => (
            <StatCard
              key={label}
              label={label}
              value={value}
              tone={label === 'Streak 🔥' ? 'accent' : 'default'}
            />
          ))}
        </View>

        {/* Week bar chart */}
        <View style={s.filterRow}>
          {[{ key: 'all', label: 'Todos' }, { key: 'week', label: 'Última semana' }, { key: 'month', label: 'Último mês' }].map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              style={[s.filterBtn, filter === key && s.filterBtnActive]}
              onPress={() => setFilter(key as any)}
              activeOpacity={0.7}
            >
              <Text style={[s.filterText, filter === key && s.filterTextActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={s.sectionLabel}>FREQUÊNCIA SEMANAL</Text>
        <View style={s.chartRow}>
          {WEEK_LABELS.map((label, i) => (
            <View key={i} style={s.barCol}>
              <View style={s.barBg}>
                <View style={[s.barFill, weekActivity[i] && s.barFillActive]} />
              </View>
              <Text style={s.barLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* History grouped by date */}
        <Text style={s.sectionLabel}>HISTÓRICO</Text>
        {Object.keys(grouped).length === 0 && (
          <EmptyState
            icon={<Dumbbell color={colors.green} size={22} />}
            title="Nenhum treino ainda"
            description="Quando você finalizar o primeiro treino, seu histórico e suas médias aparecem aqui."
          />
        )}
        {Object.entries(grouped).map(([date, entries]) => (
          <View key={date}>
            <Text style={s.dateHeader}>{date}</Text>
            {entries.map((entry) => (
              <View key={entry.id} style={s.entryCard}>
                <View style={s.entryDot} />
                <View style={{ flex: 1 }}>
                  <Text style={s.entryLabel}>{entry.workoutLabel}</Text>
                  <Text style={s.entrySub}>
                    {formatDuration(entry.durationSeconds)} · {entry.exercisesTotal} exercícios
                  </Text>
                </View>
                <Text style={s.entryCheck}>✅</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20 },
  title: { fontSize: font.xl, fontWeight: '800', color: colors.white },
  statsRow: { flexDirection: 'row', gap: 10, marginHorizontal: 20, marginBottom: 24, flexWrap: 'wrap' },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  filterBtn: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterBtnActive: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
  },
  filterTextActive: {
    color: colors.white,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.muted,
    letterSpacing: 1.5,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 28,
    alignItems: 'flex-end',
  },
  barCol: { alignItems: 'center', gap: 6, flex: 1 },
  barBg: {
    width: 28,
    height: 60,
    backgroundColor: colors.card,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: { width: '100%', height: '20%', backgroundColor: colors.border, borderRadius: 6 },
  barFillActive: { height: '100%', backgroundColor: colors.green },
  barLabel: { fontSize: 10, color: colors.muted },
  dateHeader: {
    fontSize: font.sm,
    fontWeight: '700',
    color: colors.muted,
    marginHorizontal: 20,
    marginBottom: 8,
    marginTop: 4,
  },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  entryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
    marginRight: 12,
  },
  entryLabel: { fontSize: font.md, fontWeight: '600', color: colors.white },
  entrySub: { fontSize: font.sm, color: colors.muted, marginTop: 2 },
  entryCheck: { fontSize: 18 },
});

import { StreakData, Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'streak_3', label: 'Primeira Sequência', emoji: '🌱', requiredStreak: 3 },
  { id: 'streak_7', label: 'Uma Semana Forte', emoji: '🔥', requiredStreak: 7 },
  { id: 'streak_14', label: 'Duas Semanas', emoji: '⚡', requiredStreak: 14 },
  { id: 'streak_30', label: 'Um Mês Imparável', emoji: '🏆', requiredStreak: 30 },
  { id: 'streak_100', label: 'Centenário', emoji: '💎', requiredStreak: 100 },
];

export function updateStreak(streak: StreakData): {
  streak: StreakData;
  newAchievement: Achievement | null;
} {
  const today = new Date().toDateString();
  const last = streak.lastWorkoutDate ? new Date(streak.lastWorkoutDate).toDateString() : '';
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (last === today) return { streak, newAchievement: null };

  const newCurrent = last === yesterday ? streak.current + 1 : 1;
  const newStreak: StreakData = {
    current: newCurrent,
    best: Math.max(newCurrent, streak.best),
    lastWorkoutDate: new Date().toISOString(),
  };

  const newAchievement = ACHIEVEMENTS.find((a) => a.requiredStreak === newCurrent) ?? null;
  return { streak: newStreak, newAchievement };
}

export function getDefaultStreak(): StreakData {
  return { current: 0, best: 0, lastWorkoutDate: '' };
}

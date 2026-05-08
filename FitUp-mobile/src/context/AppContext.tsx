import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { load, save, remove, KEYS } from '../storage/storage';
import { UserProfile, WorkoutEntry, StreakData, Achievement, WorkoutLevel } from '../types';
import { getDefaultStreak } from '../utils/streak';
import { sendAchievementNotification } from '../services/notifications';
import { Analytics } from '../services/analytics';
import { authService } from '../services/auth';
import { env } from '../config/env';
import api from '../services/api';

type AppState = {
  profile: UserProfile | null;
  token: string | null;
  streak: StreakData;
  history: WorkoutEntry[];
  achievements: Achievement[];
  isLoading: boolean;
  setProfile: (p: UserProfile) => Promise<void>;
  setToken: (t: string | null) => Promise<void>;
  setLevel: (l: WorkoutLevel) => Promise<void>;
  addWorkoutEntry: (
    workoutKey: string,
    workoutLabel: string,
    durationSeconds: number,
    exercisesTotal: number,
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const AppContext = createContext<AppState>({} as AppState);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [streak, setStreakState] = useState<StreakData>(getDefaultStreak());
  const [history, setHistoryState] = useState<WorkoutEntry[]>([]);
  const [achievements, setAchievementsState] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      load<UserProfile>(KEYS.profile),
      load<string>(KEYS.token),
      load<boolean>(KEYS.analyticsEnabled),
    ]).then(async ([p, t, analyticsEnabled]) => {
      Analytics.setCollectionEnabled(analyticsEnabled ?? true);
      if (p) {
        setProfileState(p);
        Analytics.setUserLevel(p.level);
      }
      if (t) {
        setTokenState(t);
        if (!env.useMock) {
          try {
            const [profileRes, streakRes, historyRes, achievementsRes] = await Promise.all([
              api.get<UserProfile>('/profile').catch(() => null),
              api.get<StreakData>('/streak').catch(() => null),
              api.get<WorkoutEntry[]>('/workouts/history').catch(() => null),
              api.get<Achievement[]>('/achievements').catch(() => null),
            ]);
            if (profileRes?.data) {
              setProfileState(profileRes.data);
              Analytics.setUserLevel(profileRes.data.level);
              await save(KEYS.profile, profileRes.data);
            }
            if (streakRes?.data) setStreakState(streakRes.data);
            if (historyRes?.data) setHistoryState(historyRes.data);
            if (achievementsRes?.data) setAchievementsState(achievementsRes.data);
          } catch {
            // usa dados locais em caso de falha de rede
          }
        } else {
          const [s, h, a] = await Promise.all([
            load<StreakData>(KEYS.streak),
            load<WorkoutEntry[]>(KEYS.history),
            load<Achievement[]>('@fitup:achievements'),
          ]);
          if (s) setStreakState(s);
          if (h) setHistoryState(h);
          if (a) setAchievementsState(a);
        }
      }
      setIsLoading(false);
    });
  }, []);

  const setProfile = useCallback(async (p: UserProfile) => {
    setProfileState(p);
    Analytics.setUserLevel(p.level);
    await save(KEYS.profile, p);
    if (!env.useMock) {
      try {
        await api.put('/profile', { name: p.name, weightKg: p.weightKg, heightCm: p.heightCm, level: p.level });
      } catch {
        // salvo localmente mesmo se a API falhar
      }
    }
  }, []);

  const setToken = useCallback(async (t: string | null) => {
    setTokenState(t);
    if (t) await save(KEYS.token, t);
    else await remove(KEYS.token);
  }, []);

  const setLevel = useCallback(
    async (l: WorkoutLevel) => {
      if (!profile) return;
      const updated = { ...profile, level: l };
      setProfileState(updated);
      Analytics.setUserLevel(l);
      await save(KEYS.profile, updated);
      await save(KEYS.level, l);
      if (!env.useMock) {
        try {
          await api.put('/profile', { level: l });
        } catch {
          // salvo localmente mesmo se a API falhar
        }
      }
    },
    [profile],
  );

  const addWorkoutEntry = useCallback(
    async (
      workoutKey: string,
      workoutLabel: string,
      durationSeconds: number,
      exercisesTotal: number,
    ) => {
      const completedAt = new Date().toISOString();

      if (!env.useMock) {
        const { data: entry } = await api.post<WorkoutEntry>('/workouts/history', {
          workoutKey,
          workoutLabel,
          completedAt,
          durationSeconds,
          exercisesTotal,
        });
        setHistoryState((prev) => [...prev, entry]);

        const [streakRes, achievementsRes] = await Promise.all([
          api.get<StreakData>('/streak').catch(() => null),
          api.get<Achievement[]>('/achievements').catch(() => null),
        ]);
        if (streakRes?.data) setStreakState(streakRes.data);
        if (achievementsRes?.data) {
          const prev = achievements;
          const newOnes = achievementsRes.data.filter(
            (a) => !prev.find((p) => p.id === a.id),
          );
          setAchievementsState(achievementsRes.data);
          for (const a of newOnes) {
            await sendAchievementNotification(a.label, a.emoji);
          }
        }
      } else {
        const { updateStreak } = await import('../utils/streak');
        const { generateId } = await import('../utils/history');
        const entry: WorkoutEntry = {
          id: generateId(),
          workoutKey,
          workoutLabel,
          completedAt,
          durationSeconds,
          exercisesTotal,
        };
        const newHistory = [...history, entry];
        setHistoryState(newHistory);
        await save(KEYS.history, newHistory);

        const { streak: newStreak, newAchievement } = updateStreak(streak);
        setStreakState(newStreak);
        await save(KEYS.streak, newStreak);

        if (newAchievement) {
          const newAchievements = [
            ...achievements,
            { ...newAchievement, unlockedAt: new Date().toISOString() },
          ];
          setAchievementsState(newAchievements);
          await save('@fitup:achievements', newAchievements);
          await sendAchievementNotification(newAchievement.label, newAchievement.emoji);
        }
      }
    },
    [history, streak, achievements],
  );

  const logout = useCallback(async () => {
    await authService.logout();
    setProfileState(null);
    setTokenState(null);
    Analytics.reset();
  }, []);

  return (
    <AppContext.Provider
      value={{
        profile,
        token,
        streak,
        history,
        achievements,
        isLoading,
        setProfile,
        setToken,
        setLevel,
        addWorkoutEntry,
        logout,
      }}
    >
      {isLoading ? (
        <View
          style={{
            flex: 1,
            backgroundColor: '#0A0F1E',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator color="#22C55E" size="large" />
        </View>
      ) : (
        children
      )}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);

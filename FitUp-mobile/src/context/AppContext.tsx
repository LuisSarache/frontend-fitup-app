import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { load, save, remove, KEYS } from '../storage/storage';
import { UserProfile, WorkoutEntry, StreakData, Achievement, WorkoutLevel } from '../types';
import { getDefaultStreak } from '../utils/streak';
import { sendAchievementNotification } from '../services/notifications';
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
    (async () => {
      try {
        const [p, t, analyticsEnabled] = await Promise.all([
          load<UserProfile>(KEYS.profile),
          load<string>(KEYS.token),
          load<boolean>(KEYS.analyticsEnabled),
        ]);

        if (p) setProfileState(p);
        
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
                await save(KEYS.profile, profileRes.data);
              }
              if (streakRes?.data) setStreakState(streakRes.data);
              if (historyRes?.data) setHistoryState(historyRes.data);
              if (achievementsRes?.data) setAchievementsState(achievementsRes.data);
            } catch (error) {
              console.warn('[AppContext] Failed to load from API, using local data');
              const [s, h, a] = await Promise.all([
                load<StreakData>(KEYS.streak),
                load<WorkoutEntry[]>(KEYS.history),
                load<Achievement[]>('@fitup:achievements'),
              ]);
              if (s) setStreakState(s);
              if (h) setHistoryState(h);
              if (a) setAchievementsState(a);
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
      } catch (error) {
        console.error('[AppContext] Error:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const setProfile = useCallback(async (p: UserProfile) => {
    setProfileState(p);
    await save(KEYS.profile, p);
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
      await save(KEYS.profile, updated);
      await save(KEYS.level, l);
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

      // Sempre usa modo mock/local
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
    },
    [history, streak, achievements],
  );

  const logout = useCallback(async () => {
    await authService.logout();
    setProfileState(null);
    setTokenState(null);
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

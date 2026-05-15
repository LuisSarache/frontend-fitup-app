import AsyncStorage from '@react-native-async-storage/async-storage';

export async function save<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function load<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : null;
}

export async function remove(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

export const KEYS = {
  profile: '@fitup:profile',
  token: '@fitup:auth_token',
  refreshToken: '@fitup:auth_refresh_token',
  level: '@fitup:level',
  streak: '@fitup:streak',
  history: '@fitup:history',
  workoutProgress: '@fitup:workout_progress',
  onboardingDone: '@fitup:onboarding_done',
  notifHour: '@fitup:notif_hour',
  notifEnabled: '@fitup:notif_enabled',
  analyticsEnabled: '@fitup:analytics_enabled',
} as const;

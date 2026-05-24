import { getFirebaseAnalytics, type AnalyticsEventParams } from './firebase';

function sanitize(params?: AnalyticsEventParams): AnalyticsEventParams | undefined {
  if (!params) return undefined;
  return Object.fromEntries(
    Object.entries(params).map(([k, v]) => [
      k,
      typeof v === 'string' ? v.replace(/[\r\n]/g, ' ') : v,
    ]),
  );
}

function reportError(action: string, error: unknown): void {
  if (__DEV__) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const sanitizedMsg = errorMsg.replace(/[\r\n]/g, ' ');
    console.warn(`[Analytics] Failed to ${action}`, sanitizedMsg);
  }
}

function logEvent(name: string, params?: AnalyticsEventParams): void {
  const safeParams = sanitize(params);
  const sanitizedName = name.replace(/[\r\n]/g, ' ');
  if (__DEV__) console.log(`[Analytics] ${sanitizedName}`, safeParams);

  getFirebaseAnalytics()
    ?.logEvent(name, safeParams)
    .catch((error) => reportError(`log ${name}`, error));
}

export const Analytics = {
  screenViewed: (screenName: string) => {
    if (__DEV__) console.log(`[Analytics] screen_view`, { screen_name: screenName });

    getFirebaseAnalytics()
      ?.logScreenView({ screen_name: screenName, screen_class: screenName })
      .catch((error) => reportError('log screen_view', error));
  },
  setCollectionEnabled: (enabled: boolean) => {
    getFirebaseAnalytics()
      ?.setAnalyticsCollectionEnabled(enabled)
      .catch((error) => reportError('set collection enabled', error));
  },
  setUserId: (userId: string | null) => {
    getFirebaseAnalytics()
      ?.setUserId(userId)
      .catch((error) => reportError('set user id', error));
  },
  setUserLevel: (level: string | null) => {
    getFirebaseAnalytics()
      ?.setUserProperty('level', level)
      .catch((error) => reportError('set user level', error));
  },
  reset: () => {
    getFirebaseAnalytics()
      ?.resetAnalyticsData()
      .catch((error) => reportError('reset analytics data', error));
  },
  event: logEvent,
  login: (method: string) => logEvent('login', { method }),
  signUp: (method: string) => logEvent('sign_up', { method }),
  onboardingCompleted: (ageGroup: string) =>
    logEvent('onboarding_completed', { age_group: ageGroup }),
  levelSelected: (level: string) => logEvent('level_selected', { level }),
  workoutStarted: (workoutKey: string) => logEvent('workout_started', { workout_key: workoutKey }),
  workoutCompleted: (workoutKey: string, durationSeconds: number) =>
    logEvent('workout_completed', { workout_key: workoutKey, duration_seconds: durationSeconds }),
  workoutAbandoned: (workoutKey: string, completed: number, total: number) =>
    logEvent('workout_abandoned', {
      workout_key: workoutKey,
      exercises_completed: completed,
      exercises_total: total,
    }),
  exerciseChecked: (exerciseName: string, workoutKey: string) =>
    logEvent('exercise_checked', { exercise_name: exerciseName, workout_key: workoutKey }),
  streakMilestone: (days: number) => logEvent('streak_milestone', { streak_days: days }),
  achievementUnlocked: (achievementId: string) =>
    logEvent('achievement_unlocked', { achievement_id: achievementId }),
};

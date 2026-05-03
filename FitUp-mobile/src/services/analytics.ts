// Replace the stub functions below with @react-native-firebase/analytics
// once google-services.json (Android) and GoogleService-Info.plist (iOS) are configured.

type EventParams = Record<string, string | number>;

function sanitize(params?: EventParams): EventParams | undefined {
  if (!params) return undefined;
  return Object.fromEntries(
    Object.entries(params).map(([k, v]) =>
      [k, typeof v === 'string' ? v.replace(/[\r\n]/g, ' ') : v]
    )
  );
}

function logEvent(name: string, params?: EventParams): void {
  if (__DEV__) console.log(`[Analytics] ${name}`, sanitize(params));
  // analytics().logEvent(name, sanitize(params));
}

export const Analytics = {
  login: (method: string) => logEvent('login', { method }),
  signUp: (method: string) => logEvent('sign_up', { method }),
  onboardingCompleted: (ageGroup: string) => logEvent('onboarding_completed', { age_group: ageGroup }),
  levelSelected: (level: string) => logEvent('level_selected', { level }),
  workoutStarted: (workoutKey: string) => logEvent('workout_started', { workout_key: workoutKey }),
  workoutCompleted: (workoutKey: string, durationSeconds: number) =>
    logEvent('workout_completed', { workout_key: workoutKey, duration_seconds: durationSeconds }),
  workoutAbandoned: (workoutKey: string, completed: number, total: number) =>
    logEvent('workout_abandoned', { workout_key: workoutKey, exercises_completed: completed, exercises_total: total }),
  exerciseChecked: (exerciseName: string, workoutKey: string) =>
    logEvent('exercise_checked', { exercise_name: exerciseName, workout_key: workoutKey }),
  streakMilestone: (days: number) => logEvent('streak_milestone', { streak_days: days }),
  achievementUnlocked: (achievementId: string) => logEvent('achievement_unlocked', { achievement_id: achievementId }),
};

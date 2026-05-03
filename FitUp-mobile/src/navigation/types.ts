import { WorkoutLevel } from '../types';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type AppStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  LevelSelection: undefined;
  ChangeLevel: undefined;
  WorkoutSelection: { level: WorkoutLevel };
  Workout: { workoutKey: string };
  Completion: { workoutKey: string; workoutLabel: string; durationSeconds: number };
  Progress: undefined;
  Profile: undefined;
  Achievements: undefined;
};

// Legacy — kept for backward compat during migration
export type RootStackParamList = AuthStackParamList & AppStackParamList;

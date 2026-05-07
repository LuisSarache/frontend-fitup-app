import { NavigatorScreenParams } from '@react-navigation/native';
import { WorkoutLevel } from '../types';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Progress: undefined;
  Achievements: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Onboarding: undefined;
  LevelSelection: undefined;
  ChangeLevel: undefined;
  WorkoutSelection: { level: WorkoutLevel };
  Workout: { workoutKey: string };
  Completion: {
    workoutKey: string;
    workoutLabel: string;
    durationSeconds: number;
    exercisesTotal: number;
  };
};

export type RootStackParamList = AuthStackParamList & AppStackParamList;

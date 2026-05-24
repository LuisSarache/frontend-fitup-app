export type WorkoutLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type UserProfile = {
  name: string;
  email: string;
  weightKg: number;
  heightCm: number;
  dateOfBirth: string;
  sex: 'male' | 'female';
  level: WorkoutLevel;
  avatar?: string;
};

export type WorkoutEntry = {
  id: string;
  workoutKey: string;
  workoutLabel: string;
  completedAt: string;
  durationSeconds: number;
  exercisesTotal: number;
};

export type StreakData = {
  current: number;
  best: number;
  lastWorkoutDate: string;
};

export type Achievement = {
  id: string;
  label: string;
  emoji: string;
  requiredStreak: number;
  unlockedAt?: string;
};

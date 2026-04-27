import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AppProvider } from './src/context/AppContext';
import { RootStackParamList } from './src/navigation/types';

import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LevelSelectionScreen from './src/screens/LevelSelectionScreen';
import WorkoutSelectionScreen from './src/screens/WorkoutSelectionScreen';
import WorkoutScreenComponent from './src/components/WorkoutScreen';
import CompletionScreen from './src/screens/CompletionScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="LevelSelection" component={LevelSelectionScreen} />
            <Stack.Screen name="WorkoutSelection" component={WorkoutSelectionScreen} />
            <Stack.Screen name="Workout" component={WorkoutScreenComponent} />
            <Stack.Screen name="Completion" component={CompletionScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Progress" component={ProgressScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Achievements" component={AchievementsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}

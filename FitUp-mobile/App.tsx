import React, { useEffect, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';

import { AppProvider } from './src/context/AppContext';
import { ToastProvider } from './src/context/ToastContext';
import { RootStackParamList } from './src/navigation/types';
import AppTabs from './src/navigation/AppTabs';
import { setUnauthorizedHandler } from './src/services/api';
import { Analytics } from './src/services/analytics';

import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LevelSelectionScreen from './src/screens/LevelSelectionScreen';
import WorkoutSelectionScreen from './src/screens/WorkoutSelectionScreen';
import WorkoutScreenComponent from './src/components/WorkoutScreen';
import CompletionScreen from './src/screens/CompletionScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ChangeLevelScreen from './src/screens/ChangeLevelScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const navRef = useRef<NavigationContainerRef<RootStackParamList>>(null);
  const routeNameRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('overlay-swipe');
      NavigationBar.setBackgroundColorAsync('#0A0F1E');
    }
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      navRef.current?.reset({ index: 0, routes: [{ name: 'Login' }] });
    });
  }, []);

  return (
    <SafeAreaProvider>
      <AppProvider>
        <ToastProvider>
        <NavigationContainer
          ref={navRef}
          onReady={() => {
            routeNameRef.current = navRef.current?.getCurrentRoute()?.name;
            if (routeNameRef.current) Analytics.screenViewed(routeNameRef.current);
          }}
          onStateChange={() => {
            const previousRouteName = routeNameRef.current;
            const currentRouteName = navRef.current?.getCurrentRoute()?.name;

            if (currentRouteName && previousRouteName !== currentRouteName) {
              routeNameRef.current = currentRouteName;
              Analytics.screenViewed(currentRouteName);
            }
          }}
        >
          <StatusBar style="light" />
          <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="MainTabs" component={AppTabs} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="LevelSelection" component={LevelSelectionScreen} />
            <Stack.Screen name="WorkoutSelection" component={WorkoutSelectionScreen} />
            <Stack.Screen name="Workout" component={WorkoutScreenComponent} />
            <Stack.Screen name="Completion" component={CompletionScreen} />
            <Stack.Screen name="ChangeLevel" component={ChangeLevelScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        </ToastProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}

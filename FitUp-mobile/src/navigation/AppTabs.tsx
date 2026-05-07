import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Award, ChartNoAxesColumnIncreasing, Home, UserRound } from 'lucide-react-native';
import { MainTabParamList } from './types';
import { colors } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import ProgressScreen from '../screens/ProgressScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS = {
  Home,
  Progress: ChartNoAxesColumnIncreasing,
  Achievements: Award,
  Profile: UserRound,
};

const LABELS: Record<keyof MainTabParamList, string> = {
  Home: 'Inicio',
  Progress: 'Progresso',
  Achievements: 'Conquistas',
  Profile: 'Perfil',
};

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabel: LABELS[route.name],
        tabBarLabelStyle: s.label,
        tabBarStyle: s.tabBar,
        tabBarItemStyle: s.item,
        tabBarIcon: ({ color, size, focused }) => {
          const Icon = ICONS[route.name];
          return (
            <Icon
              color={color}
              size={focused ? size + 2 : size}
              strokeWidth={focused ? 2.8 : 2.2}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Achievements" component={AchievementsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const s = StyleSheet.create({
  tabBar: {
    minHeight: 72,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: colors.card,
    borderTopColor: colors.border,
    borderTopWidth: 1,
  },
  item: {
    borderRadius: 14,
    marginHorizontal: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
    fontFamily: undefined,
  },
});

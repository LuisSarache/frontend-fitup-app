import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';
import { colors, font } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  const { token, profile, isLoading } = useApp();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();
  }, [opacity, scale]);

  useEffect(() => {
    if (isLoading) return;
    const t = setTimeout(() => {
      if (token && profile) navigation.replace('MainTabs', { screen: 'Home' });
      else if (token && !profile) navigation.replace('Onboarding');
      else navigation.replace('Login');
    }, 1800);
    return () => clearTimeout(t);
  }, [isLoading, navigation, token, profile]);

  return (
    <View style={s.container}>
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <Text style={s.logo}>
          Fit<Text style={{ color: colors.green }}>Up</Text>
        </Text>
        <Text style={s.tagline}>Train. Evolve. Repeat.</Text>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 64,
    fontWeight: '900',
    color: colors.white,
    lineHeight: 68,
    textAlign: 'center',
  },
  tagline: {
    marginTop: 12,
    fontSize: font.md,
    color: colors.muted,
    letterSpacing: 2,
    textAlign: 'center',
  },
});

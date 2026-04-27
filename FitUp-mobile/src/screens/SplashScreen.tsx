import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';
import { colors, font } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  const { token, profile, isLoading } = useApp();

  useEffect(() => {
    if (isLoading) return;
    const t = setTimeout(() => {
      if (token && profile) {
        navigation.replace('Home');
      } else if (token && !profile) {
        navigation.replace('Onboarding');
      } else {
        navigation.replace('Login');
      }
    }, 1500);
    return () => clearTimeout(t);
  }, [isLoading, token, profile]);

  return (
    <View style={s.container}>
      <Text style={s.logo}>Fit<Text style={{ color: colors.green }}>Up</Text></Text>
      <Text style={s.tagline}>Train. Evolve. Repeat.</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  logo: { fontSize: 64, fontWeight: '900', color: colors.white, lineHeight: 68 },
  tagline: { marginTop: 12, fontSize: font.md, color: colors.muted, letterSpacing: 2 },
});

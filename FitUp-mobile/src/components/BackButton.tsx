import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, radius } from '../theme';

export default function BackButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.canGoBack() && navigation.goBack()}
      style={s.btn}
      activeOpacity={0.75}
      hitSlop={8}
      accessibilityLabel="Voltar"
      accessibilityRole="button"
    >
      <Text style={s.text}>‹</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: colors.white, fontSize: 32, lineHeight: 34 },
});

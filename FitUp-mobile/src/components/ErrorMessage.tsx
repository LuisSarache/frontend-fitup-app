import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';

export function ErrorMessage({ message }: { message: string }) {
  return (
    <View style={s.box} accessibilityRole="alert">
      <Text style={s.icon}>!</Text>
      <Text style={s.error}>{message}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 6,
    marginBottom: 8,
  },
  icon: {
    width: 18,
    height: 18,
    borderRadius: radius.pill,
    backgroundColor: colors.danger,
    color: colors.white,
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 18,
    textAlign: 'center',
  },
  error: { color: colors.white, fontSize: 13, flex: 1 },
});

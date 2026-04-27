import React from 'react';
import { Text, StyleSheet } from 'react-native';

export function ErrorMessage({ message }: { message: string }) {
  return <Text style={s.error}>⚠ {message}</Text>;
}

const s = StyleSheet.create({
  error: { color: '#EF4444', fontSize: 13, marginTop: 6 },
});

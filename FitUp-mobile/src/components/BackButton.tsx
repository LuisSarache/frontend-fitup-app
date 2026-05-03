import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme';

export default function BackButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={s.btn}>
      <Text style={s.text}>‹</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  btn: { padding: 4, marginRight: 12 },
  text: { color: colors.white, fontSize: 32, lineHeight: 34 },
});

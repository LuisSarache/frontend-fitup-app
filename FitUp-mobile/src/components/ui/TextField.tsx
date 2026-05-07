import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, font, radius } from '../../theme';

type TextFieldProps = TextInputProps & {
  label?: string;
  error?: string;
};

export function TextField({ label, error, style, ...props }: TextFieldProps) {
  return (
    <View style={s.wrap}>
      {label && <Text style={s.label}>{label}</Text>}
      <TextInput
        {...props}
        style={[s.input, error && s.inputError, style]}
        placeholderTextColor={colors.muted}
      />
      {error && <Text style={s.error}>{error}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    marginBottom: 14,
  },
  label: {
    color: colors.muted,
    fontSize: font.sm,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    minHeight: 52,
    backgroundColor: colors.card,
    color: colors.white,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: font.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 5,
  },
});

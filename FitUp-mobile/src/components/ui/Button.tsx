import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, font, radius } from '../../theme';

type ButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: React.ReactNode;
};

export function Button({
  title,
  onPress,
  loading,
  disabled,
  variant = 'primary',
  icon,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[s.base, s[variant], isDisabled && s.disabled]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.78}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.white : colors.green} />
      ) : (
        <View style={s.content}>
          {icon}
          <Text style={[s.text, variant !== 'primary' && s.textSecondary]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
  },
  primary: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  secondary: {
    backgroundColor: colors.card,
    borderColor: colors.border,
  },
  danger: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.danger,
  },
  disabled: {
    opacity: 0.58,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    color: colors.white,
    fontWeight: '800',
    fontSize: font.md,
  },
  textSecondary: {
    color: colors.green,
  },
});

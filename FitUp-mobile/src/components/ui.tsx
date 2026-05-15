import React from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInputProps,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '../theme';

// Button Component
interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export function Button({
  title,
  onPress,
  loading,
  disabled,
  variant = 'primary',
}: ButtonProps) {
  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={disabled || loading}
        style={[
          s.btnSecondary,
          (disabled || loading) &&
            s.btnDisabled,
        ]}
      >
        <Text style={s.btnSecondaryText}>
          {loading
            ? 'Carregando...'
            : title}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        s.btnWrapper,
        (disabled || loading) &&
          s.btnDisabled,
      ]}
    >
      <LinearGradient
        colors={['#22C55E', '#16A34A']}
        style={s.btn}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={s.btnText}>
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

// TextField Component
interface TextFieldProps
  extends TextInputProps {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export function TextField({
  label,
  icon,
  error,
  style,
  ...props
}: TextFieldProps) {
  return (
    <View style={s.fieldWrapper}>
      {label && (
        <View style={s.labelRow}>
          {icon}

          <Text style={s.label}>
            {label}
          </Text>
        </View>
      )}

      <View
        style={[
          s.card,
          error && s.cardError,
        ]}
      >
        <TextInput
          style={[s.input, style]}
          placeholderTextColor={
            colors.muted
          }
          {...props}
        />
      </View>

      {error && (
        <Text style={s.errorText}>
          ⚠ {error}
        </Text>
      )}
    </View>
  );
}

// EmptyState Component
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({
  icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <View style={s.emptyWrap}>
      {icon}

      <Text style={s.emptyTitle}>
        {title}
      </Text>

      {description && (
        <Text
          style={s.emptyDescription}
        >
          {description}
        </Text>
      )}
    </View>
  );
}

// Card Component
interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
}

export function Card({
  children,
  onPress,
  style,
}: CardProps) {
  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
        style={[
          s.cardTouchable,
          style,
        ]}
      >
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.05)',
            'rgba(255,255,255,0.02)',
          ]}
          style={s.cardGradient}
        >
          {children}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[s.card, style]}>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  // Button
  btnWrapper: {
    borderRadius: 24,
    overflow: 'hidden',

    shadowColor: '#22C55E',
    shadowOpacity: 0.35,
    shadowRadius: 18,

    elevation: 10,

    marginTop: 18,
  },

  btn: {
    height: 62,

    justifyContent: 'center',
    alignItems: 'center',
  },

  btnText: {
    color: '#fff',

    fontSize: 17,

    fontWeight: '800',
  },

  btnSecondary: {
    height: 62,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor:
      'rgba(255,255,255,0.04)',

    borderRadius: 24,

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.06)',

    marginTop: 12,
  },

  btnSecondaryText: {
    color: colors.white,

    fontSize: 17,

    fontWeight: '700',
  },

  btnDisabled: {
    opacity: 0.5,
  },

  // TextField
  fieldWrapper: {
    marginBottom: 16,
  },

  labelRow: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 8,

    marginBottom: 12,
  },

  label: {
    color: colors.muted,

    fontSize: 14,

    fontWeight: '600',
  },

  card: {
    backgroundColor:
      'rgba(255,255,255,0.04)',

    borderRadius: 24,

    padding: 18,

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.06)',
  },

  cardError: {
    borderColor: '#EF4444',
  },

  input: {
    color: colors.white,

    fontSize: 18,

    fontWeight: '700',
  },

  errorText: {
    color: '#EF4444',

    fontSize: 12,

    marginTop: 8,
  },

  // EmptyState
  emptyWrap: {
    alignItems: 'center',

    justifyContent: 'center',

    paddingVertical: 32,

    paddingHorizontal: 20,
  },

  emptyTitle: {
    color: '#fff',

    fontSize: 18,

    fontWeight: '700',

    marginTop: 14,
  },

  emptyDescription: {
    color: '#9CA3AF',

    fontSize: 14,

    textAlign: 'center',

    marginTop: 8,

    lineHeight: 22,
  },

  // Card
  cardTouchable: {
    borderRadius: 28,

    overflow: 'hidden',

    marginBottom: 18,

    shadowColor: '#22C55E',

    shadowOpacity: 0.12,

    shadowRadius: 20,

    elevation: 8,
  },

  cardGradient: {
    padding: 22,

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.06)',

    borderRadius: 28,

    backgroundColor:
      'rgba(255,255,255,0.03)',
  },
});
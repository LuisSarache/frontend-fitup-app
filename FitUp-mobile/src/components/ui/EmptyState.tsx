import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, font, radius } from '../../theme';
import { Button } from './Button';

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={s.container}>
      {icon && <View style={s.icon}>{icon}</View>}
      <Text style={s.title}>{title}</Text>
      <Text style={s.description}>{description}</Text>
      {actionLabel && onAction && <Button title={actionLabel} onPress={onAction} />}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    color: colors.white,
    fontSize: font.lg,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  description: {
    color: colors.muted,
    fontSize: font.sm,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, font, radius } from '../../theme';

type StatCardProps = {
  label: string;
  value: string;
  tone?: 'default' | 'accent';
};

export function StatCard({ label, value, tone = 'default' }: StatCardProps) {
  return (
    <View style={[s.card, tone === 'accent' && s.cardAccent]}>
      <Text
        style={[s.value, tone === 'accent' && s.valueAccent]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>
      <Text style={s.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 76,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardAccent: {
    borderColor: colors.green,
    backgroundColor: colors.greenSoft,
  },
  value: {
    fontSize: font.lg,
    fontWeight: '900',
    color: colors.white,
  },
  valueAccent: {
    color: colors.green,
  },
  label: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 4,
    fontWeight: '700',
  },
});

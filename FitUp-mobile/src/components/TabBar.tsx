import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';

const TABS = [
  { name: 'Home' as const, label: 'Início', icon: '🏠' },
  { name: 'Progress' as const, label: 'Progresso', icon: '📊' },
  { name: 'Achievements' as const, label: 'Conquistas', icon: '🏆' },
  { name: 'Profile' as const, label: 'Perfil', icon: '👤' },
];

export default function TabBar() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.container, { paddingBottom: insets.bottom + 8 }]}>
      {TABS.map(tab => {
        const active = route.name === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={s.tab}
            onPress={() => navigation.navigate(tab.name)}
          >
            <Text style={s.icon}>{tab.icon}</Text>
            <Text style={[s.label, active && s.labelActive]}>{tab.label}</Text>
            {active && <View style={s.dot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  tab: { flex: 1, alignItems: 'center', gap: 2 },
  icon: { fontSize: 20 },
  label: { fontSize: 10, color: colors.muted, fontWeight: '600' },
  labelActive: { color: colors.green },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.green, marginTop: 2 },
});

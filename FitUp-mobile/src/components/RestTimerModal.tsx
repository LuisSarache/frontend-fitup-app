import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, font } from '../theme';

type Props = {
  visible: boolean;
  seconds: number;
  totalSeconds: number;
  onSkip: () => void;
};

export function RestTimerModal({ visible, seconds, totalSeconds, onSkip }: Props) {
  const progress = totalSeconds > 0 ? seconds / totalSeconds : 0;
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  useEffect(() => {
    if (visible && seconds === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [seconds, visible]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={s.overlay}>
        <View style={s.card}>
          <Text style={s.title}>Descanse agora 😮‍💨</Text>
          <Text style={s.timer}>
            {mm}:{ss}
          </Text>
          <View style={s.barBg}>
            <View style={[s.barFill, { width: `${progress * 100}%` }]} />
          </View>
          <TouchableOpacity style={s.skipBtn} onPress={onSkip}>
            <Text style={s.skipText}>Pular Descanso →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  card: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  title: { fontSize: font.lg, fontWeight: '700', color: colors.white, marginBottom: 16 },
  timer: { fontSize: 64, fontWeight: '900', color: colors.green, letterSpacing: 2 },
  barBg: {
    width: '100%',
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginVertical: 20,
  },
  barFill: { height: 6, backgroundColor: colors.green, borderRadius: 3 },
  skipBtn: { paddingVertical: 12, paddingHorizontal: 32 },
  skipText: { color: colors.muted, fontSize: font.md, fontWeight: '600' },
});

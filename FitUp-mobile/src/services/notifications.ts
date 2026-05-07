import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const isWeb = Platform.OS === 'web';

export async function requestNotificationPermissions(): Promise<boolean> {
  if (isWeb || !Device.isDevice) return false;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyReminder(hour: number, name: string): Promise<void> {
  if (isWeb) return; // 👈 evita erro

  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Hora de treinar! 💪',
      body: `${name}, seu treino de hoje está esperando por você.`,
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute: 0 },
  });
}

export async function scheduleStreakRiskReminder(streakDays: number): Promise<void> {
  if (isWeb) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Seu streak está em risco! 🔥',
      body: `Seu streak de ${streakDays} dias vai zerar. Treine agora!`,
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: 20, minute: 0 },
  });
}

export async function sendAchievementNotification(label: string, emoji: string): Promise<void> {
  if (isWeb) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${emoji} Nova conquista desbloqueada!`,
      body: label,
    },
    trigger: null,
  });
}

export async function cancelAllReminders(): Promise<void> {
  if (isWeb) return;

  await Notifications.cancelAllScheduledNotificationsAsync();
}

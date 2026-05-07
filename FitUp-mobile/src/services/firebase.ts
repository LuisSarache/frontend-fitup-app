import { Platform } from 'react-native';

export type AnalyticsEventParams = Record<string, string | number>;

export type FirebaseAnalyticsModule = {
  logEvent: (name: string, params?: AnalyticsEventParams) => Promise<void>;
  logScreenView: (params: { screen_name: string; screen_class: string }) => Promise<void>;
  setAnalyticsCollectionEnabled: (enabled: boolean) => Promise<void>;
  setUserId: (id: string | null) => Promise<void>;
  setUserProperty: (name: string, value: string | null) => Promise<void>;
  resetAnalyticsData: () => Promise<void>;
};

type AnalyticsPackage = {
  default: () => FirebaseAnalyticsModule;
};

declare const require: (moduleName: string) => AnalyticsPackage;

let analyticsModule: FirebaseAnalyticsModule | null | undefined;

export function getFirebaseAnalytics(): FirebaseAnalyticsModule | null {
  if (Platform.OS === 'web') return null;
  if (analyticsModule !== undefined) return analyticsModule;

  try {
    // Lazy require keeps Expo Go/web from crashing before a native Firebase build exists.
    analyticsModule = require('@react-native-firebase/analytics').default();
  } catch (error) {
    analyticsModule = null;
    if (__DEV__) console.warn('[Firebase] Analytics unavailable', error);
  }

  return analyticsModule;
}

export function hasFirebaseAnalytics(): boolean {
  return getFirebaseAnalytics() !== null;
}

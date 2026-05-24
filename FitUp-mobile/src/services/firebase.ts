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
  // Desabilitado temporariamente para evitar crashes
  return null;
}

export function hasFirebaseAnalytics(): boolean {
  return false;
}

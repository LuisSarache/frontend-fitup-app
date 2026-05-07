export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL,
  useMock: process.env.EXPO_PUBLIC_USE_MOCK === 'true',
};

export function getApiBaseUrl(): string | undefined {
  if (env.apiUrl) return env.apiUrl;

  if (!env.useMock && __DEV__) {
    console.warn('[Config] EXPO_PUBLIC_API_URL is not set. API requests will use relative paths.');
  }

  return undefined;
}

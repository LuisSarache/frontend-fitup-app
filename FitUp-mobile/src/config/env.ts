// Valores hardcoded para garantir que funcionem mesmo sem .env
const DEFAULT_API_URL = 'https://backend-fitup.onrender.com';
const DEFAULT_USE_MOCK = false;

export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL,
  useMock: process.env.EXPO_PUBLIC_USE_MOCK === 'true' ? true : DEFAULT_USE_MOCK,
};

export function getApiBaseUrl(): string {
  const url = env.apiUrl;
  if (__DEV__) {
    console.log('[Config] API URL:', url);
    console.log('[Config] Use Mock:', env.useMock);
  }
  return url;
}

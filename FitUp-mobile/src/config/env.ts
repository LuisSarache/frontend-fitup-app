export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://backend-fitup.onrender.com',
  useMock: process.env.EXPO_PUBLIC_USE_MOCK !== 'false',
};

export function getApiBaseUrl(): string {
  return env.apiUrl;
}

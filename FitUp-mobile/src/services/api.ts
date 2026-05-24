import axios, { AxiosError } from 'axios';
import { load, save, remove, KEYS } from '../storage/storage';
import { withRetry } from '../utils/apiErrors';
import { handleNetworkError } from '../utils/networkError';
import { getApiBaseUrl } from '../config/env';

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await load<string>(KEYS.token);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Log network errors
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      const networkError = handleNetworkError(error);
      const sanitizedMessage = networkError.message.replace(/[\r\n]/g, ' ');
      console.warn('[Network Error]', sanitizedMessage);
    }

    const originalRequest = error.config;
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        const refreshToken = await load<string>(KEYS.refreshToken);
        if (!refreshToken) throw new Error('no refresh token');

        const { data } = await axios.post<{ token: string; refreshToken: string }>(
          `${getApiBaseUrl()}/auth/refresh`,
          { refreshToken },
        );

        await save(KEYS.token, data.token);
        await save(KEYS.refreshToken, data.refreshToken);

        refreshQueue.forEach((cb) => cb(data.token));
        refreshQueue = [];

        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch {
        refreshQueue = [];
        await remove(KEYS.token);
        await remove(KEYS.refreshToken);
        await remove(KEYS.profile);
        onUnauthorized?.();
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export { withRetry };
export default api;

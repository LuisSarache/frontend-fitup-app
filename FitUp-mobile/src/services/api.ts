import axios from 'axios';
import { load, remove, KEYS } from '../storage/storage';
import { withRetry } from '../utils/apiErrors';
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

// Redireciona para Login automaticamente se o token expirar
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      await remove(KEYS.token);
      await remove(KEYS.profile);
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);

export { withRetry };
export default api;

import api from './api';
import { save, remove, KEYS } from '../storage/storage';

export type AuthResponse = { token: string };

export const authService = {
  async login(email: string, password: string): Promise<string> {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    await save(KEYS.token, data.token);
    return data.token;
  },

  async register(email: string, password: string): Promise<string> {
    const { data } = await api.post<AuthResponse>('/auth/register', { email, password });
    await save(KEYS.token, data.token);
    return data.token;
  },

  async logout(): Promise<void> {
    try { await api.post('/auth/logout'); } catch { /* ignore */ }
    await remove(KEYS.token);
    await remove(KEYS.profile);
  },
};

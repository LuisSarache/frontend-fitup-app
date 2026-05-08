import api from './api';
import { save, load, remove, KEYS } from '../storage/storage';
import { env } from '../config/env';

export type AuthResponse = { token: string; refreshToken: string };

const USE_MOCK = env.useMock;

type MockUser = { email: string; passwordHash: string };

async function mockLogin(email: string, password: string): Promise<AuthResponse> {
  const users = (await load<MockUser[]>('@fitup:mock_users')) ?? [];
  const user = users.find((u) => u.email === email);
  if (!user) throw new Error('Usuário não encontrado.');
  if (user.passwordHash !== password) throw new Error('Senha incorreta.');
  const token = `mock-token-${email}`;
  return { token, refreshToken: `mock-refresh-${email}` };
}

async function mockRegister(email: string, password: string): Promise<AuthResponse> {
  const users = (await load<MockUser[]>('@fitup:mock_users')) ?? [];
  if (users.find((u) => u.email === email)) throw new Error('E-mail já cadastrado.');
  await save('@fitup:mock_users', [...users, { email, passwordHash: password }]);
  const token = `mock-token-${email}`;
  return { token, refreshToken: `mock-refresh-${email}` };
}

async function saveTokens(token: string, refreshToken: string) {
  await save(KEYS.token, token);
  await save(KEYS.refreshToken, refreshToken);
}

export const authService = {
  async login(email: string, password: string): Promise<string> {
    const { token, refreshToken } = USE_MOCK
      ? await mockLogin(email, password)
      : (await api.post<AuthResponse>('/auth/login', { email, password })).data;
    await saveTokens(token, refreshToken);
    return token;
  },

  async register(email: string, password: string): Promise<string> {
    const { token, refreshToken } = USE_MOCK
      ? await mockRegister(email, password)
      : (await api.post<AuthResponse>('/auth/register', { email, password })).data;
    await saveTokens(token, refreshToken);
    return token;
  },

  async forgotPassword(email: string): Promise<void> {
    if (USE_MOCK) return;
    await api.post('/auth/forgot-password', { email });
  },

  async logout(): Promise<void> {
    if (!USE_MOCK) {
      try {
        const refreshToken = await load<string>(KEYS.refreshToken);
        await api.post('/auth/logout', { refreshToken });
      } catch {
        /* ignore */
      }
    }
    await remove(KEYS.token);
    await remove(KEYS.refreshToken);
    await remove(KEYS.profile);
  },
};

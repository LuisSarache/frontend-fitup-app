import api from './api';
import { save, load, remove, KEYS } from '../storage/storage';
import { env } from '../config/env';

export type AuthResponse = { token: string };

// Mock local — substitua por chamadas reais quando o backend estiver pronto
const USE_MOCK = env.useMock;

type MockUser = { email: string; passwordHash: string };

async function mockLogin(email: string, password: string): Promise<string> {
  const users = (await load<MockUser[]>('@fitup:mock_users')) ?? [];
  const user = users.find((u) => u.email === email);
  if (!user) throw new Error('Usuário não encontrado.');
  if (user.passwordHash !== password) throw new Error('Senha incorreta.');
  return `mock-token-${email}`;
}

async function mockRegister(email: string, password: string): Promise<string> {
  const users = (await load<MockUser[]>('@fitup:mock_users')) ?? [];
  if (users.find((u) => u.email === email)) throw new Error('E-mail já cadastrado.');
  await save('@fitup:mock_users', [...users, { email, passwordHash: password }]);
  return `mock-token-${email}`;
}

export const authService = {
  async login(email: string, password: string): Promise<string> {
    const token = USE_MOCK
      ? await mockLogin(email, password)
      : (await api.post<AuthResponse>('/auth/login', { email, password })).data.token;
    await save(KEYS.token, token);
    return token;
  },

  async register(email: string, password: string): Promise<string> {
    const token = USE_MOCK
      ? await mockRegister(email, password)
      : (await api.post<AuthResponse>('/auth/register', { email, password })).data.token;
    await save(KEYS.token, token);
    return token;
  },

  async forgotPassword(email: string): Promise<void> {
    if (USE_MOCK) return;
    await api.post('/auth/forgot-password', { email });
  },

  async logout(): Promise<void> {
    if (!USE_MOCK) {
      try {
        await api.post('/auth/logout');
      } catch {
        /* ignore */
      }
    }
    await remove(KEYS.token);
    await remove(KEYS.profile);
  },
};

import axios from 'axios';
import { load } from '../storage/storage';
import { KEYS } from '../storage/storage';
import { withRetry } from '../utils/apiErrors';

const api = axios.create({
  baseURL: 'https://api.fitup.app',
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await load<string>(KEYS.token);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export { withRetry };
export default api;

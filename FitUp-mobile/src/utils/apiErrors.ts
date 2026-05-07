import { isAxiosError } from 'axios';

export function parseApiError(error: unknown): string {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : 'Erro inesperado. Tente novamente.';
  }

  const status = error.response?.status;
  const message =
    typeof error.response?.data === 'object' &&
    error.response.data !== null &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string'
      ? error.response.data.message
      : undefined;
  const errorMap: Record<number, string> = {
    400: message ?? 'Dados inválidos. Verifique os campos.',
    401: 'E-mail ou senha incorretos.',
    403: 'Acesso negado.',
    404: 'Conta não encontrada.',
    409: 'Este e-mail já está cadastrado.',
    422: message ?? 'Dados inválidos.',
    429: 'Muitas tentativas. Aguarde alguns minutos.',
    500: 'Erro no servidor. Tente novamente mais tarde.',
    503: 'Serviço indisponível. Tente novamente mais tarde.',
  };
  return status
    ? (errorMap[status] ?? 'Erro inesperado. Tente novamente.')
    : 'Falha de conexão. Verifique sua internet.';
}

export async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, i)));
    }
  }
  throw new Error('Max retries reached');
}

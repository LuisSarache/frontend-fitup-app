import { AxiosError } from 'axios';

export type NetworkError = {
  message: string;
  code?: string;
  isNetworkError: boolean;
  isTimeout: boolean;
  isServerError: boolean;
  statusCode?: number;
};

export function handleNetworkError(error: unknown): NetworkError {
  // Erro de rede (sem conexão)
  if (error instanceof Error && error.message === 'Network request failed') {
    return {
      message: 'Sem conexão com a internet. Verifique sua rede.',
      isNetworkError: true,
      isTimeout: false,
      isServerError: false,
    };
  }

  // Erro do Axios
  if (error instanceof AxiosError) {
    // Timeout
    if (error.code === 'ECONNABORTED') {
      return {
        message: 'A requisição demorou muito. Tente novamente.',
        code: error.code,
        isNetworkError: false,
        isTimeout: true,
        isServerError: false,
      };
    }

    // Sem resposta do servidor
    if (!error.response) {
      return {
        message: 'Não foi possível conectar ao servidor.',
        isNetworkError: true,
        isTimeout: false,
        isServerError: false,
      };
    }

    // Erro do servidor (5xx)
    if (error.response.status >= 500) {
      return {
        message: 'Erro no servidor. Tente novamente mais tarde.',
        statusCode: error.response.status,
        isNetworkError: false,
        isTimeout: false,
        isServerError: true,
      };
    }

    // Erro de autenticação (401)
    if (error.response.status === 401) {
      return {
        message: 'Sessão expirada. Faça login novamente.',
        statusCode: 401,
        isNetworkError: false,
        isTimeout: false,
        isServerError: false,
      };
    }

    // Erro de validação (400)
    if (error.response.status === 400) {
      const serverMessage = error.response.data?.message || error.response.data?.error;
      return {
        message: serverMessage || 'Dados inválidos. Verifique e tente novamente.',
        statusCode: 400,
        isNetworkError: false,
        isTimeout: false,
        isServerError: false,
      };
    }

    // Outros erros HTTP
    return {
      message: error.response.data?.message || 'Algo deu errado. Tente novamente.',
      statusCode: error.response.status,
      isNetworkError: false,
      isTimeout: false,
      isServerError: false,
    };
  }

  // Erro genérico
  return {
    message: error instanceof Error ? error.message : 'Erro desconhecido',
    isNetworkError: false,
    isTimeout: false,
    isServerError: false,
  };
}

export function isOnline(): Promise<boolean> {
  return fetch('https://www.google.com', { method: 'HEAD', mode: 'no-cors' })
    .then(() => true)
    .catch(() => false);
}

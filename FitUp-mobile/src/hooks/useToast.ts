import { Alert } from 'react-native';

interface Toast {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

export function useToast(): Toast {
  return {
    success: (message: string) => {
      Alert.alert('Sucesso', message);
    },
    error: (message: string) => {
      Alert.alert('Erro', message);
    },
    info: (message: string) => {
      Alert.alert('Informação', message);
    },
  };
}

import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

type ToastType = 'success' | 'error' | 'warning' | 'info';

type ToastContextType = {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastContextType>({} as ToastContextType);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const [duration, setDuration] = useState(3000);

  const showToast = useCallback((msg: string, toastType: ToastType = 'info', dur: number = 3000) => {
    setMessage(msg);
    setType(toastType);
    setDuration(dur);
    setVisible(true);
  }, []);

  const success = useCallback((msg: string) => showToast(msg, 'success'), [showToast]);
  const error = useCallback((msg: string) => showToast(msg, 'error'), [showToast]);
  const warning = useCallback((msg: string) => showToast(msg, 'warning'), [showToast]);
  const info = useCallback((msg: string) => showToast(msg, 'info'), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <Toast
        visible={visible}
        message={message}
        type={type}
        duration={duration}
        onHide={() => setVisible(false)}
      />
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

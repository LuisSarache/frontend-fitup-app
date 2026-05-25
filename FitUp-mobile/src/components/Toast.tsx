import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react-native';
import { colors } from '../theme';

type ToastType = 'success' | 'error' | 'warning' | 'info';

type Props = {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide: () => void;
};

const { width } = Dimensions.get('window');

export default function Toast({ visible, message, type = 'info', duration = 3000, onHide }: Props) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => onHide());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, translateY, opacity, onHide]);

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle color="#fff" size={22} />;
      case 'error':
        return <XCircle color="#fff" size={22} />;
      case 'warning':
        return <AlertCircle color="#fff" size={22} />;
      case 'info':
        return <Info color="#fff" size={22} />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return colors.green;
      case 'error':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      case 'info':
        return '#3B82F6';
    }
  };

  return (
    <Animated.View
      style={[
        s.container,
        {
          backgroundColor: getBackgroundColor(),
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      {getIcon()}
      <Text style={s.message} numberOfLines={2}>
        {message}
      </Text>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
    maxWidth: width - 40,
  },
  message: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
});

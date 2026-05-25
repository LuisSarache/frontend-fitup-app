import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { isAxiosError } from 'axios';
import { Mail, Lock, ArrowRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useToast } from '../hooks/useToast';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';
import { authService } from '../services/auth';
import api from '../services/api';
import { env } from '../config/env';
import { UserProfile } from '../types';
import { parseApiError } from '../utils/apiErrors';
import { Analytics } from '../services/analytics';
import { ErrorMessage } from '../components/ErrorMessage';
import { colors, font } from '../theme';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Login'
>;

export default function LoginScreen({
  navigation,
}: Props) {
  const { profile, setToken, setProfile } =
    useApp();
  const toast = useToast();

  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error('Preencha e-mail e senha.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const loginEmail = email.trim();
      const token = await authService.login(
        loginEmail,
        password
      );

      await setToken(token);

      Analytics.login('email');
      toast.success('Login realizado com sucesso!');

      let hasProfile = !!profile;

      if (!env.useMock) {
        try {
          const { data } =
            await api.get<UserProfile>(
              '/profile'
            );

          await setProfile(data);

          hasProfile = true;
        } catch (err) {
          console.error('[Login] Failed to fetch profile:', err);

          if (isAxiosError(err) && err.response?.status === 404) {
            hasProfile = false;
          } else {
            throw err;
          }
        }
      } else {
        hasProfile = !!profile;
      }

      if (hasProfile) {
        navigation.replace('MainTabs', {
          screen: 'Home',
        });
      } else {
        navigation.replace('Onboarding', {
          email: loginEmail,
        });
      }
    } catch (err) {
      const errorMsg = parseApiError(err);
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0A0A0A', '#111827', '#0A0A0A']}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={[
            s.container,
            {
              paddingTop: insets.top + 30,
              paddingBottom: 40,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={s.logoContainer}>
            <LinearGradient
              colors={[
                '#22C55E',
                '#16A34A',
              ]}
              style={s.logo}
            >
              <Text style={s.logoText}>
                H
              </Text>
            </LinearGradient>
          </View>

          {/* Header */}
          <View style={s.header}>
            <Text style={s.title}>
              Bem-vindo{"\n"}de volta 👋
            </Text>

            <Text style={s.subtitle}>
              Faça login para continuar
              sua jornada fitness.
            </Text>
          </View>

          {/* Email */}
          <View style={s.card}>
            <View style={s.inputWrapper}>
              <Mail size={20} color={colors.green} style={s.icon} />
              <View style={s.inputContent}>
                <Text style={s.label}>E-mail</Text>
                <TextInput
                  style={s.input}
                  placeholder="seu@email.com"
                  placeholderTextColor={colors.muted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  textContentType="emailAddress"
                />
              </View>
            </View>
          </View>

          {/* Password */}
          <View style={s.card}>
            <View style={s.inputWrapper}>
              <Lock size={20} color={colors.green} style={s.icon} />
              <View style={s.inputContent}>
                <Text style={s.label}>Senha</Text>
                <TextInput
                  style={s.input}
                  placeholder="••••••••"
                  placeholderTextColor={colors.muted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password"
                  textContentType="password"
                />
              </View>
            </View>
          </View>

          {/* Error */}
          {error && (
            <View style={{ marginTop: 4 }}>
              <ErrorMessage
                message={error}
              />
            </View>
          )}

          {/* Forgot */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                'ForgotPassword'
              )
            }
            style={s.forgotButton}
          >
            <Text style={s.forgotText}>
              Esqueceu a senha?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleLogin}
            disabled={loading}
            style={s.buttonWrapper}
          >
            <LinearGradient
              colors={[
                '#22C55E',
                '#16A34A',
              ]}
              style={s.button}
            >
              <Text style={s.buttonText}>
                {loading
                  ? 'Entrando...'
                  : 'Entrar'}
              </Text>

              {!loading && (
                <ArrowRight
                  size={20}
                  color="#fff"
                />
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Footer */}
          <View style={s.footer}>
            <Text style={s.footerText}>
              Não tem conta?
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  'SignUp'
                )
              }
            >
              <Text style={s.footerLink}>
                Criar conta
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },

  logo: {
    width: 82,
    height: 82,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#22C55E',
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 10,
  },

  logoText: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '900',
  },

  header: {
    marginBottom: 32,
  },

  title: {
    color: colors.white,
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 42,
    marginBottom: 10,
  },

  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 24,
  },

  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    marginRight: 12,
  },

  inputContent: {
    flex: 1,
  },

  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },

  input: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    padding: 0,
  },

  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 28,
  },

  forgotText: {
    color: colors.green,
    fontSize: 14,
    fontWeight: '600',
  },

  buttonWrapper: {
    borderRadius: 24,
    overflow: 'hidden',

    shadowColor: '#22C55E',
    shadowOpacity: 0.35,
    shadowRadius: 18,

    elevation: 10,
  },

  button: {
    height: 62,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 10,
  },

  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    marginTop: 28,
    gap: 6,
  },

  footerText: {
    color: colors.muted,
    fontSize: font.sm,
  },

  footerLink: {
    color: colors.green,
    fontWeight: '700',
    fontSize: font.sm,
  },
});

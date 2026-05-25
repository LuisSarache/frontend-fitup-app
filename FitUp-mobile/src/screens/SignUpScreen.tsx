import React, { useState } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react-native';

import { RootStackParamList } from '../navigation/types';

import { useApp } from '../context/AppContext';

import { authService } from '../services/auth';

import { parseApiError } from '../utils/apiErrors';

import { Analytics } from '../services/analytics';

import { ErrorMessage } from '../components/ErrorMessage';

import { colors, font } from '../theme';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'SignUp'
>;

export default function SignUpScreen({
  navigation,
}: Props) {
  const { setToken } = useApp();

  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');

  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Preencha e-mail e senha.');
      return;
    }

    if (password.length < 6) {
      setError(
        'Senha deve ter pelo menos 6 caracteres.'
      );

      return;
    }

    setLoading(true);

    setError(null);

    try {
      const token =
        await authService.register(
          email.trim(),
          password
        );

      await setToken(token);

      Analytics.signUp('email');

      navigation.replace('Onboarding', {
        email: email.trim(),
      });
    } catch (err) {
      setError(parseApiError(err));
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
              paddingTop: insets.top + 24,
              paddingBottom: 40,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Progress */}
          <View style={s.progressWrapper}>
            <View style={s.progressBg}>
              <View style={s.progressFill} />
            </View>

            <Text style={s.progressText}>
              Etapa 1 de 2
            </Text>
          </View>

          {/* Logo */}
          <View style={s.logoContainer}>
            <LinearGradient
              colors={[
                '#22C55E',
                '#16A34A',
              ]}
              style={s.logo}
            >
              <Sparkles
                size={34}
                color="#fff"
              />
            </LinearGradient>
          </View>

          {/* Header */}
          <View style={s.header}>
            <Text style={s.title}>
              Crie sua{"\n"}conta 🚀
            </Text>

            <Text style={s.subtitle}>
              Comece sua jornada fitness
              hoje mesmo.
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
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={colors.muted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="new-password"
                  textContentType="newPassword"
                />
                <Text style={s.passwordHint}>
                  Use uma senha segura 🔒
                </Text>
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

          {/* Register Button */}
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={loading}
            onPress={handleRegister}
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
                  ? 'Criando conta...'
                  : 'Cadastrar'}
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
              Já possui conta?
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.goBack()
              }
            >
              <Text style={s.footerLink}>
                Entrar
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

  progressWrapper: {
    marginBottom: 28,
  },

  progressBg: {
    height: 6,
    backgroundColor: '#1F2937',
    borderRadius: 999,
    overflow: 'hidden',
  },

  progressFill: {
    width: '50%',
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 999,
  },

  progressText: {
    color: colors.muted,
    marginTop: 8,
    fontSize: 12,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 34,
  },

  logo: {
    width: 84,
    height: 84,
    borderRadius: 28,

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#22C55E',
    shadowOpacity: 0.4,
    shadowRadius: 18,

    elevation: 10,
  },

  header: {
    marginBottom: 30,
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
    alignItems: 'flex-start',
  },

  icon: {
    marginRight: 12,
    marginTop: 2,
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

  passwordHint: {
    marginTop: 8,
    color: colors.green,
    fontSize: 12,
    fontWeight: '600',
  },

  buttonWrapper: {
    marginTop: 18,

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

    gap: 6,

    marginTop: 28,
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

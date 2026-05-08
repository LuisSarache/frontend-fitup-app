import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';
import { authService } from '../services/auth';
import api from '../services/api';
import { env } from '../config/env';
import { UserProfile } from '../types';
import { parseApiError } from '../utils/apiErrors';
import { Analytics } from '../services/analytics';
import { ErrorMessage } from '../components/ErrorMessage';
import { Button, TextField } from '../components/ui';
import { colors, font } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { profile, setToken } = useApp();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = await authService.login(email.trim(), password);
      await setToken(token);
      Analytics.login('email');
      let hasProfile = !!profile;
      if (!env.useMock) {
        try {
          const { data } = await api.get<UserProfile>('/profile');
          await setProfile(data);
          hasProfile = true;
        } catch {
          hasProfile = false;
        }
      }
      if (hasProfile) navigation.replace('MainTabs', { screen: 'Home' });
      else navigation.replace('Onboarding');
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[s.content, { paddingTop: insets.top + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.title}>Bem-vindo de volta 👋</Text>
        <Text style={s.sub}>Faça login para continuar</Text>

        <TextField
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
        />
        <TextField
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
          textContentType="password"
        />

        {error && <ErrorMessage message={error} />}

        <Button title="Entrar" onPress={handleLogin} loading={loading} />

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={{ marginTop: 24 }}>
          <Text style={s.link}>
            Não tem conta? <Text style={{ color: colors.green }}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={{ marginTop: 12 }}
        >
          <Text style={s.link}>
            Esqueceu a senha? <Text style={{ color: colors.green }}>Recuperar</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: font.xl, fontWeight: '800', color: colors.white, marginBottom: 4 },
  sub: { fontSize: font.md, color: colors.muted, marginBottom: 32 },
  link: { textAlign: 'center', color: colors.muted, fontSize: font.sm },
});

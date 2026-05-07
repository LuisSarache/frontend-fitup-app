import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';
import { authService } from '../services/auth';
import { parseApiError } from '../utils/apiErrors';
import { Analytics } from '../services/analytics';
import { ErrorMessage } from '../components/ErrorMessage';
import { Button, TextField } from '../components/ui';
import { colors, font } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export default function SignUpScreen({ navigation }: Props) {
  const { setToken } = useApp();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Preencha e-mail e senha.');
      return;
    }
    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = await authService.register(email.trim(), password);
      await setToken(token);
      Analytics.signUp('email');
      navigation.replace('Onboarding');
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
        <View style={s.stepsRow}>
          <View style={[s.step, s.stepActive]} />
          <View style={s.step} />
        </View>
        <Text style={s.stepLabel}>Etapa 1 de 2</Text>
        <Text style={s.title}>Criar conta</Text>
        <Text style={s.sub}>Comece sua jornada fitness hoje</Text>

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
          placeholder="Senha (min. 6 caracteres)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="new-password"
          textContentType="newPassword"
        />

        {error && <ErrorMessage message={error} />}

        <Button title="Cadastrar" onPress={handleRegister} loading={loading} />

        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 24 }}>
          <Text style={s.link}>
            Já tem conta? <Text style={{ color: colors.green }}>Entrar</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  stepsRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  step: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.border },
  stepActive: { backgroundColor: colors.green },
  stepLabel: { fontSize: 11, color: colors.muted, marginBottom: 20 },
  container: { flex: 1, backgroundColor: colors.bg },
  content: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: font.xl, fontWeight: '800', color: colors.white, marginBottom: 4 },
  sub: { fontSize: font.md, color: colors.muted, marginBottom: 32 },
  link: { textAlign: 'center', color: colors.muted, fontSize: font.sm },
});

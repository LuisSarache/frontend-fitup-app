import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { authService } from '../services/auth';
import { parseApiError } from '../utils/apiErrors';
import { ErrorMessage } from '../components/ErrorMessage';
import BackButton from '../components/BackButton';
import { Button, TextField } from '../components/ui';
import { colors, font } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!email.trim() || !email.includes('@')) {
      setError('Digite um e-mail válido.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authService.forgotPassword(email.trim());
      setSent(true);
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
      >
        <BackButton />

        {sent ? (
          <View style={s.center}>
            <Text style={s.icon}>📧</Text>
            <Text style={s.title}>E-mail enviado!</Text>
            <Text style={s.sub}>
              Verifique sua caixa de entrada em{'\n'}
              <Text style={s.email}>{email}</Text>
            </Text>
            <Button title="Voltar ao login" onPress={() => navigation.navigate('Login')} />
          </View>
        ) : (
          <>
            <Text style={s.title}>Recuperar senha</Text>
            <Text style={s.sub}>
              Digite seu e-mail e enviaremos um link para redefinir sua senha.
            </Text>

            <TextField
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              autoFocus
            />

            {error && <ErrorMessage message={error} />}

            <Button title="Enviar link" onPress={handleSend} loading={loading} />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { flexGrow: 1, padding: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: font.xl, fontWeight: '800', color: colors.white, marginBottom: 8 },
  sub: { fontSize: font.md, color: colors.muted, marginBottom: 32, lineHeight: 24 },
  email: { color: colors.green, fontWeight: '700' },
});

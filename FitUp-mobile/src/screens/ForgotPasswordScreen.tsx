import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, Text, StyleSheet, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Mail } from 'lucide-react-native';
import { RootStackParamList } from '../navigation/types';
import { ErrorMessage } from '../components/ErrorMessage';
import BackButton from '../components/BackButton';
import { Button } from '../components/ui';
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
    // TODO: chamar API de recuperação de senha
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <LinearGradient colors={['#0A0A0A', '#111827', '#0A0A0A']} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[s.content, { paddingTop: insets.top + 24 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={s.backWrapper}>
            <BackButton />
          </View>

          {sent ? (
            <View style={s.center}>
              <View style={s.iconWrapper}>
                <Text style={s.icon}>📧</Text>
              </View>
              <Text style={s.title}>E-mail enviado!</Text>
              <Text style={s.sub}>
                Verifique sua caixa de entrada em{'\n'}
                <Text style={s.email}>{email}</Text>
              </Text>
              <Button title="Voltar ao login" onPress={() => navigation.navigate('Login')} />
            </View>
          ) : (
            <>
              <View style={s.header}>
                <Text style={s.title}>Recuperar{'\n'}senha 🔐</Text>
                <Text style={s.sub}>
                  Digite seu e-mail e enviaremos um link para redefinir sua senha.
                </Text>
              </View>

              <View style={s.card}>
                <View style={s.labelRow}>
                  <Mail size={18} color={colors.green} />
                  <Text style={s.label}>E-mail</Text>
                </View>
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
                  autoFocus
                />
              </View>

              {error && <ErrorMessage message={error} />}

              <Button title="Enviar link" onPress={handleSend} loading={loading} />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  backWrapper: { marginBottom: 20 },
  header: { marginBottom: 32 },
  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 42,
    marginBottom: 12,
  },
  sub: { color: '#9CA3AF', fontSize: 15, lineHeight: 24 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 16,
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  label: { color: colors.muted, fontSize: 14, fontWeight: '600' },
  input: { color: colors.white, fontSize: 18, fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(34,197,94,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: { fontSize: 48 },
  email: { color: colors.green, fontWeight: '700' },
});

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';
import { authService } from '../services/auth';
import { parseApiError } from '../utils/apiErrors';
import { Analytics } from '../services/analytics';
import { ErrorMessage } from '../components/ErrorMessage';
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
    if (!email.trim() || !password.trim()) { setError('Preencha e-mail e senha.'); return; }
    if (password.length < 6) { setError('Senha deve ter pelo menos 6 caracteres.'); return; }
    setLoading(true); setError(null);
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
    <View style={[s.container, { paddingTop: insets.top + 24 }]}>
      <Text style={s.title}>Criar conta</Text>
      <Text style={s.sub}>Comece sua jornada fitness hoje</Text>

      <TextInput style={s.input} placeholder="E-mail" placeholderTextColor={colors.muted}
        value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={s.input} placeholder="Senha (mín. 6 caracteres)" placeholderTextColor={colors.muted}
        value={password} onChangeText={setPassword} secureTextEntry />

      {error && <ErrorMessage message={error} />}

      <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color={colors.white} /> : <Text style={s.btnText}>Cadastrar</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 24 }}>
        <Text style={s.link}>Já tem conta? <Text style={{ color: colors.green }}>Entrar</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 24, justifyContent: 'center' },
  title: { fontSize: font.xl, fontWeight: '800', color: colors.white, marginBottom: 4 },
  sub: { fontSize: font.md, color: colors.muted, marginBottom: 32 },
  input: { backgroundColor: colors.card, color: colors.white, borderRadius: 12, padding: 14, fontSize: font.md, marginBottom: 14, borderWidth: 1, borderColor: colors.border },
  btn: { backgroundColor: colors.green, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 4 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: colors.white, fontWeight: '700', fontSize: font.md },
  link: { textAlign: 'center', color: colors.muted, fontSize: font.sm },
});

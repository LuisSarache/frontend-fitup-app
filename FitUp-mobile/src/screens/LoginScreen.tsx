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

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { setToken } = useApp();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) { setError('Preencha e-mail e senha.'); return; }
    setLoading(true); setError(null);
    try {
      const token = await authService.login(email.trim(), password);
      await setToken(token);
      Analytics.login('email');
      navigation.replace('Home');
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  // Dev shortcut — remove when backend is ready
  const handleDevSkip = () => navigation.replace('Home');

  return (
    <View style={[s.container, { paddingTop: insets.top + 24 }]}>
      <Text style={s.title}>Bem-vindo de volta 👋</Text>
      <Text style={s.sub}>Faça login para continuar</Text>

      <TextInput style={s.input} placeholder="E-mail" placeholderTextColor={colors.muted}
        value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={s.input} placeholder="Senha" placeholderTextColor={colors.muted}
        value={password} onChangeText={setPassword} secureTextEntry />

      {error && <ErrorMessage message={error} />}

      <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color={colors.white} /> : <Text style={s.btnText}>Entrar</Text>}
      </TouchableOpacity>

      <Text style={s.or}>— ou continue com —</Text>
      <TouchableOpacity style={s.social}><Text style={s.socialText}>🇬 Entrar com Google</Text></TouchableOpacity>
      <TouchableOpacity style={[s.social, { marginTop: 10 }]}><Text style={s.socialText}>📘 Entrar com Facebook</Text></TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={{ marginTop: 24 }}>
        <Text style={s.link}>Não tem conta? <Text style={{ color: colors.green }}>Cadastre-se</Text></Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDevSkip} style={{ marginTop: 12 }}>
        <Text style={[s.link, { color: colors.muted }]}>[Dev] Pular login →</Text>
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
  or: { textAlign: 'center', color: colors.muted, marginVertical: 20, fontSize: font.sm },
  social: { backgroundColor: colors.card, borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  socialText: { color: colors.white, fontSize: font.md },
  link: { textAlign: 'center', color: colors.muted, fontSize: font.sm },
});

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ErrorMessage } from '../components/ErrorMessage';
import BackButton from '../components/BackButton';
import { colors, font } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = () => {
    if (!email.trim() || !email.includes('@')) {
      setError('Digite um e-mail válido.');
      return;
    }
    setError(null);
    // TODO: chamar API de recuperação de senha
    setSent(true);
  };

  return (
    <View style={[s.container, { paddingTop: insets.top + 24 }]}>
      <BackButton />

      {sent ? (
        <View style={s.center}>
          <Text style={s.icon}>📧</Text>
          <Text style={s.title}>E-mail enviado!</Text>
          <Text style={s.sub}>Verifique sua caixa de entrada em{'\n'}<Text style={s.email}>{email}</Text></Text>
          <TouchableOpacity style={s.btn} onPress={() => navigation.navigate('Login')}>
            <Text style={s.btnText}>Voltar ao login</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={s.title}>Recuperar senha</Text>
          <Text style={s.sub}>Digite seu e-mail e enviaremos um link para redefinir sua senha.</Text>

          <TextInput
            style={s.input}
            placeholder="seu@email.com"
            placeholderTextColor={colors.muted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoFocus
          />

          {error && <ErrorMessage message={error} />}

          <TouchableOpacity style={s.btn} onPress={handleSend}>
            <Text style={s.btnText}>Enviar link</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: font.xl, fontWeight: '800', color: colors.white, marginBottom: 8 },
  sub: { fontSize: font.md, color: colors.muted, marginBottom: 32, lineHeight: 24 },
  email: { color: colors.green, fontWeight: '700' },
  input: { backgroundColor: colors.card, color: colors.white, borderRadius: 12, padding: 14, fontSize: font.md, borderWidth: 1, borderColor: colors.border, marginBottom: 14 },
  btn: { backgroundColor: colors.green, borderRadius: 12, padding: 16, alignItems: 'center' },
  btnText: { color: colors.white, fontWeight: '700', fontSize: font.md },
});

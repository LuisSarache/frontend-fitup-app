import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardTypeOptions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';
import { validateAll, maskDate, FormErrors } from '../utils/validation';
import { requestNotificationPermissions, scheduleDailyReminder } from '../services/notifications';
import { Analytics } from '../services/analytics';
import { calculateAge } from '../utils/health';
import { colors, font } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export default function OnboardingScreen({ navigation }: Props) {
  const { setProfile, profile } = useApp();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState(profile?.email ?? '');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [dob, setDob] = useState('');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const touch = (field: string) => setTouched((prev) => ({ ...prev, [field]: true }));

  const handleContinue = async () => {
    const errs = validateAll(name, weight, height, dob, email);
    setErrors(errs);
    setTouched({ name: true, email: true, weight: true, height: true, dob: true });
    if (Object.values(errs).some(Boolean)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const dobISO = (() => {
      const [d, m, y] = dob.split('/');
      return new Date(Number(y), Number(m) - 1, Number(d)).toISOString();
    })();

    const age = calculateAge(dobISO);
    const ageGroup = age < 18 ? '15-18' : age < 22 ? '19-22' : age < 26 ? '23-25' : '25+';

    await setProfile({
      name: name.trim(),
      email: email.trim(),
      weightKg: parseFloat(weight.replace(',', '.')),
      heightCm: parseInt(height, 10),
      dateOfBirth: dobISO,
      sex,
      level: 'Beginner',
    });

    Analytics.onboardingCompleted(ageGroup);

    const granted = await requestNotificationPermissions();
    if (granted) await scheduleDailyReminder(18, name.trim());

    navigation.navigate('LevelSelection');
  };

  const fields: {
    key: keyof FormErrors;
    label: string;
    value: string;
    set: (v: string) => void;
    placeholder: string;
    keyboard?: KeyboardTypeOptions;
    transform?: (v: string) => string;
  }[] = [
    { key: 'name', label: 'Nome', value: name, set: setName, placeholder: 'Seu nome' },
    {
      key: 'email',
      label: 'E-mail',
      value: email,
      set: setEmail,
      placeholder: 'seu@email.com',
      keyboard: 'email-address' as KeyboardTypeOptions,
    },
    {
      key: 'weight',
      label: 'Peso (kg)',
      value: weight,
      set: setWeight,
      placeholder: 'Ex: 70',
      keyboard: 'numeric',
    },
    {
      key: 'height',
      label: 'Altura (cm)',
      value: height,
      set: setHeight,
      placeholder: 'Ex: 175',
      keyboard: 'numeric',
    },
    {
      key: 'dob',
      label: 'Data de Nascimento',
      value: dob,
      set: (v) => setDob(maskDate(v)),
      placeholder: 'DD/MM/AAAA',
      keyboard: 'numeric',
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={[s.container, { paddingTop: insets.top + 24 }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={s.stepsRow}>
        <View style={[s.step, s.stepDone]} />
        <View style={[s.step, s.stepActive]} />
      </View>
      <Text style={s.stepLabel}>Etapa 2 de 2</Text>
      <Text style={s.title}>Vamos te conhecer{'\n'}melhor 💪</Text>
      <Text style={s.sub}>Preencha seus dados para personalizar sua experiência</Text>

      {fields.map(({ key, label, value, set, placeholder, keyboard }) => (
        <View key={key} style={s.fieldGroup}>
          <Text style={s.label}>{label}</Text>
          <TextInput
            style={[s.input, touched[key] && errors[key] && s.inputError]}
            placeholder={placeholder}
            placeholderTextColor={colors.muted}
            value={value}
            onChangeText={set}
            onBlur={() => {
              touch(key);
              setErrors(validateAll(name, weight, height, dob, email));
            }}
            keyboardType={keyboard ?? 'default'}
          />
          {touched[key] && errors[key] && <Text style={s.errorText}>⚠ {errors[key]}</Text>}
        </View>
      ))}

      {/* Sex selector */}
      <View style={s.fieldGroup}>
        <Text style={s.label}>Sexo biológico</Text>
        <View style={s.sexRow}>
          {(['male', 'female'] as const).map((s_) => (
            <TouchableOpacity
              key={s_}
              style={[s.sexBtn, sex === s_ && s.sexBtnActive]}
              onPress={() => setSex(s_)}
            >
              <Text style={[s.sexText, sex === s_ && s.sexTextActive]}>
                {s_ === 'male' ? '♂ Masculino' : '♀ Feminino'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={s.btn} onPress={handleContinue} accessibilityRole="button">
        <Text style={s.btnText}>Continuar →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  stepsRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  step: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.border },
  stepActive: { backgroundColor: colors.green },
  stepDone: { backgroundColor: colors.greenDim },
  stepLabel: { fontSize: 11, color: colors.muted, marginBottom: 20 },
  container: { flexGrow: 1, backgroundColor: colors.bg, padding: 24 },
  title: {
    fontSize: font.xl,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 8,
    lineHeight: 34,
  },
  sub: { fontSize: font.sm, color: colors.muted, marginBottom: 32 },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: font.sm, color: colors.muted, marginBottom: 6 },
  input: {
    backgroundColor: colors.card,
    color: colors.white,
    borderRadius: 12,
    padding: 14,
    fontSize: font.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: { borderColor: '#EF4444' },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 4 },
  sexRow: { flexDirection: 'row', gap: 10 },
  sexBtn: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  sexBtnActive: { borderColor: colors.green, backgroundColor: colors.green + '22' },
  sexText: { color: colors.muted, fontWeight: '600', fontSize: font.md },
  sexTextActive: { color: colors.green },
  btn: {
    backgroundColor: colors.green,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: { color: colors.white, fontWeight: '700', fontSize: font.md },
});

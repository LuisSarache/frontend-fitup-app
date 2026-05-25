import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  KeyboardTypeOptions,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  User,
  Weight,
  Ruler,
  CalendarDays,
  Mars,
  Venus,
} from 'lucide-react-native';

import { RootStackParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';
import { UserProfile } from '../types';

import {
  validateAll,
  maskDate,
  FormErrors,
} from '../utils/validation';

import {
  requestNotificationPermissions,
  scheduleDailyReminder,
} from '../services/notifications';

import { Analytics } from '../services/analytics';
import { calculateAge } from '../utils/health';
import { colors } from '../theme';
import api from '../services/api';
import { env } from '../config/env';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Onboarding'
>;

export default function OnboardingScreen({
  navigation,
}: Props) {
  const { setProfile, profile } = useApp();

  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [dob, setDob] = useState('');
  const [sex, setSex] = useState<'male' | 'female'>('male');

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const touch = (field: string) =>
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

  const handleContinue = async () => {
    const errs = validateAll(
      name,
      weight,
      height,
      dob
    );

    setErrors(errs);

    setTouched({
      name: true,
      weight: true,
      height: true,
      dob: true,
    });

    if (Object.values(errs).some(Boolean)) {
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error
      );
      return;
    }

    const dobISO = (() => {
      const [d, m, y] = dob.split('/');

      return new Date(
        Number(y),
        Number(m) - 1,
        Number(d)
      ).toISOString();
    })();

    const age = calculateAge(dobISO);

    const ageGroup =
      age < 18
        ? '15-18'
        : age < 22
        ? '19-22'
        : age < 26
        ? '23-25'
        : '25+';

    const profileData: UserProfile = {
      name: name.trim(),
      email: profile?.email ?? '',
      weightKg: parseFloat(weight.replace(',', '.')),
      heightCm: parseInt(height, 10),
      dateOfBirth: dobISO,
      sex,
      level: 'Beginner',
    };

    await setProfile(profileData);

    if (!env.useMock) {
      try {
        await api.put('/profile', profileData);
      } catch (err) {
        console.error('[Onboarding] Failed to sync profile:', err);
      }
    }

    Analytics.onboardingCompleted(ageGroup);

    const granted =
      await requestNotificationPermissions();

    if (granted) {
      await scheduleDailyReminder(
        18,
        name.trim()
      );
    }

    navigation.navigate('LevelSelection');
  };

  const fields: {
    key: keyof FormErrors;
    label: string;
    value: string;
    set: (v: string) => void;
    placeholder: string;
    icon: any;
    keyboard?: KeyboardTypeOptions;
  }[] = [
    {
      key: 'name',
      label: 'Nome',
      value: name,
      set: setName,
      placeholder: 'Como podemos te chamar?',
      icon: User,
    },
    {
      key: 'dob',
      label: 'Nascimento',
      value: dob,
      set: (v) => setDob(maskDate(v)),
      placeholder: 'DD/MM/AAAA',
      keyboard: 'numeric',
      icon: CalendarDays,
    },
  ];

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
              paddingTop: insets.top + 20,
              paddingBottom: 40,
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Progress */}
          <View style={s.progressWrapper}>
            <View style={s.progressBg}>
              <View style={s.progressFill} />
            </View>

            <Text style={s.progressText}>
              Etapa 2 de 2
            </Text>
          </View>

          {/* Header */}
          <View style={s.header}>
            <Text style={s.title}>
              Vamos criar seu{"\n"}
              perfil fitness 💪
            </Text>

            <Text style={s.subtitle}>
              Personalize treinos, metas e sua
              experiência no app.
            </Text>
          </View>

          {/* Main Fields */}
          {fields.map(
            ({
              key,
              label,
              value,
              set,
              placeholder,
              keyboard,
              icon: Icon,
            }) => (
              <View key={key} style={s.card}>
                <View style={s.inputWrapper}>
                  <Icon size={20} color={colors.green} style={s.icon} />
                  <View style={s.inputContent}>
                    <Text style={s.label}>{label}</Text>
                    <TextInput
                      style={s.input}
                      placeholder={placeholder}
                      placeholderTextColor={colors.muted}
                      value={value}
                      onChangeText={set}
                      keyboardType={keyboard ?? 'default'}
                      onBlur={() => {
                        touch(key);
                        setErrors(validateAll(name, weight, height, dob));
                      }}
                    />
                  </View>
                </View>
                {touched[key] && errors[key] && (
                  <Text style={s.error}>⚠ {errors[key]}</Text>
                )}
              </View>
            )
          )}

          {/* Weight & Height */}
          <View style={s.row}>
            <View style={[s.card, { flex: 1 }]}>
              <View style={s.inputWrapper}>
                <Weight size={20} color={colors.green} style={s.icon} />
                <View style={s.inputContent}>
                  <Text style={s.label}>Peso</Text>
                  <TextInput
                    style={s.input}
                    placeholder="70"
                    placeholderTextColor={colors.muted}
                    keyboardType="numeric"
                    value={weight}
                    onChangeText={setWeight}
                  />
                  <Text style={s.unit}>kg</Text>
                </View>
              </View>
              {touched.weight && errors.weight && (
                <Text style={s.error}>⚠ {errors.weight}</Text>
              )}
            </View>

            <View style={[s.card, { flex: 1 }]}>
              <View style={s.inputWrapper}>
                <Ruler size={20} color={colors.green} style={s.icon} />
                <View style={s.inputContent}>
                  <Text style={s.label}>Altura</Text>
                  <TextInput
                    style={s.input}
                    placeholder="175"
                    placeholderTextColor={colors.muted}
                    keyboardType="numeric"
                    value={height}
                    onChangeText={setHeight}
                  />
                  <Text style={s.unit}>cm</Text>
                </View>
              </View>
              {touched.height && errors.height && (
                <Text style={s.error}>⚠ {errors.height}</Text>
              )}
            </View>
          </View>

          {/* Gender */}
          <View style={s.genderWrapper}>
            <Text style={s.genderTitle}>
              Sexo biológico
            </Text>

            <View style={s.genderRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  s.genderCard,
                  sex === 'male' &&
                    s.genderCardActive,
                ]}
                onPress={() =>
                  setSex('male')
                }
              >
                <Mars
                  size={30}
                  color={
                    sex === 'male'
                      ? colors.green
                      : colors.muted
                  }
                />

                <Text
                  style={[
                    s.genderText,
                    sex === 'male' &&
                      s.genderTextActive,
                  ]}
                >
                  Masculino
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  s.genderCard,
                  sex === 'female' &&
                    s.genderCardActive,
                ]}
                onPress={() =>
                  setSex('female')
                }
              >
                <Venus
                  size={30}
                  color={
                    sex === 'female'
                      ? colors.green
                      : colors.muted
                  }
                />

                <Text
                  style={[
                    s.genderText,
                    sex === 'female' &&
                      s.genderTextActive,
                  ]}
                >
                  Feminino
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* CTA */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={s.button}
            onPress={handleContinue}
          >
            <LinearGradient
              colors={[
                '#22C55E',
                '#16A34A',
              ]}
              style={s.buttonGradient}
            >
              <Text style={s.buttonText}>
                Continuar →
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    flexGrow: 1,
  },

  progressWrapper: {
    marginBottom: 30,
  },

  progressBg: {
    height: 6,
    backgroundColor: '#1F2937',
    borderRadius: 999,
    overflow: 'hidden',
  },

  progressFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 999,
  },

  progressText: {
    color: colors.muted,
    marginTop: 8,
    fontSize: 12,
  },

  header: {
    marginBottom: 30,
  },

  title: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.white,
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

  row: {
    flexDirection: 'row',
    gap: 14,
  },

  unit: {
    color: colors.green,
    marginTop: 6,
    fontWeight: '600',
    fontSize: 12,
  },

  error: {
    color: '#EF4444',
    marginTop: 8,
    fontSize: 12,
  },

  genderWrapper: {
    marginTop: 10,
    marginBottom: 10,
  },

  genderTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },

  genderRow: {
    flexDirection: 'row',
    gap: 14,
  },

  genderCard: {
    flex: 1,
    backgroundColor:
      'rgba(255,255,255,0.04)',
    borderRadius: 24,
    paddingVertical: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.05)',
  },

  genderCardActive: {
    borderColor: '#22C55E',
    backgroundColor:
      'rgba(34,197,94,0.12)',
  },

  genderText: {
    marginTop: 10,
    color: colors.muted,
    fontWeight: '700',
    fontSize: 15,
  },

  genderTextActive: {
    color: colors.green,
  },

  button: {
    marginTop: 30,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#22C55E',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },

  buttonGradient: {
    height: 62,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
});

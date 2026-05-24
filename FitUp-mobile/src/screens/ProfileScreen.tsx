import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import { MainTabParamList, RootStackParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import {
  calculateBMI,
  getBMICategory,
  calculateAge,
  calculateBMR,
  calculateIdealWeight,
} from '../utils/health';
import {
  scheduleDailyReminder,
  cancelAllReminders,
  requestNotificationPermissions,
} from '../services/notifications';
import { Analytics } from '../services/analytics';
import { save, load, KEYS } from '../storage/storage';
import { colors, font } from '../theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function ProfileScreen({ navigation }: Props) {
  const { profile, logout, setProfile } = useApp();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile?.name ?? '');
  const [weight, setWeight] = useState(String(profile?.weightKg ?? ''));
  const [height, setHeight] = useState(String(profile?.heightCm ?? ''));
  const [selectedEmoji, setSelectedEmoji] = useState(profile?.avatar ?? '👤');
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifHour, setNotifHour] = useState(18);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  React.useEffect(() => {
    load<boolean>(KEYS.notifEnabled).then((v) => {
      if (v !== null) setNotifEnabled(v);
    });
    load<number>(KEYS.notifHour).then((v) => {
      if (v !== null) setNotifHour(v);
    });
    load<boolean>(KEYS.analyticsEnabled).then((v) => {
      if (v !== null) setAnalyticsEnabled(v);
    });
  }, []);

  if (!profile) return null;

  const bmi = calculateBMI(profile.weightKg, profile.heightCm);
  const bmiCat = getBMICategory(bmi);
  const age = calculateAge(profile.dateOfBirth);
  const bmr = calculateBMR(profile.weightKg, profile.heightCm, age, profile.sex);
  const ideal = calculateIdealWeight(profile.heightCm, profile.sex);

  const handleSave = async () => {
    const w = parseFloat(weight.replace(',', '.'));
    const h = parseInt(height, 10);
    if (!name.trim() || isNaN(w) || isNaN(h)) {
      toast.error('Dados inválidos. Verifique os campos antes de salvar.');
      return;
    }
    await setProfile({ ...profile, name: name.trim(), weightKg: w, heightCm: h, avatar: selectedEmoji });
    setEditing(false);
    toast.success('Perfil atualizado com sucesso!');
  };

  const handleNotifToggle = async (val: boolean) => {
    setNotifEnabled(val);
    await save(KEYS.notifEnabled, val);
    Analytics.event('notifications_toggled', { enabled: val ? 1 : 0 });
    if (val) {
      const granted = await requestNotificationPermissions();
      if (granted) {
        await scheduleDailyReminder(notifHour, profile.name);
      } else {
        setNotifEnabled(false);
        await save(KEYS.notifEnabled, false);
      }
    } else {
      await cancelAllReminders();
    }
  };

  const handleAnalyticsToggle = async (val: boolean) => {
    setAnalyticsEnabled(val);
    await save(KEYS.analyticsEnabled, val);
    Analytics.setCollectionEnabled(val);
    if (val) Analytics.event('analytics_collection_enabled');
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            })
          );
        },
      },
    ]);
  };

  return (
    <View style={s.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[s.header, { paddingTop: insets.top + 16 }]}>
          <Text style={s.title}>Perfil</Text>
          <TouchableOpacity
            onPress={() => (editing ? handleSave() : setEditing(true))}
            style={s.editBtn}
          >
            <Text style={s.editText}>{editing ? 'Salvar' : 'Editar'}</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={s.avatarSection}>
          {editing ? (
            <View style={s.emojiSelector}>
              {['👤', '💪', '🏋️', '⚡', '🔥', '🏆', '🥇'].map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[s.emojiBtn, selectedEmoji === emoji && s.emojiBtnActive]}
                  onPress={() => setSelectedEmoji(emoji)}
                  activeOpacity={0.7}
                >
                  <Text style={s.emojiOption}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={s.avatar}>{selectedEmoji}</Text>
          )}
          {editing ? (
            <TextInput
              style={s.nameInput}
              value={name}
              onChangeText={setName}
              placeholderTextColor={colors.muted}
            />
          ) : (
            <Text style={s.name}>{profile.name}</Text>
          )}
          <Text style={s.email}>{profile.email}</Text>
        </View>

        {/* Metrics */}
        <Text style={s.sectionLabel}>MÉTRICAS</Text>
        <View style={s.metricsRow}>
          <View style={s.metricCard}>
            {editing ? (
              <TextInput
                style={s.metricInput}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholderTextColor={colors.muted}
              />
            ) : (
              <Text style={s.metricValue}>{profile.weightKg}kg</Text>
            )}
            <Text style={s.metricLabel}>Peso</Text>
          </View>
          <View style={s.metricCard}>
            {editing ? (
              <TextInput
                style={s.metricInput}
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                placeholderTextColor={colors.muted}
              />
            ) : (
              <Text style={s.metricValue}>{profile.heightCm}cm</Text>
            )}
            <Text style={s.metricLabel}>Altura</Text>
          </View>
          <View style={s.metricCard}>
            <Text style={s.metricValue}>{age}</Text>
            <Text style={s.metricLabel}>Anos</Text>
          </View>
        </View>

        {/* BMI */}
        <View style={s.bmiCard}>
          <View style={s.bmiRow}>
            <Text style={s.bmiValue}>
              IMC: <Text style={{ color: bmiCat.color }}>{bmi}</Text>
            </Text>
            <Text style={[s.bmiLabel, { color: bmiCat.color }]}>{bmiCat.label}</Text>
          </View>
          <Text style={s.bmiDesc}>{bmiCat.description}</Text>
          <View style={s.bmiBarBg}>
            <View
              style={[
                s.bmiBarFill,
                { width: `${Math.min((bmi / 40) * 100, 100)}%`, backgroundColor: bmiCat.color },
              ]}
            />
          </View>
          <View style={s.bmiExtraRow}>
            <Text style={s.bmiExtra}>
              TMB: <Text style={s.bmiExtraVal}>{bmr} kcal/dia</Text>
            </Text>
            <Text style={s.bmiExtra}>
              Peso ideal: <Text style={s.bmiExtraVal}>{ideal}kg</Text>
            </Text>
          </View>
          <Text style={s.disclaimer}>
            ⚠ Valores de referência. Consulte um profissional de saúde.
          </Text>
        </View>

        {/* Notifications */}
        <Text style={s.sectionLabel}>CONFIGURAÇÕES</Text>
        <TouchableOpacity style={s.settingRow} onPress={() => navigation.navigate('ChangeLevel')}>
          <Text style={s.settingLabel}>🎯 Nível de treino</Text>
          <Text style={s.settingValue}>
            {profile.level === 'Beginner'
              ? 'Iniciante'
              : profile.level === 'Intermediate'
                ? 'Intermediário'
                : 'Avançado'}{' '}
            ›
          </Text>
        </TouchableOpacity>
        <View style={s.settingRow}>
          <Text style={s.settingLabel}>🔔 Lembretes de treino</Text>
          <Switch
            value={notifEnabled}
            onValueChange={handleNotifToggle}
            trackColor={{ true: colors.green }}
            thumbColor={colors.white}
          />
        </View>
        <View style={s.settingRow}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={s.settingLabel}>Dados de uso</Text>
            <Text style={s.settingHint}>Ajuda a melhorar o app sem enviar nome ou e-mail.</Text>
          </View>
          <Switch
            value={analyticsEnabled}
            onValueChange={handleAnalyticsToggle}
            trackColor={{ true: colors.green }}
            thumbColor={colors.white}
          />
        </View>
        {notifEnabled && (
          <View style={s.settingRow}>
            <Text style={s.settingLabel}>⏰ Horário do lembrete</Text>
            <View style={s.hourRow}>
              {[7, 12, 18, 20].map((h) => (
                <TouchableOpacity
                  key={h}
                  style={[s.hourBtn, notifHour === h && s.hourBtnActive]}
                  onPress={async () => {
                    setNotifHour(h);
                    await save(KEYS.notifHour, h);
                    if (notifEnabled) await scheduleDailyReminder(h, profile.name);
                  }}
                >
                  <Text style={[s.hourText, notifHour === h && s.hourTextActive]}>{h}h</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
          <Text style={s.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { marginRight: 12, padding: 4 },
  backText: { color: colors.white, fontSize: 32, lineHeight: 34 },
  title: { flex: 1, fontSize: font.xl, fontWeight: '800', color: colors.white },
  editBtn: {
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.green,
  },
  editText: { color: colors.green, fontWeight: '700', fontSize: font.sm },
  avatarSection: { alignItems: 'center', paddingVertical: 20 },
  avatar: { fontSize: 64, marginBottom: 8 },
  emojiSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  emojiBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  emojiBtnActive: {
    borderColor: colors.green,
    backgroundColor: colors.green + '22',
  },
  emojiOption: { fontSize: 24 },
  name: { fontSize: font.xl, fontWeight: '800', color: colors.white },
  nameInput: {
    fontSize: font.xl,
    fontWeight: '800',
    color: colors.white,
    borderBottomWidth: 1,
    borderColor: colors.green,
    paddingBottom: 4,
    minWidth: 160,
    textAlign: 'center',
  },
  email: { fontSize: font.sm, color: colors.muted, marginTop: 4 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.muted,
    letterSpacing: 1.5,
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 8,
  },
  metricsRow: { flexDirection: 'row', gap: 10, marginHorizontal: 20, marginBottom: 14 },
  metricCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricValue: { fontSize: font.lg, fontWeight: '800', color: colors.white },
  metricInput: {
    fontSize: font.lg,
    fontWeight: '800',
    color: colors.white,
    borderBottomWidth: 1,
    borderColor: colors.green,
    width: '100%',
    textAlign: 'center',
  },
  metricLabel: { fontSize: 11, color: colors.muted, marginTop: 4 },
  bmiCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bmiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bmiValue: { fontSize: font.md, fontWeight: '700', color: colors.white },
  bmiLabel: { fontSize: font.sm, fontWeight: '700' },
  bmiDesc: { fontSize: font.sm, color: colors.muted, marginBottom: 10 },
  bmiBarBg: { height: 6, backgroundColor: colors.border, borderRadius: 3, marginBottom: 12 },
  bmiBarFill: { height: 6, borderRadius: 3 },
  bmiExtraRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  bmiExtra: { fontSize: font.sm, color: colors.muted },
  bmiExtraVal: { color: colors.white, fontWeight: '600' },
  disclaimer: { fontSize: 11, color: colors.muted, fontStyle: 'italic' },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingLabel: { fontSize: font.md, color: colors.white },
  settingHint: { fontSize: 12, color: colors.muted, marginTop: 3, lineHeight: 17 },
  settingValue: { fontSize: font.sm, color: colors.green, fontWeight: '600' },
  hourRow: { flexDirection: 'row', gap: 8 },
  hourBtn: {
    backgroundColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  hourBtnActive: { backgroundColor: colors.green },
  hourText: { color: colors.muted, fontWeight: '600', fontSize: font.sm },
  hourTextActive: { color: colors.white },
  logoutBtn: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  logoutText: { color: '#EF4444', fontWeight: '700', fontSize: font.md },
});

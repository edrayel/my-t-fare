import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { colors, SORA, MANROPE, space } from '../theme/tokens';
import { Icon } from '../components/Icon';
import { CTA } from '../components/CTA';
import { Keypad } from '../components/Keypad';
import { PinDots } from '../components/PinDots';
import { useAppStore } from '../store/useAppStore';

export function Security() {
  const nav = useNavigation<any>();
  const enabled = useAppStore((s) => s.biometricsEnabled);
  const setBio = useAppStore((s) => s.setBiometrics);
  const flashToast = useAppStore((s) => s.flashToast);
  const [pin, setPin] = useState('');
  const [phase, setPhase] = useState<'idle' | 'confirm'>('idle');

  const onKey = (k: string) => setPin((p) => (p.length >= 4 ? p : p + k));

  if (phase === 'confirm') {
    return (
      <View style={styles.screen}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={() => setPhase('idle')}>
            <Icon name="back" size={20} stroke={colors.ink} sw={2.2} />
          </TouchableOpacity>
          <Text style={styles.title}>Confirm new PIN</Text>
        </View>
        <PinDots pin={pin} />
        <View style={styles.keypad}>
          <Keypad onKey={onKey} onDelete={() => setPin((p) => p.slice(0, -1))} />
        </View>
        {pin.length === 4 && (
          <View style={{ paddingHorizontal: space.gutter, marginTop: 14 }}>
            <CTA
              label="Save PIN"
              onPress={() => {
                flashToast('PIN updated');
                setPin('');
                setPhase('idle');
                nav.goBack();
              }}
            />
          </View>
        )}
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 30 }}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => nav.goBack()}>
          <Icon name="back" size={20} stroke={colors.ink} sw={2.2} />
        </TouchableOpacity>
        <Text style={styles.title}>Security & PIN</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHead}>
          <View style={styles.iconWrap}>
            <Icon name="finger" size={22} stroke={colors.green} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Biometric unlock</Text>
            <Text style={styles.cardSub}>Use fingerprint to confirm payments</Text>
          </View>
          <Switch value={enabled} onValueChange={setBio} trackColor={{ true: colors.green }} thumbColor="#fff" />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Change PIN</Text>
        <PinDots pin={pin} />
        <View style={styles.keypad}>
          <Keypad onKey={onKey} onDelete={() => setPin((p) => p.slice(0, -1))} />
        </View>
        <CTA label="Continue" disabled={pin.length < 4} onPress={() => { setPin(''); setPhase('confirm'); }} />
        <TouchableOpacity style={styles.forgot} onPress={() => flashToast('Contact support to reset PIN')}>
          <Text style={styles.forgotT}>Forgot PIN?</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper, paddingTop: 56 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, marginBottom: 8 },
  back: { width: 40, height: 40, borderRadius: 13, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: SORA, fontWeight: '700', fontSize: 18, color: colors.ink },
  card: { marginHorizontal: space.gutter, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 16, gap: 14, marginTop: 14 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#EAF1EC', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontFamily: SORA, fontWeight: '700', fontSize: 14, color: colors.ink },
  cardSub: { fontFamily: MANROPE, fontSize: 12, color: colors.sub, marginTop: 2 },
  sectionLabel: { fontFamily: SORA, fontWeight: '700', fontSize: 14, color: colors.ink, textAlign: 'center' },
  keypad: { alignItems: 'center' },
  forgot: { alignItems: 'center', paddingVertical: 8 },
  forgotT: { fontFamily: MANROPE, fontSize: 12, color: colors.mut, fontWeight: '600' },
});

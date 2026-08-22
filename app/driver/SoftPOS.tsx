import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { colors, SORA, MANROPE, space } from '../../theme/tokens';
import { Icon } from '../../components/Icon';
import { CTA } from '../../components/CTA';
import { useAppStore } from '../../store/useAppStore';
import { kobo, formatKobo } from '../../lib/money';

export function DriverSoftPOS() {
  const nav = useNavigation<any>();
  const enabled = useAppStore((s) => s.softPOSEnabled);
  const setEnabled = useAppStore((s) => s.setSoftPOSEnabled);
  const amount = useAppStore((s) => s.softPOSAmount);
  const setAmount = useAppStore((s) => s.setSoftPOSAmount);
  const simulate = useAppStore((s) => s.softPosSimulateTap);
  const [input, setInput] = useState(amount ? String(Math.round(amount / 100)) : '');

  const arm = () => {
    const n = Number(input.replace(/[^0-9]/g, ''));
    if (!n || !Number.isFinite(n)) return;
    setAmount(kobo(n));
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 30 }}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => nav.goBack()}>
          <Icon name="back" size={20} stroke={colors.ink} sw={2.2} />
        </TouchableOpacity>
        <Text style={styles.title}>Soft POS</Text>
        <View style={styles.toggleWrap}>
          <Text style={styles.toggleLabel}>{enabled ? 'ON' : 'OFF'}</Text>
          <Switch value={enabled} onValueChange={setEnabled} trackColor={{ true: colors.green }} />
        </View>
      </View>

      <View style={styles.hero}>
        <Icon name="cardWifi" size={48} stroke={colors.lime} sw={1.8} />
        <Text style={styles.heroTitle}>Tap cards on this phone</Text>
        <Text style={styles.heroSub}>Hold a passenger card to the back of this phone to collect the armed fare instantly.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Amount to charge on next tap</Text>
        <View style={styles.inputRow}>
          <Text style={styles.naira}>₦</Text>
          <TextInput style={styles.input} placeholder="0" placeholderTextColor={colors.mut} keyboardType="numeric" value={input} onChangeText={setInput} />
        </View>
        <CTA label="Arm next tap" disabled={!Number(input.replace(/[^0-9]/g, ''))} onPress={arm} />
        {amount > 0 && <Text style={styles.armed}>Armed · {formatKobo(amount)} on next tap</Text>}
        {amount > 0 && enabled && (
          <TouchableOpacity style={styles.simBtn} onPress={simulate}>
            <Icon name="cardWifi" size={18} stroke={colors.green} />
            <Text style={styles.simT}>Simulate card tap</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.section}>Recent tap payments</Text>
      <View style={styles.list}>
        <View style={styles.row}>
          <Icon name="cardWifi" size={18} stroke={colors.green} />
          <Text style={styles.rowT}>₦150 · Akoka · NFC</Text>
          <Text style={styles.rowTime}>08:22</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper, paddingTop: 56 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, marginBottom: 8 },
  back: { width: 40, height: 40, borderRadius: 13, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontFamily: SORA, fontWeight: '700', fontSize: 18, color: colors.ink },
  toggleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toggleLabel: { fontFamily: SORA, fontWeight: '700', fontSize: 12, color: colors.ink },
  hero: { marginHorizontal: space.gutter, backgroundColor: '#0a4030', borderRadius: 22, padding: 24, alignItems: 'center', gap: 8 },
  heroTitle: { fontFamily: SORA, fontWeight: '700', fontSize: 16, color: '#fff', marginTop: 8 },
  heroSub: { fontFamily: MANROPE, fontSize: 12.5, color: '#a9d6c5', textAlign: 'center', lineHeight: 18 },
  card: { marginHorizontal: space.gutter, marginTop: 14, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 16, gap: 12 },
  label: { fontFamily: SORA, fontWeight: '600', fontSize: 13, color: colors.ink },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.5, borderColor: colors.line, borderRadius: 14, paddingHorizontal: 16, height: 54 },
  naira: { fontFamily: SORA, fontWeight: '700', fontSize: 18, color: colors.ink },
  input: { flex: 1, fontFamily: SORA, fontWeight: '600', fontSize: 18, color: colors.ink },
  armed: { fontFamily: MANROPE, fontWeight: '700', fontSize: 12, color: colors.green, textAlign: 'center' },
  simBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: colors.green, borderRadius: 14, paddingVertical: 14, backgroundColor: '#EAF1EC' },
  simT: { fontFamily: SORA, fontWeight: '700', fontSize: 13, color: colors.green },
  section: { fontFamily: SORA, fontWeight: '700', fontSize: 13, color: colors.ink, marginHorizontal: space.gutter, marginTop: 18, marginBottom: 8 },
  list: { marginHorizontal: space.gutter, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  rowT: { flex: 1, fontFamily: SORA, fontWeight: '600', fontSize: 13, color: colors.ink },
  rowTime: { fontFamily: MANROPE, fontSize: 12, color: colors.mut },
});

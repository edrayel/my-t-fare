import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import QRCode from 'react-native-qrcode-svg';
import { colors, SORA, MANROPE, space } from '../../theme/tokens';
import { Icon } from '../../components/Icon';
import { CTA } from '../../components/CTA';
import { useAppStore } from '../../store/useAppStore';
import { createPaymentCode } from '../../lib/api';
import { kobo } from '../../lib/money';

export function DriverGenerate() {
  const nav = useNavigation<any>();
  const cd = useAppStore((s) => s.campusData());
  const [amount, setAmount] = useState('');
  const [routeIdx, setRouteIdx] = useState(0);
  const [qr, setQr] = useState<string | null>(null);
  const [genAmount, setGenAmount] = useState(0);

  const gen = async () => {
    const n = Number(amount);
    if (!n) return;
    const k = kobo(n);
    const routeId = cd.routes[routeIdx][0];
    const pc = await createPaymentCode(k, routeId);
    setQr(pc.qrPayload);
    setGenAmount(k);
  };

  if (qr) {
    return (
      <View style={styles.screen}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={() => setQr(null)}>
            <Icon name="back" size={20} stroke={colors.ink} sw={2.2} />
          </TouchableOpacity>
          <Text style={styles.title}>Payment code</Text>
        </View>
        <View style={styles.qrCard}>
          <View style={styles.qrFrame}>
            <QRCode value={qr} size={200} backgroundColor="#fff" color={colors.ink} />
          </View>
          <Text style={styles.qrAmount}>₦{Math.round(genAmount / 100)} · {cd.routes[routeIdx][0]} → {cd.routes[routeIdx][1]}</Text>
          <Text style={styles.waiting}>Waiting for payment…</Text>
          <View style={styles.qrActions}>
            <CTA label="New QR" variant="outline" onPress={() => setQr(null)} />
            <View style={{ height: 10 }} />
            <CTA label="Done" onPress={() => nav.goBack()} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 30 }} keyboardShouldPersistTaps="handled">
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => nav.goBack()}>
          <Icon name="back" size={20} stroke={colors.ink} sw={2.2} />
        </TouchableOpacity>
        <Text style={styles.title}>Generate Payment code</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Amount (₦)</Text>
        <View style={styles.inputRow}>
          <Text style={styles.naira}>₦</Text>
          <TextInput style={styles.input} placeholder="0" placeholderTextColor={colors.mut} keyboardType="numeric" value={amount} onChangeText={setAmount} />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Route</Text>
        <View style={styles.routeList}>
          {cd.routes.map(([o, d, fare], i) => (
            <TouchableOpacity key={`${o}-${d}`} style={[styles.routeOpt, routeIdx === i && styles.routeOn]} onPress={() => setRouteIdx(i)}>
              <Text style={[styles.routeT, routeIdx === i && styles.routeTOn]}>
                {o} → {d} · ₦{Math.round(fare / 100)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ paddingHorizontal: space.gutter, marginTop: 22 }}>
        <CTA label="Generate QR" disabled={!Number(amount)} onPress={gen} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper, paddingTop: 56 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, marginBottom: 8 },
  back: { width: 40, height: 40, borderRadius: 13, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: SORA, fontWeight: '700', fontSize: 18, color: colors.ink },
  field: { paddingHorizontal: space.gutter, marginTop: 16 },
  label: { fontFamily: SORA, fontWeight: '600', fontSize: 13, color: colors.ink, marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.line, borderRadius: 14, paddingHorizontal: 16, height: 54 },
  naira: { fontFamily: SORA, fontWeight: '700', fontSize: 18, color: colors.ink },
  input: { flex: 1, fontFamily: SORA, fontWeight: '600', fontSize: 18, color: colors.ink },
  routeList: { gap: 8 },
  routeOpt: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 14, padding: 14 },
  routeOn: { borderColor: colors.green, backgroundColor: '#E4F2EC' },
  routeT: { fontFamily: MANROPE, fontWeight: '600', fontSize: 13, color: colors.ink },
  routeTOn: { color: colors.green },
  qrCard: { flex: 1, alignItems: 'center', paddingHorizontal: space.gutter, paddingTop: 20 },
  qrFrame: { width: 220, height: 220, backgroundColor: '#fff', borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line, padding: 10 },
  qrAmount: { fontFamily: SORA, fontWeight: '700', fontSize: 16, color: colors.ink, marginTop: 16 },
  waiting: { fontFamily: MANROPE, fontSize: 13, color: colors.mut, marginTop: 6 },
  qrActions: { width: '100%', marginTop: 24 },
});

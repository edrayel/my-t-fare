import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { colors, SORA, MANROPE, space } from '../theme/tokens';
import { Icon } from '../components/Icon';
import { CTA } from '../components/CTA';
import { useAppStore } from '../store/useAppStore';

export function OrderCard() {
  const nav = useNavigation<any>();
  const flashToast = useAppStore((s) => s.flashToast);
  const [address, setAddress] = useState('Unilag Hostel, Akoka, Lagos');
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <View style={styles.screen}>
        <StatusBar style="dark" />
        <View style={styles.success}>
          <View style={styles.checkWrap}>
            <Icon name="check" size={28} stroke="#fff" sw={2.5} />
          </View>
          <Text style={styles.successTitle}>Card ordered</Text>
          <Text style={styles.successBody}>₦500 · delivers to your hostel in 3–5 days. Track in Activity.</Text>
          <View style={{ width: '100%', marginTop: 22 }}>
            <CTA label="Done" onPress={() => nav.goBack()} />
          </View>
        </View>
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
        <Text style={styles.title}>Order a physical card</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.fee}>₦500 · delivered to your hostel</Text>
        <Text style={styles.label}>Delivery address</Text>
        <View style={styles.inputWrap}>
          <Icon name="pin" size={18} stroke={colors.green} />
          <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Hostel address" placeholderTextColor={colors.mut} />
        </View>
        <View style={styles.summary}>
          <View style={styles.sumRow}>
            <Text style={styles.sumLabel}>Card fee</Text>
            <Text style={styles.sumVal}>₦500</Text>
          </View>
          <View style={styles.sumRow}>
            <Text style={styles.sumLabel}>Delivery</Text>
            <Text style={styles.sumVal}>Free</Text>
          </View>
          <View style={[styles.sumRow, styles.sumTotal]}>
            <Text style={[styles.sumLabel, { color: colors.ink, fontWeight: '700' }]}>Total</Text>
            <Text style={[styles.sumVal, { color: colors.ink }]}>₦500</Text>
          </View>
        </View>
        <CTA label="Confirm · Pay ₦500" onPress={() => { flashToast('Order placed · ₦500'); setDone(true); }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper, paddingTop: 56 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, marginBottom: 8 },
  back: { width: 40, height: 40, borderRadius: 13, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: SORA, fontWeight: '700', fontSize: 18, color: colors.ink },
  card: { marginHorizontal: space.gutter, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 16, gap: 14 },
  fee: { fontFamily: MANROPE, fontSize: 13, color: colors.sub, fontWeight: '600' },
  label: { fontFamily: SORA, fontWeight: '600', fontSize: 13, color: colors.ink },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.5, borderColor: colors.line, borderRadius: 14, paddingHorizontal: 14, height: 54 },
  input: { flex: 1, fontFamily: MANROPE, fontSize: 14, color: colors.ink },
  summary: { backgroundColor: '#F6F8F5', borderRadius: 14, padding: 14, gap: 10 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between' },
  sumTotal: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 10, marginTop: 4 },
  sumLabel: { fontFamily: MANROPE, fontSize: 13, color: colors.sub },
  sumVal: { fontFamily: SORA, fontWeight: '700', fontSize: 13, color: colors.ink },
  success: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.gutter, gap: 12 },
  checkWrap: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontFamily: SORA, fontWeight: '700', fontSize: 20, color: colors.ink, marginTop: 8 },
  successBody: { fontFamily: MANROPE, fontSize: 13, color: colors.sub, textAlign: 'center', lineHeight: 20 },
});

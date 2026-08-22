import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { colors, SORA, MANROPE, space } from '../../theme/tokens';
import { Icon } from '../../components/Icon';
import { CTA } from '../../components/CTA';
import { useAppStore } from '../../store/useAppStore';
import { formatKobo, kobo } from '../../lib/money';

export function DriverWithdraw() {
  const nav = useNavigation<any>();
  const balance = useAppStore((s) => s.driverBalance);
  const withdraw = useAppStore((s) => s.driverWithdraw);
  const [amount, setAmount] = useState('');
  const [dest, setDest] = useState<'bank' | 'wallet'>('bank');
  const [error, setError] = useState<string | null>(null);

  const doWithdraw = () => {
    const n = Number(amount);
    if (!n) return;
    const res = withdraw(kobo(n), dest);
    if (!res.ok) setError('Insufficient funds — available ' + formatKobo(balance));
    else {
      setError(null);
      nav.goBack();
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 30 }}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => nav.goBack()}>
          <Icon name="back" size={20} stroke={colors.ink} sw={2.2} />
        </TouchableOpacity>
        <Text style={styles.title}>Withdraw</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available</Text>
        <Text style={styles.balanceVal}>{formatKobo(balance)}</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Amount (₦)</Text>
        <View style={styles.inputRow}>
          <Text style={styles.naira}>₦</Text>
          <TextInput style={styles.input} placeholder="0" placeholderTextColor={colors.mut} keyboardType="numeric" value={amount} onChangeText={setAmount} />
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Destination</Text>
        <View style={styles.destRow}>
          <TouchableOpacity style={[styles.dest, dest === 'bank' && styles.destOn]} onPress={() => setDest('bank')}>
            <Text style={[styles.destT, dest === 'bank' && styles.destTOn]}>Bank · GTBank · ••••6789</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dest, dest === 'wallet' && styles.destOn]} onPress={() => setDest('wallet')}>
            <Text style={[styles.destT, dest === 'wallet' && styles.destTOn]}>My T-Fare wallet</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ paddingHorizontal: space.gutter, marginTop: 22 }}>
        <CTA label={`Withdraw ₦${amount || '0'}`} disabled={!Number(amount)} onPress={doWithdraw} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper, paddingTop: 56 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, marginBottom: 8 },
  back: { width: 40, height: 40, borderRadius: 13, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: SORA, fontWeight: '700', fontSize: 18, color: colors.ink },
  balanceCard: { marginHorizontal: space.gutter, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 16 },
  balanceLabel: { fontFamily: MANROPE, fontSize: 12, color: colors.mut, fontWeight: '600' },
  balanceVal: { fontFamily: SORA, fontWeight: '700', fontSize: 22, color: colors.ink, marginTop: 4 },
  field: { paddingHorizontal: space.gutter, marginTop: 16 },
  label: { fontFamily: SORA, fontWeight: '600', fontSize: 13, color: colors.ink, marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.line, borderRadius: 14, paddingHorizontal: 16, height: 54 },
  naira: { fontFamily: SORA, fontWeight: '700', fontSize: 18, color: colors.ink },
  input: { flex: 1, fontFamily: SORA, fontWeight: '600', fontSize: 18, color: colors.ink },
  error: { fontFamily: MANROPE, fontSize: 12, color: colors.danger, marginTop: 6 },
  destRow: { gap: 10 },
  dest: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 14, padding: 14 },
  destOn: { borderColor: colors.green, backgroundColor: '#E4F2EC' },
  destT: { fontFamily: MANROPE, fontWeight: '600', fontSize: 13, color: colors.ink },
  destTOn: { color: colors.green },
});

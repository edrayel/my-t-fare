import { View, Text, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { colors, radius, typography, space } from '../theme/tokens';
import { Header } from '../components/Header';
import { ResultRow } from '../components/ResultRow';
import { CTA } from '../components/CTA';
import { Logo } from '../components/Logo';
import { useAppStore, type Trip } from '../store/useAppStore';
import { formatKobo } from '../lib/money';

export function Receipt() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const fareNow = useAppStore((s) => s.fareNow());
  const lastRef = useAppStore((s) => s.lastRef);
  const balance = useAppStore((s) => s.balance);

  const trip: Trip | undefined = route.params?.trip;
  const amount = trip ? Math.abs(trip.amount) : fareNow;
  const ref = trip?.id ?? lastRef ?? 'MTF-XXXX';
  const title = trip?.title ?? useAppStore.getState().campusData().routes[0].join(' → ');
  const sub = trip?.sub ?? 'My T-Fare ride';

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <Header title="Receipt" onBack={() => nav.goBack()} />
      <View style={styles.card}>
        <Logo size={46} />
        <Text style={styles.amount}>{formatKobo(amount)}</Text>
        <View style={styles.paidPill}>
          <Text style={styles.paidT}>PAID</Text>
        </View>
        <View style={styles.rows}>
          <ResultRow label="Details" value={title} />
          <ResultRow label="Info" value={sub} />
          <ResultRow label="Service fee" value="₦0.00 · fee-free" />
          <ResultRow label="Reference" value={ref} />
          <ResultRow label="Paid with" value="My T-Fare wallet" />
          <View style={styles.div} />
          <ResultRow label="Balance" value={<Text style={{ ...typography.label, color: colors.green }}>{formatKobo(balance)}</Text>} />
        </View>
      </View>
      <View style={styles.btns}>
        <CTA label="Report issue" variant="outline" onPress={() => nav.navigate('trips')} />
        <View style={{ height: 12 }} />
        <CTA label="Download" onPress={() => nav.navigate('trips')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  card: { backgroundColor: colors.card, marginHorizontal: space.gutter, borderRadius: radius.card, padding: 22, alignItems: 'center', borderWidth: 1, borderColor: colors.line, marginTop: 8 },
  amount: { ...typography.amount, marginTop: 12 },
  paidPill: { backgroundColor: colors.green, borderRadius: radius.pill, paddingVertical: 5, paddingHorizontal: 14, marginTop: 10 },
  paidT: { color: '#fff', fontFamily: 'Sora', fontWeight: '700', fontSize: 12, letterSpacing: 1 },
  rows: { width: '100%', marginTop: 18 },
  div: { height: 1, backgroundColor: colors.rowDivider, marginVertical: 6 },
  btns: { paddingHorizontal: space.gutter, marginTop: 18, width: '100%' },
});

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { colors, radius, typography, space } from '../theme/tokens';
import { Icon } from '../components/Icon';
import { Gradient } from '../components/Gradient';
import { CTA } from '../components/CTA';
import { ResultRow } from '../components/ResultRow';
import { useAppStore } from '../store/useAppStore';
import { formatKobo } from '../lib/money';

export function Success() {
  const nav = useNavigation<any>();
  const fareNow = useAppStore((s) => s.fareNow());
  const lastRef = useAppStore((s) => s.lastRef);
  const balance = useAppStore((s) => s.balance);
  const cd = useAppStore((s) => s.campusData());

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <Gradient colors={['#0C6B4F', '#084030']} angle={170} />
      <View style={styles.check}>
        <Icon name="check" size={48} stroke="#0a2117" sw={2.4} />
      </View>
      <Text style={styles.title}>Payment successful</Text>
      <Text style={styles.amount}>{formatKobo(fareNow)}</Text>
      <Text style={styles.to}>
        to {cd.driver} · {cd.vehicle}
      </Text>

      <View style={styles.rows}>
        <ResultRow label="Route" value={`${cd.routes[0][0]} → ${cd.routes[0][1]}`} onDark />
        <ResultRow label="Reference" value={lastRef || 'MTF-XXXX'} onDark />
        <ResultRow label="New balance" value={<Text style={{ ...typography.label, color: colors.lime }}>{formatKobo(balance)}</Text>} onDark />
      </View>

      <View style={styles.btns}>
        <CTA
          label="View e-receipt"
          variant="outline"
          onPress={() => nav.navigate('receipt', { trip: useAppStore.getState().trips[0] })}
        />
        <View style={{ height: 12 }} />
        <CTA label="Done" variant="lime" onPress={() => nav.navigate('(tabs)', { screen: 'home' })} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.greenDark, alignItems: 'center', paddingTop: 96, paddingHorizontal: space.gutterLg },
  check: { width: 96, height: 96, borderRadius: 48, backgroundColor: 'rgba(199,240,63,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { color: colors.paper, fontSize: 22, fontFamily: 'Sora', fontWeight: '700' },
  amount: { color: colors.lime, fontSize: 44, fontFamily: 'Sora', fontWeight: '700', letterSpacing: -1, marginTop: 8 },
  to: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontFamily: 'Manrope', marginTop: 4 },
  rows: { width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: radius.card, paddingHorizontal: 18, marginTop: 30 },
  btns: { width: '100%', marginTop: 28 },
});

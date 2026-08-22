import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { colors, SORA, MANROPE, space } from '../../theme/tokens';
import { Icon } from '../../components/Icon';
import { useAppStore } from '../../store/useAppStore';
import { formatKobo } from '../../lib/money';

export function DriverHistory() {
  const nav = useNavigation<any>();
  const trips = useAppStore((s) => s.driverTrips);
  const today = trips.filter((t) => t.day === 'today');
  const earlier = trips.filter((t) => t.day === 'earlier');
  const totalToday = today.reduce((a, b) => a + b.amount, 0);
  const paxToday = today.reduce((a, b) => a + b.passengers, 0);

  const Group = ({ title, items }: { title: string; items: typeof trips }) => (
    <>
      <Text style={styles.groupLabel}>{title}</Text>
      <View style={styles.group}>
        {items.map((t) => (
          <View key={t.id} style={styles.row}>
            <View style={styles.icon}>
              <Icon name={t.method === 'qr' ? 'qr' : 'cardWifi'} size={18} stroke={colors.green} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>
                {t.title} · {t.passengers} {t.passengers === 1 ? 'pass' : 'passengers'}
              </Text>
              <Text style={styles.rowSub}>
                {t.time} · {t.method.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.rowAmt}>+{formatKobo(t.amount)}</Text>
          </View>
        ))}
      </View>
    </>
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 30 }}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => nav.goBack()}>
          <Icon name="back" size={20} stroke={colors.ink} sw={2.2} />
        </TouchableOpacity>
        <Text style={styles.title}>Transaction history</Text>
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Total today</Text>
        <Text style={styles.summaryVal}>{formatKobo(totalToday)}</Text>
        <Text style={styles.summarySub}>{paxToday} passengers</Text>
      </View>

      <Group title="Today" items={today} />
      <Group title="Earlier" items={earlier} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper, paddingTop: 56 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, marginBottom: 8 },
  back: { width: 40, height: 40, borderRadius: 13, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: SORA, fontWeight: '700', fontSize: 18, color: colors.ink },
  summary: { marginHorizontal: space.gutter, backgroundColor: '#0a4030', borderRadius: 16, padding: 16 },
  summaryLabel: { fontFamily: MANROPE, fontSize: 12, color: '#9fc4b4', fontWeight: '600' },
  summaryVal: { fontFamily: SORA, fontWeight: '700', fontSize: 24, color: '#fff', marginTop: 4 },
  summarySub: { fontFamily: MANROPE, fontSize: 12, color: '#a9d6c5', marginTop: 4 },
  groupLabel: { fontFamily: MANROPE, fontSize: 12, fontWeight: '700', color: colors.mut, marginHorizontal: space.gutter, marginTop: 18, marginBottom: 8 },
  group: { marginHorizontal: space.gutter, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 16, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: colors.rowDivider },
  icon: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#EAF1EC', alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontFamily: SORA, fontWeight: '600', fontSize: 13, color: colors.ink },
  rowSub: { fontFamily: MANROPE, fontSize: 11.5, color: colors.mut, marginTop: 2 },
  rowAmt: { fontFamily: SORA, fontWeight: '700', fontSize: 13, color: colors.green },
});

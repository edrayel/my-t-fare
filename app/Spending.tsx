import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { colors, SORA, MANROPE } from '../theme/tokens';
import { Icon } from '../components/Icon';

type Period = 'Daily' | 'Weekly' | 'Monthly';
const PERIODS: Period[] = ['Daily', 'Weekly', 'Monthly'];
const TOTALS: Record<Period, string> = { Daily: '1,350', Weekly: '8,420', Monthly: '32,100' };
const BARS = [32, 48, 28, 64, 42, 78, 54];
const LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const BREAKDOWN = [
  { label: 'Rides', amount: '1,050', bg: '#EAF1EC', stroke: colors.green, icon: 'shuttle' as const },
  { label: 'Top-ups', amount: '5,000', bg: '#FBF3DC', stroke: '#a9810f', icon: 'plus' as const },
  { label: 'Gifts sent', amount: '300', bg: '#E7EFF5', stroke: '#2a6ea8', icon: 'gift' as const },
];

export function Spending() {
  const nav = useNavigation<any>();
  const [period, setPeriod] = useState<Period>('Daily');
  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => nav.goBack()}>
          <Icon name="back" size={20} stroke={colors.ink} sw={2.2} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Spending summary</Text>
          <Text style={styles.sub}>Track what you spend on transport</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        {PERIODS.map((p) => {
          const on = p === period;
          return (
            <TouchableOpacity key={p} style={[styles.tab, on && styles.tabOn]} onPress={() => setPeriod(p)}>
              <Text style={[styles.tabT, on && styles.tabTOn]}>{p}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.darkCard}>
        <Text style={styles.darkLabel}>Spent this {period.toLowerCase()}</Text>
        <View style={styles.amountRow}>
          <Text style={styles.naira}>₦</Text>
          <Text style={styles.amount}>{TOTALS[period]}</Text>
        </View>
        <View style={styles.chart}>
          {BARS.map((h, i) => (
            <View key={i} style={styles.barCol}>
              <View style={[styles.bar, { height: `${h}%`, backgroundColor: i === 5 ? colors.lime : 'rgba(255,255,255,0.18)' }]} />
              <Text style={styles.barLabel}>{LABELS[i]}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.sectionLabel}>Breakdown</Text>
      <View style={styles.list}>
        {BREAKDOWN.map((s, i) => (
          <View key={s.label} style={[styles.row, i === BREAKDOWN.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={[styles.rowIcon, { backgroundColor: s.bg }]}>
              <Icon name={s.icon} size={17} stroke={s.stroke} sw={1.9} />
            </View>
            <Text style={styles.rowLabel}>{s.label}</Text>
            <Text style={styles.rowAmount}>₦{s.amount}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 6 },
  back: { width: 40, height: 40, borderRadius: 13, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: SORA, fontWeight: '700', fontSize: 18, color: colors.ink },
  sub: { fontSize: 12, color: colors.subSoft, fontWeight: '500', fontFamily: MANROPE },
  tabs: { flexDirection: 'row', gap: 6, marginHorizontal: 18, marginTop: 14, backgroundColor: '#E7EBE3', borderRadius: 14, padding: 4 },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 11, alignItems: 'center' },
  tabOn: { backgroundColor: colors.card, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  tabT: { fontFamily: SORA, fontWeight: '700', fontSize: 13, color: colors.subSoft },
  tabTOn: { color: colors.ink },
  darkCard: { marginHorizontal: 18, marginTop: 14, backgroundColor: '#0a4030', borderRadius: 22, padding: 20 },
  darkLabel: { fontSize: 12, color: '#9fc4b4', fontWeight: '600', fontFamily: MANROPE },
  amountRow: { flexDirection: 'row', alignItems: 'baseline', gap: 3, marginTop: 8 },
  naira: { fontFamily: SORA, fontSize: 22, fontWeight: '600', color: '#fff', opacity: 0.8 },
  amount: { fontFamily: SORA, fontSize: 38, fontWeight: '700', color: '#fff', letterSpacing: -1 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 60, marginTop: 16 },
  barCol: { flex: 1, alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 5 },
  barLabel: { fontSize: 9.5, color: '#9fc4b4', fontWeight: '600', fontFamily: MANROPE },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: colors.mut, textTransform: 'uppercase', letterSpacing: 0.5, marginHorizontal: 22, marginTop: 18, marginBottom: 8, fontFamily: MANROPE },
  list: { marginHorizontal: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 20, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14, borderBottomWidth: 1, borderBottomColor: colors.rowDivider },
  rowIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontFamily: SORA, fontWeight: '600', fontSize: 13.5, color: colors.ink },
  rowAmount: { fontFamily: SORA, fontWeight: '700', fontSize: 14, color: colors.ink },
});

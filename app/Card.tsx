import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { colors, radius, typography, space } from '../theme/tokens';
import { Header } from '../components/Header';
import { Icon } from '../components/Icon';
import { Gradient } from '../components/Gradient';
import { useAppStore } from '../store/useAppStore';
import { formatKobo } from '../lib/money';

export function Card() {
  const nav = useNavigation<any>();
  const balance = useAppStore((s) => s.balance);
  const cd = useAppStore((s) => s.campusData());

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <Header title="My card" subtitle="Tap to pay anywhere · no smartphone needed" />
      <View style={styles.card}>
        <Gradient colors={['#0c1611', '#0a4030', '#0C6B4F']} angle={135} radius={22} locations={[0, 0.6, 1]} />
        <View style={styles.cardTop}>
          <View style={styles.mono}>
            <Text style={styles.monoT}>T</Text>
          </View>
          <Text style={styles.cardBrand}>My T-Fare</Text>
        </View>
        <View style={styles.chip}>
          <Gradient colors={['#d9c97a', '#b89a3e']} angle={135} radius={7} />
        </View>
        <Text style={styles.number}>5821 7740 1109</Text>
        <View style={styles.cardBottom}>
          <View>
            <Text style={styles.cardLabel}>Card holder</Text>
            <Text style={styles.cardValue}>ADA NWOSU</Text>
          </View>
          <View>
            <Text style={styles.cardLabel}>Issued</Text>
            <Text style={styles.cardValue}>{cd.label} · STU</Text>
          </View>
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Card balance</Text>
          <Text style={styles.statValue}>{formatKobo(balance)}</Text>
        </View>
        <View style={[styles.stat, styles.statB]}>
          <Text style={styles.statLabel}>Status</Text>
          <View style={styles.activePill}>
            <Text style={styles.activeT}>Active</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.order} activeOpacity={0.9}>
        <View style={styles.orderIcon}>
          <Icon name="orderCard" size={22} stroke={colors.lime} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.orderT}>Order a physical card</Text>
          <Text style={styles.orderS}>₦500 · delivered to your hostel</Text>
        </View>
        <Icon name="chevron" size={18} stroke={colors.mut} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  card: {
    marginHorizontal: space.gutter,
    marginTop: 12,
    aspectRatio: 1.6,
    borderRadius: 22,
    padding: 22,
    backgroundColor: colors.greenDark,
    overflow: 'hidden',
    shadowColor: '#08281c',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 20 },
    elevation: 10,
    justifyContent: 'space-between',
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mono: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.lime, alignItems: 'center', justifyContent: 'center' },
  monoT: { color: colors.ink, fontSize: 22, fontFamily: 'Sora', fontWeight: '800' },
  cardBrand: { color: '#fff', fontSize: 17, fontFamily: 'Sora', fontWeight: '700' },
  chip: { width: 42, height: 32, borderRadius: 7, overflow: 'hidden', position: 'relative', marginTop: 18, alignSelf: 'flex-start' },
  number: { color: '#fff', fontSize: 20, fontFamily: 'Sora', fontWeight: '600', letterSpacing: 2 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontFamily: 'Manrope' },
  cardValue: { color: '#fff', fontSize: 13, fontFamily: 'Sora', fontWeight: '600', marginTop: 3 },
  stats: { flexDirection: 'row', gap: 12, paddingHorizontal: space.gutter, marginTop: 16 },
  stat: { flex: 1, backgroundColor: colors.card, borderRadius: radius.card, padding: 16, borderWidth: 1, borderColor: colors.line },
  statB: {},
  statLabel: { color: colors.sub, fontSize: 12.5, fontFamily: 'Manrope' },
  statValue: { color: colors.ink, fontSize: 18, fontFamily: 'Sora', fontWeight: '700', marginTop: 6 },
  activePill: { backgroundColor: colors.tintCard, borderRadius: 999, paddingVertical: 5, paddingHorizontal: 12, alignSelf: 'flex-start', marginTop: 6 },
  activeT: { color: colors.green, fontFamily: 'Sora', fontWeight: '700', fontSize: 13 },
  order: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: space.gutter,
    marginTop: 16,
    backgroundColor: colors.greenDark,
    borderRadius: radius.card,
    padding: 16,
  },
  orderIcon: { width: 46, height: 46, borderRadius: 14, backgroundColor: 'rgba(199,240,63,0.14)', alignItems: 'center', justifyContent: 'center' },
  orderT: { color: '#fff', fontSize: 15, fontFamily: 'Sora', fontWeight: '700' },
  orderS: { color: 'rgba(255,255,255,0.7)', fontSize: 12.5, fontFamily: 'Manrope', marginTop: 2 },
});

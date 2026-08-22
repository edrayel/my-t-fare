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
        <View style={styles.cardWrap}>
          <View style={styles.card}>
        <Gradient colors={['#0c1611', '#0a4030', '#0C6B4F']} angle={135} radius={22} locations={[0, 0.6, 1]} />
        <View style={styles.cardGlow} />
        <View style={styles.cardTop}>
          <View style={styles.cardTopL}>
            <View style={styles.mono}>
              <Text style={styles.monoT}>T</Text>
            </View>
            <Text style={styles.cardBrand}>My T-Fare</Text>
          </View>
          <Icon name="cardWifi" size={26} stroke={colors.lime} sw={1.7} />
        </View>
        <View style={styles.chip}>
          <Gradient colors={['#d9c97a', '#b89a3e']} angle={135} radius={7} />
        </View>
        <View style={styles.cardLower}>
          <Text style={styles.number}>5821  7740  1109</Text>
          <View style={styles.cardBottom}>
            <Text style={styles.cardValue}>ADA NWOSU</Text>
            <Text style={styles.cardValue}>{cd.label} · STU</Text>
          </View>
        </View>
      </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Card balance</Text>
          <Text style={styles.statValue}>{formatKobo(balance)}</Text>
        </View>
        <View style={[styles.stat, styles.statB]}>
          <Text style={styles.statLabel}>NFC</Text>
          <View style={styles.nfcRow}>
            <View style={styles.nfcDot} />
            <Text style={styles.activeT}>Ready · tap to pay</Text>
          </View>
        </View>
      </View>
      <View style={styles.tapCard}>
        <Text style={styles.tapTitle}>Recent tap activity</Text>
        <View style={styles.tapRow}>
          <Icon name="cardWifi" size={18} stroke={colors.green} sw={1.8} />
          <View style={{ flex: 1 }}>
            <Text style={styles.tapName}>Yaba Gate · bus tap</Text>
            <Text style={styles.tapSub}>Today · 08:12 · ₦150</Text>
          </View>
          <Text style={styles.tapAmt}>-₦150</Text>
        </View>
        <View style={styles.tapRow}>
          <Icon name="cardWifi" size={18} stroke={colors.green} sw={1.8} />
          <View style={{ flex: 1 }}>
            <Text style={styles.tapName}>Akoka · top-up tap</Text>
            <Text style={styles.tapSub}>Earlier · PalmPay</Text>
          </View>
          <Text style={styles.tapAmt2}>+₦2,000</Text>
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
  cardWrap: { marginHorizontal: space.gutter },
  card: {
    width: '100%',
    marginTop: 12,
    aspectRatio: 1.6,
    borderRadius: 22,
    backgroundColor: colors.greenDark,
    overflow: 'hidden',
    shadowColor: '#08281c',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 20 },
    elevation: 10,
  },
  cardGlow: { position: 'absolute', top: -50, right: -40, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(199,240,63,0.1)' },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 22, paddingHorizontal: 22 },
  cardTopL: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  mono: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.lime, alignItems: 'center', justifyContent: 'center' },
  monoT: { color: colors.ink, fontSize: 22, fontFamily: 'Sora', fontWeight: '800' },
  cardBrand: { color: '#fff', fontSize: 17, fontFamily: 'Sora', fontWeight: '700' },
  chip: { position: 'absolute', bottom: 60, left: 22, width: 42, height: 32, borderRadius: 7, overflow: 'hidden' },
  cardLower: { position: 'absolute', left: 22, right: 22, bottom: 18 },
  number: { color: '#eafff5', fontSize: 17, fontFamily: 'Sora', fontWeight: '500', letterSpacing: 2 },
  cardBottom: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', justifyContent: 'space-between' },
  cardValue: { color: '#9fc4b4', fontSize: 12, fontFamily: 'Sora', fontWeight: '600' },
  stats: { flexDirection: 'row', gap: 12, paddingHorizontal: space.gutter, marginTop: 16 },
  stat: { flex: 1, backgroundColor: colors.card, borderRadius: radius.card, padding: 16, borderWidth: 1, borderColor: colors.line },
  statB: {},
  statLabel: { color: colors.sub, fontSize: 12.5, fontFamily: 'Manrope' },
  statValue: { color: colors.ink, fontSize: 18, fontFamily: 'Sora', fontWeight: '700', marginTop: 6 },
  activePill: { backgroundColor: colors.tintCard, borderRadius: 999, paddingVertical: 5, paddingHorizontal: 12, alignSelf: 'flex-start', marginTop: 6 },
  activeT: { color: colors.green, fontFamily: 'Sora', fontWeight: '700', fontSize: 13 },
  nfcRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 6 },
  nfcDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.green },
  tapCard: { marginHorizontal: space.gutter, marginTop: 14, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: radius.card, padding: 16 },
  tapTitle: { fontFamily: 'Sora', fontWeight: '700', fontSize: 13.5, color: colors.ink, marginBottom: 12 },
  tapRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.rowDivider },
  tapName: { fontFamily: 'Sora', fontWeight: '600', fontSize: 13, color: colors.ink },
  tapSub: { fontSize: 11.5, color: colors.mut, fontFamily: 'Manrope', marginTop: 2 },
  tapAmt: { fontFamily: 'Sora', fontWeight: '700', fontSize: 13, color: colors.ink },
  tapAmt2: { fontFamily: 'Sora', fontWeight: '700', fontSize: 13, color: colors.green },
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

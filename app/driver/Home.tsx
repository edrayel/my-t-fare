import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { colors, SORA, MANROPE, space } from '../../theme/tokens';
import { Icon } from '../../components/Icon';
import { useAppStore } from '../../store/useAppStore';
import { formatKobo } from '../../lib/money';

export function DriverHome() {
  const nav = useNavigation<any>();
  const cd = useAppStore((s) => s.campusData());
  const driverBalance = useAppStore((s) => s.driverBalance);
  const hidden = useAppStore((s) => s.driverBalanceHidden);
  const toggleHidden = useAppStore((s) => s.toggleDriverBalance);
  const phone = useAppStore((s) => s.phone);
  const trips = useAppStore((s) => s.driverTrips);
  const todayCount = trips.filter((t) => t.day === 'today').length;
  const pax = trips.filter((t) => t.day === 'today').reduce((a, b) => a + b.passengers, 0);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarT}>M</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>Musa Abdullahi</Text>
            <View style={styles.dutyPill}>
              <View style={styles.dutyDot} />
              <Text style={styles.dutyT}>On duty</Text>
            </View>
          </View>
          <Text style={styles.sub}>Shuttle B2 · {cd.plate}</Text>
        </View>
      </View>

      <View style={styles.locBadge}>
        <Icon name="pin" size={13} stroke={colors.green} sw={2.2} />
        <Text style={styles.locT}>Near Main Gate, Lagos</Text>
      </View>

      <View style={styles.earnCard}>
        <View style={styles.earnTop}>
          <Text style={styles.earnLabel}>Today's earnings</Text>
          <TouchableOpacity onPress={toggleHidden} style={styles.eyeBtn}>
            <Icon name={hidden ? 'eyeOff' : 'eye'} size={18} stroke="#fff" sw={1.8} />
          </TouchableOpacity>
        </View>
        <Text style={styles.earnAmount}>{hidden ? '••••' : formatKobo(driverBalance)}</Text>
        <Text style={styles.earnSub}>
          {todayCount} rides · {pax} passengers
        </Text>
        <View style={styles.earnSplit}>
          <View style={styles.splitBox}>
            <Text style={styles.splitLabel}>Via QR scans</Text>
            <Text style={styles.splitVal}>{formatKobo(120000)}</Text>
          </View>
          <View style={styles.splitBox}>
            <Text style={styles.splitLabel}>Via NFC taps</Text>
            <Text style={styles.splitVal}>{formatKobo(65000)}</Text>
          </View>
        </View>
        <View style={styles.accRow}>
          <Text style={styles.accLabel}>App account no.</Text>
          <Text style={styles.accVal}>0{phone.replace(/\s/g, '')}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => nav.navigate('driverWithdraw')}>
          <Text style={styles.primaryT}>Withdraw to Bank</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.primaryBtn, styles.greenBtn]} onPress={() => nav.navigate('driverGenerate')}>
          <Text style={[styles.primaryT, styles.primaryTOnGreen]}>Generate Payment code</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.softBtn} onPress={() => nav.navigate('driverSoftPOS')}>
        <Icon name="cardWifi" size={18} stroke={colors.green} sw={1.8} />
        <Text style={styles.softT}>Soft POS · tap cards on this phone</Text>
        <Icon name="chevron" size={16} stroke={colors.mut} />
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent transactions</Text>
        {trips.slice(0, 3).map((t) => (
          <View key={t.id} style={styles.txRow}>
            <View style={styles.txIcon}>
              <Icon name={t.method === 'qr' ? 'qr' : 'cardWifi'} size={18} stroke={colors.green} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.txTitle}>
                {t.title} · {t.passengers} {t.passengers === 1 ? 'passenger' : 'passengers'}
              </Text>
              <Text style={styles.txSub}>
                {t.time} · {t.method.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.txAmt}>+{formatKobo(t.amount)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: space.gutter, paddingTop: 56 },
  avatar: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  avatarT: { color: '#fff', fontFamily: SORA, fontWeight: '700', fontSize: 18 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontFamily: SORA, fontWeight: '700', fontSize: 16, color: colors.ink },
  dutyPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#E4F2EC', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 999 },
  dutyDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.green },
  dutyT: { fontSize: 11, color: colors.green, fontWeight: '700', fontFamily: MANROPE },
  sub: { fontSize: 12, color: colors.sub, fontFamily: MANROPE, marginTop: 2 },
  locBadge: { marginHorizontal: space.gutter, marginTop: 12, alignSelf: 'flex-start', flexDirection: 'row', gap: 6, backgroundColor: '#E4F2EC', paddingVertical: 6, paddingHorizontal: 11, borderRadius: 999 },
  locT: { fontSize: 11.5, color: colors.green, fontWeight: '700', fontFamily: MANROPE },
  earnCard: { marginHorizontal: space.gutter, marginTop: 14, backgroundColor: '#0a4030', borderRadius: 22, padding: 20 },
  earnTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  earnLabel: { color: '#9fc4b4', fontSize: 12.5, fontFamily: MANROPE, fontWeight: '600' },
  eyeBtn: { padding: 4 },
  earnAmount: { color: '#fff', fontFamily: SORA, fontSize: 32, fontWeight: '700', letterSpacing: -1, marginTop: 6 },
  earnSub: { color: '#a9d6c5', fontSize: 12.5, fontFamily: MANROPE, marginTop: 4 },
  earnSplit: { flexDirection: 'row', gap: 12, marginTop: 14 },
  splitBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: 12 },
  splitLabel: { color: '#9fc4b4', fontSize: 11, fontFamily: MANROPE, fontWeight: '600' },
  splitVal: { color: '#fff', fontFamily: SORA, fontWeight: '700', fontSize: 14, marginTop: 4 },
  accRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 12 },
  accLabel: { color: '#9fc4b4', fontSize: 12, fontFamily: MANROPE },
  accVal: { color: '#fff', fontFamily: 'Sora', fontWeight: '600', fontSize: 13 },
  actions: { flexDirection: 'row', gap: 10, marginHorizontal: space.gutter, marginTop: 14 },
  primaryBtn: { flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  greenBtn: { backgroundColor: colors.green, borderColor: colors.green },
  primaryT: { color: colors.ink, fontFamily: SORA, fontWeight: '700', fontSize: 13.5 },
  primaryTOnGreen: { color: '#fff' },
  softBtn: { marginHorizontal: space.gutter, marginTop: 10, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  softT: { flex: 1, fontFamily: SORA, fontWeight: '600', fontSize: 13, color: colors.ink },
  section: { marginHorizontal: space.gutter, marginTop: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 20, padding: 16 },
  sectionTitle: { fontFamily: SORA, fontWeight: '700', fontSize: 14, color: colors.ink, marginBottom: 12 },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.rowDivider },
  txIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#EAF1EC', alignItems: 'center', justifyContent: 'center' },
  txTitle: { fontFamily: SORA, fontWeight: '600', fontSize: 13, color: colors.ink },
  txSub: { fontSize: 11.5, color: colors.mut, fontFamily: MANROPE },
  txAmt: { fontFamily: SORA, fontWeight: '700', fontSize: 13, color: colors.green },
});

import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { colors, SORA, MANROPE, space } from '../../theme/tokens';
import { Icon } from '../../components/Icon';
import { useAppStore } from '../../store/useAppStore';
import { CTA } from '../../components/CTA';

export function DriverVerify() {
  const nav = useNavigation<any>();
  const riders = useAppStore((s) => s.nearbyRiders);
  const toggle = useAppStore((s) => s.toggleNearbyPaid);
  const fare = useAppStore((s) => s.fareNow());
  const confirm = useAppStore((s) => s.driverConfirmVerify);
  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 30 }}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => nav.goBack()}>
          <Icon name="back" size={20} stroke={colors.ink} sw={2.2} />
        </TouchableOpacity>
        <Text style={styles.title}>Accept Payment</Text>
      </View>

      <View style={styles.waitCard}>
        <View style={styles.pulseWrap}>
          <View style={styles.pulse} />
          <View style={styles.icon}>
            <Icon name="qr" size={32} stroke={colors.lime} sw={1.8} />
          </View>
        </View>
        <Text style={styles.waitTitle}>Waiting for a passenger to scan your QR or tap their card</Text>
        <Text style={styles.waitSub}>Show your QR code or keep Soft POS ready. Payments appear here instantly.</Text>
      </View>

      <Text style={styles.section}>Nearby riders</Text>
      <View style={styles.list}>
        {riders.map((r) => (
          <TouchableOpacity key={r.id} style={styles.row} onPress={() => toggle(r.id)}>
            <View style={styles.avatar}>
              <Text style={styles.avatarT}>{r.initial}</Text>
            </View>
            <Text style={styles.name}>{r.name}</Text>
            <View style={[styles.badge, r.paid ? styles.paid : styles.unpaid]}>
              <Text style={[styles.badgeT, r.paid ? styles.paidT : styles.unpaidT]}>{r.paid ? 'Paid' : 'Unpaid'}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ paddingHorizontal: space.gutter, marginTop: 18 }}>
        <CTA
          label={`Confirm fare received · ₦${Math.round(fare / 100)}`}
          onPress={() => {
            confirm();
            nav.goBack();
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper, paddingTop: 56 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, marginBottom: 8 },
  back: { width: 40, height: 40, borderRadius: 13, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: SORA, fontWeight: '700', fontSize: 18, color: colors.ink },
  waitCard: { marginHorizontal: space.gutter, backgroundColor: '#0a4030', borderRadius: 22, padding: 24, alignItems: 'center', gap: 12 },
  pulseWrap: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center' },
  pulse: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 36, backgroundColor: colors.lime, opacity: 0.12 },
  icon: { width: 72, height: 72, borderRadius: 20, backgroundColor: 'rgba(199,240,63,0.14)', alignItems: 'center', justifyContent: 'center' },
  waitTitle: { fontFamily: SORA, fontWeight: '600', fontSize: 14, color: '#fff', textAlign: 'center', lineHeight: 20 },
  waitSub: { fontFamily: MANROPE, fontSize: 12.5, color: '#a9d6c5', textAlign: 'center', lineHeight: 18 },
  section: { fontFamily: SORA, fontWeight: '700', fontSize: 13, color: colors.ink, marginHorizontal: space.gutter, marginTop: 18, marginBottom: 8 },
  list: { marginHorizontal: space.gutter, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 16, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: colors.rowDivider },
  avatar: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#EAF1EC', alignItems: 'center', justifyContent: 'center' },
  avatarT: { fontFamily: SORA, fontWeight: '700', fontSize: 16, color: colors.green },
  name: { flex: 1, fontFamily: SORA, fontWeight: '600', fontSize: 14, color: colors.ink },
  badge: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999 },
  paid: { backgroundColor: '#E4F2EC' },
  unpaid: { backgroundColor: '#FBF3DC' },
  badgeT: { fontFamily: SORA, fontWeight: '700', fontSize: 12 },
  paidT: { color: colors.green },
  unpaidT: { color: colors.statusPending },
});

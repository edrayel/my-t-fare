import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { colors, radius, typography, space, shadows } from '../theme/tokens';
import { Icon } from '../components/Icon';
import { CTA } from '../components/CTA';
import { Tile } from '../components/Tile';
import { SectionHead } from '../components/SectionHead';
import { TripRow } from '../components/TripRow';
import { Sheet } from '../components/Sheet';
import { TopupSheet } from './sheets/TopupSheet';
import { CampusSheet } from './sheets/CampusSheet';
import { useAppStore } from '../store/useAppStore';
import { formatKobo } from '../lib/money';
import type { TabProps } from './nav';

const TRAVEL: { icon: any; label: string; to: string }[] = [
  { icon: 'qr', label: 'Scan to Pay', to: 'scan' },
  { icon: 'route', label: 'Nearby Routes', to: 'soon' },
  { icon: 'book', label: 'Book Ride', to: 'soon' },
  { icon: 'live', label: 'Live Vehicles', to: 'soon' },
];

const SERVICES: { icon: any; label: string }[] = [
  { icon: 'bus', label: 'Bus' },
  { icon: 'taxi', label: 'Taxi' },
  { icon: 'keke', label: 'Keke' },
  { icon: 'shuttle', label: 'Shuttle' },
  { icon: 'brt', label: 'BRT' },
  { icon: 'boat', label: 'Water' },
  { icon: 'bike', label: 'Bike' },
];

const EXPLORE: { icon: any; label: string; to: string }[] = [
  { icon: 'gift', label: 'Gift / Request', to: 'giftPick' },
  { icon: 'star', label: 'Rewards', to: 'soon' },
  { icon: 'tag', label: 'Offers', to: 'soon' },
  { icon: 'chart', label: 'Insights', to: 'feed' },
];

export function Home() {
  const nav = useNavigation<any>();
  const balance = useAppStore((s) => s.balance);
  const points = useAppStore((s) => s.points);
  const campus = useAppStore((s) => s.campus);
  const cd = useAppStore((s) => s.campusData());
  const trips = useAppStore((s) => s.trips);
  const [topup, setTopup] = useState(false);
  const [campusOpen, setCampusOpen] = useState(false);

  const go = (to: string) => {
    if (to === 'soon') return;
    nav.navigate(to);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarT}>A</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.welcome}>Welcome back</Text>
          <Text style={styles.name}>Ada Nwosu</Text>
        </View>
        <TouchableOpacity style={styles.campusPill} onPress={() => setCampusOpen(true)}>
          <Icon name="pin" size={14} stroke={colors.brand} />
          <Text style={styles.campusPillT}>{cd.label}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bell}>
          <Icon name="bell" size={22} stroke={colors.ink} />
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </View>

      <View style={styles.wallet}>
        <View style={styles.walletTop}>
          <Text style={styles.walletLabel}>Wallet balance</Text>
          <View style={styles.pointsChip}>
            <Text style={styles.pointsT}>{points} pts</Text>
          </View>
        </View>
        <Text style={styles.balance}>{formatKobo(balance)}</Text>
        <View style={styles.walletBtns}>
          <TouchableOpacity style={styles.topupBtn} onPress={() => setTopup(true)}>
            <Icon name="plus" size={16} stroke={colors.ink} />
            <Text style={styles.topupT}>Top up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardBtn} onPress={() => nav.navigate('card')}>
            <Text style={styles.cardT}>My card</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.scanHero} activeOpacity={0.92} onPress={() => nav.navigate('scan')}>
        <View style={styles.scanIcon}>
          <Icon name="qr" size={24} stroke={colors.ink} />
        </View>
        <View>
          <Text style={styles.scanTitle}>Scan to Pay</Text>
          <Text style={styles.scanSub}>Point at the driver's QR code</Text>
        </View>
      </TouchableOpacity>

      <SectionHead title="Travel" right={<CampusPillLabel onTap={() => setCampusOpen(true)} label={cd.label} />} />
      <View style={styles.grid4}>
        {TRAVEL.map((t) => (
          <Tile key={t.label} icon={t.icon} label={t.label} onPress={() => go(t.to)} />
        ))}
      </View>

      <SectionHead title="Services" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.svcRow}>
        {SERVICES.map((s) => (
          <TouchableOpacity key={s.label} style={styles.svc} onPress={() => nav.navigate('scan')}>
            <View style={styles.svcIcon}>
              <Icon name={s.icon} size={24} stroke={colors.green} />
            </View>
            <Text style={styles.svcT}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <SectionHead title="Explore" />
      <View style={styles.grid4}>
        {EXPLORE.map((t) => (
          <Tile key={t.label} icon={t.icon} label={t.label} onPress={() => go(t.to)} />
        ))}
      </View>

      <SectionHead title="Recent activity" onSeeAll={() => nav.navigate('trips')} />
      <View style={styles.activity}>
        {trips.slice(0, 3).map((t) => (
          <TouchableOpacity
            key={t.id}
            activeOpacity={0.85}
            onPress={() => nav.navigate('receipt', { trip: t })}
          >
            <TripRow type={t.type} title={t.title} sub={t.sub} amount={t.amount} time={t.time} />
          </TouchableOpacity>
        ))}
      </View>

      <Sheet open={topup} onClose={() => setTopup(false)} title="Top up wallet">
        <TopupSheet onDone={() => setTopup(false)} />
      </Sheet>
      <Sheet open={campusOpen} onClose={() => setCampusOpen(false)} title="Your campus">
        <CampusSheet onDone={() => setCampusOpen(false)} />
      </Sheet>
    </ScrollView>
  );
}

function CampusPillLabel({ label, onTap }: { label: string; onTap: () => void }) {
  return (
    <TouchableOpacity style={styles.campusPill} onPress={onTap}>
      <Icon name="pin" size={14} stroke={colors.brand} />
      <Text style={styles.campusPillT}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: space.gutter, paddingTop: 58, paddingBottom: 8 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  avatarT: { color: '#fff', fontFamily: 'Sora', fontWeight: '700', fontSize: 18 },
  welcome: { ...typography.body, fontSize: 12.5 },
  name: { fontSize: 17, fontFamily: 'Sora', fontWeight: '700', color: colors.ink },
  campusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.tintCard, paddingVertical: 7, paddingHorizontal: 12, borderRadius: radius.pill },
  campusPillT: { color: colors.brand, fontFamily: 'Sora', fontWeight: '700', fontSize: 13 },
  bell: { position: 'relative', padding: 4 },
  bellDot: { position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.lime },
  wallet: {
    marginHorizontal: space.gutter,
    marginTop: 12,
    borderRadius: radius.cardLg,
    backgroundColor: colors.greenDeep,
    padding: 18,
    ...shadows.card,
  },
  walletTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  walletLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 13, fontFamily: 'Manrope' },
  pointsChip: { backgroundColor: colors.lime, borderRadius: radius.pill, paddingVertical: 5, paddingHorizontal: 12 },
  pointsT: { color: colors.ink, fontFamily: 'Sora', fontWeight: '700', fontSize: 12.5 },
  balance: { color: '#fff', fontSize: 38, fontFamily: 'Sora', fontWeight: '700', letterSpacing: -1, marginTop: 6 },
  walletBtns: { flexDirection: 'row', gap: 10, marginTop: 16 },
  topupBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.lime, borderRadius: 14, height: 46 },
  topupT: { color: colors.ink, fontFamily: 'Sora', fontWeight: '700' },
  cardBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 14, height: 46 },
  cardT: { color: '#fff', fontFamily: 'Sora', fontWeight: '700' },
  scanHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: space.gutter,
    marginTop: 16,
    backgroundColor: colors.green,
    borderRadius: radius.hero,
    padding: 16,
    ...shadows.card,
  },
  scanIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.lime, alignItems: 'center', justifyContent: 'center' },
  scanTitle: { color: '#fff', fontSize: 17, fontFamily: 'Sora', fontWeight: '700' },
  scanSub: { color: 'rgba(255,255,255,0.82)', fontSize: 13, fontFamily: 'Manrope', marginTop: 2 },
  grid4: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: space.gutter },
  svcRow: { gap: 12, paddingHorizontal: space.gutter },
  svc: { width: 84, alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.tile, padding: 14, borderWidth: 1, borderColor: colors.line },
  svcIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.tintCard, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  svcT: { color: colors.ink, fontSize: 13, fontFamily: 'Manrope', fontWeight: '600' },
  activity: { backgroundColor: colors.card, marginHorizontal: space.gutter, borderRadius: radius.card, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 14 },
});

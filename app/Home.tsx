import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { colors, radius, space, shadows, SORA, MANROPE } from '../theme/tokens';
import { Icon } from '../components/Icon';
import { Tile } from '../components/Tile';
import { SectionHead } from '../components/SectionHead';
import { TripRow } from '../components/TripRow';
import { Sheet } from '../components/Sheet';
import { TopupSheet } from './sheets/TopupSheet';
import { CampusSheet } from './sheets/CampusSheet';
import { useAppStore } from '../store/useAppStore';
import { formatKobo } from '../lib/money';
import { getVehicleEta } from '../lib/api';

const EXPLORE: { icon: any; label: string; to: string; accent: string; stroke: string }[] = [
  { icon: 'gift', label: 'Gift / Request', to: 'giftPick', accent: '#E7F0E9', stroke: colors.green },
  { icon: 'chart', label: 'Spending', to: 'spending', accent: '#EAF1EC', stroke: colors.green },
  { icon: 'star', label: 'Rewards', to: 'soon', accent: '#FBF3DC', stroke: '#a9810f' },
  { icon: 'tag', label: 'Offers', to: 'soon', accent: '#E7EFF5', stroke: '#2a6ea8' },
];

export function Home() {
  const nav = useNavigation<any>();
  const balance = useAppStore((s) => s.balance);
  const balParts = formatKobo(balance).split('.');
  const points = useAppStore((s) => s.points);
  const cd = useAppStore((s) => s.campusData());
  const trips = useAppStore((s) => s.trips);
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const routeNow = useAppStore((s) => s.routeNow());
  const [topup, setTopup] = useState(false);
  const [campusOpen, setCampusOpen] = useState(false);
  const occupancyPct = 63; // 19/30 seats, keeps bar + label consistent
  const [eta, setEta] = useState({ userEtaMin: 3, driverEtaMin: 4 });
  const isCampus = view === 'campus';

  useEffect(() => {
    let alive = true;
    getVehicleEta().then((e) => {
      if (!alive) return;
      setEta({ userEtaMin: e.userEtaMin, driverEtaMin: e.driverEtaMin });
    });
    return () => {
      alive = false;
    };
  }, [cd.label]);

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
        <View style={styles.segment}>
          <TouchableOpacity style={[styles.segBtn, isCampus && styles.segOn]} onPress={() => setView('campus')}>
            <Text style={[styles.segT, isCampus && styles.segTOn]}>Campus</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.segBtn, !isCampus && styles.segOn]} onPress={() => setView('normal')}>
            <Text style={[styles.segT, !isCampus && styles.segTOn]}>Normal</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.bell}>
          <Icon name="bell" size={18} stroke={colors.inkSoft} sw={1.8} />
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </View>

      <View style={styles.wallet}>
        <View style={styles.walletTop}>
          <Text style={styles.walletLabel}>Wallet balance</Text>
          <View style={styles.pointsChip}>
            <Icon name="star" size={12} stroke="none" fill={colors.lime} />
            <Text style={styles.pointsT}>{points} pts</Text>
          </View>
        </View>
        <Text style={styles.balance}>
          <Text style={styles.naira}>₦</Text>
          {balParts[0].replace('₦', '')}
          <Text style={styles.balanceDec}>.{balParts[1]}</Text>
        </Text>
        <View style={styles.walletBtns}>
          <TouchableOpacity style={styles.topupBtn} onPress={() => setTopup(true)}>
            <Icon name="plus" size={16} stroke={colors.ink} sw={2.4} />
            <Text style={styles.topupT}>Top up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardBtn} onPress={() => nav.navigate('card')}>
            <Icon name="cardLine" size={18} stroke={colors.lime} sw={1.9} />
            <Text style={styles.cardT}>My card</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.scanHero} activeOpacity={0.92} onPress={() => nav.navigate('scan')}>
        <View style={styles.scanIcon}>
          <Icon name="qr" size={23} stroke={colors.lime} sw={2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.scanTitle}>Scan to Pay</Text>
          <Text style={styles.scanSub}>Point at the driver's QR — or tap your card</Text>
        </View>
        <Icon name="chevron" size={22} stroke={colors.lime} sw={2.2} />
      </TouchableOpacity>

      {isCampus ? (
        <TouchableOpacity activeOpacity={0.92} style={styles.campusCard} onPress={() => nav.navigate('campusMap')}>
          <View style={styles.campusHead}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={styles.liveDot} />
              <Text style={styles.campusHeadT}>
                {cd.vehicle} · {routeNow}
              </Text>
            </View>
            <Text style={styles.campusHeadSub}>updated just now</Text>
          </View>

          {/* Mini map placeholder — matches dc.html grid streets */}
          <View style={styles.miniMap}>
            <View style={[styles.block, { left: '6%', top: '12%', width: '22%', height: '34%' }]} />
            <View style={[styles.block, { left: '34%', top: '54%', width: '18%', height: '34%' }]} />
            <View style={[styles.block, { left: '64%', top: '10%', width: '26%', height: '30%' }]} />
            <View style={styles.dashedLine} />
            <View style={styles.vehicleDot} />
            <Text style={styles.mapLabel}>live map</Text>
          </View>

          <View style={styles.occupancyRow}>
            <Text style={styles.occupancyLabel}>Onboard: 19/30 seats</Text>
            <View style={styles.occupancyTrack}>
              <View style={[styles.occupancyFill, { width: `${occupancyPct}%` }]} />
            </View>
          </View>
          <View style={styles.etaRow}>
            <Text style={styles.etaT}>You: {eta.userEtaMin} min away</Text>
            <Text style={styles.etaT}>Driver: {eta.driverEtaMin} min away</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity activeOpacity={0.92} style={styles.normalCard} onPress={() => nav.navigate('normalTransit')}>
          <View style={styles.normalIconWrap}>
            <View style={styles.normalPulse} />
            <View style={styles.normalIcon}>
              <Icon name="bus" size={20} stroke={colors.green} sw={1.8} />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.normalTitle}>A bus is near your stop</Text>
            <Text style={styles.normalSub}>Yaba Gate · approx. 3 min away</Text>
          </View>
          <Icon name="chevron" size={19} stroke="#c2cdc6" sw={2.2} />
        </TouchableOpacity>
      )}

      <SectionHead title="Explore" />
      <View style={styles.grid4}>
        {EXPLORE.map((t) => (
          <Tile key={t.label} icon={t.icon} label={t.label} accent={t.accent} stroke={t.stroke} onPress={() => go(t.to)} />
        ))}
      </View>

      <SectionHead title="Recent activity" onSeeAll={() => nav.navigate('trips')} />
      <View style={styles.activity}>
        {trips.slice(0, 3).map((t, i) => (
          <TouchableOpacity key={t.id} activeOpacity={0.85} onPress={() => nav.navigate('receipt', { trip: t })}>
            <TripRow type={t.type} title={t.title} sub={t.sub} amount={t.amount} time={t.time} last={i === trips.slice(0, 3).length - 1} />
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

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: space.gutter, paddingTop: 58, paddingBottom: 8 },
  avatar: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  avatarT: { color: '#fff', fontFamily: SORA, fontWeight: '700', fontSize: 16 },
  welcome: { fontFamily: MANROPE, fontSize: 12, fontWeight: '600', color: '#75857c' },
  name: { fontSize: 16, fontFamily: SORA, fontWeight: '600', color: colors.ink },
  segment: { flexDirection: 'row', backgroundColor: '#E7EBE3', borderRadius: 999, padding: 3, gap: 2 },
  segBtn: { paddingVertical: 6, paddingHorizontal: 11, borderRadius: 999 },
  segOn: { backgroundColor: colors.card, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  segT: { fontFamily: SORA, fontWeight: '700', fontSize: 11, color: colors.subSoft },
  segTOn: { color: colors.ink },
  bell: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  bellDot: { position: 'absolute', top: 8, right: 9, width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.lime, borderWidth: 1.5, borderColor: '#fff' },
  wallet: {
    marginHorizontal: space.gutter,
    marginTop: 8,
    borderRadius: 26,
    backgroundColor: colors.greenDeep,
    paddingVertical: 22,
    paddingHorizontal: 22,
    overflow: 'hidden',
    ...shadows.card,
  },
  walletTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  walletLabel: { color: '#9fc4b4', fontSize: 12.5, fontFamily: MANROPE, fontWeight: '600' },
  pointsChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(199,240,63,0.16)', borderRadius: 999, paddingVertical: 5, paddingHorizontal: 10 },
  pointsT: { color: '#d9f48a', fontFamily: SORA, fontWeight: '700', fontSize: 11.5 },
  balance: { color: '#fff', fontSize: 40, fontFamily: SORA, fontWeight: '700', letterSpacing: -1, marginTop: 12 },
  naira: { fontSize: 24, fontWeight: '600', opacity: 0.85, fontFamily: SORA },
  balanceDec: { color: 'rgba(255,255,255,0.55)', fontSize: 22, fontFamily: SORA, fontWeight: '600' },
  walletBtns: { flexDirection: 'row', gap: 10, marginTop: 18 },
  topupBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, backgroundColor: colors.lime, borderRadius: 15, height: 46 },
  topupT: { color: '#0a2117', fontFamily: SORA, fontWeight: '700', fontSize: 14 },
  cardBtn: { flex: 1, flexDirection: 'row', gap: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)', borderRadius: 15, height: 46 },
  cardT: { color: '#eafff5', fontFamily: SORA, fontWeight: '600', fontSize: 14 },
  scanHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    marginHorizontal: space.gutter,
    marginTop: 14,
    backgroundColor: colors.green,
    borderRadius: 20,
    padding: 16,
    ...shadows.card,
  },
  scanIcon: { width: 44, height: 44, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' },
  scanTitle: { color: '#fff', fontSize: 17, fontFamily: SORA, fontWeight: '700' },
  scanSub: { color: '#a9d6c5', fontSize: 12, fontFamily: MANROPE, fontWeight: '500', marginTop: 2 },
  // Campus card
  campusCard: {
    marginHorizontal: space.gutter,
    marginTop: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
    padding: 15,
    gap: 10,
  },
  campusHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  campusHeadT: { fontFamily: SORA, fontWeight: '700', fontSize: 13.5, color: colors.ink },
  campusHeadSub: { fontSize: 11, color: colors.mut, fontWeight: '600', fontFamily: MANROPE },
  liveDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.green },
  miniMap: {
    height: 88,
    borderRadius: 14,
    backgroundColor: '#EAF1EC',
    overflow: 'hidden',
    position: 'relative',
  },
  block: { position: 'absolute', borderRadius: 5, backgroundColor: 'rgba(11,21,18,0.08)' },
  dashedLine: {
    position: 'absolute',
    left: '6%',
    right: '6%',
    top: '50%',
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.green,
    opacity: 0.9,
  },
  vehicleDot: {
    position: 'absolute',
    top: '50%',
    left: '6%',
    width: 14,
    height: 14,
    marginTop: -7,
    borderRadius: 7,
    backgroundColor: colors.green,
    shadowColor: colors.green,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  mapLabel: { position: 'absolute', bottom: 5, right: 9, fontSize: 9, fontWeight: '600', color: colors.mut, fontFamily: MANROPE },
  occupancyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  occupancyLabel: { fontSize: 12, color: colors.subSoft, fontWeight: '600', fontFamily: MANROPE },
  occupancyTrack: { width: 70, height: 6, borderRadius: 3, backgroundColor: colors.line, overflow: 'hidden' },
  occupancyFill: { height: '100%', backgroundColor: colors.green },
  etaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  etaT: { fontSize: 11.5, color: colors.subSoft, fontWeight: '600', fontFamily: MANROPE },
  // Normal card
  normalCard: {
    marginHorizontal: space.gutter,
    marginTop: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  normalIconWrap: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  normalPulse: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 20, backgroundColor: 'rgba(12,107,79,0.10)' },
  normalIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: '#EAF1EC', alignItems: 'center', justifyContent: 'center' },
  normalTitle: { fontFamily: SORA, fontWeight: '700', fontSize: 13.5, color: colors.ink },
  normalSub: { fontSize: 12, color: colors.subSoft, fontWeight: '500', marginTop: 1, fontFamily: MANROPE },
  grid4: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: space.gutter },
  activity: { backgroundColor: colors.card, marginHorizontal: space.gutter, borderRadius: radius.card, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 18 },
});

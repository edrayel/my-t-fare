import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { colors, SORA, MANROPE } from '../theme/tokens';
import { Icon } from '../components/Icon';
import { useAppStore } from '../store/useAppStore';
import { getVehicleEta, type VehicleEta } from '../lib/api';

export function CampusMap() {
  const nav = useNavigation<any>();
  const cd = useAppStore((s) => s.campusData());
  const routeNow = useAppStore((s) => s.routeNow());
  const [eta, setEta] = useState<VehicleEta | null>(null);

  useEffect(() => {
    let alive = true;
    getVehicleEta().then((e) => {
      if (alive) setEta(e);
    });
    return () => {
      alive = false;
    };
  }, []);

  const occupancyPct = 63; // 19/30, matches Home

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => nav.goBack()}>
          <Icon name="back" size={20} stroke={colors.ink} sw={2.2} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Live tracking</Text>
          <Text style={styles.sub}>
            {cd.label} · {routeNow}
          </Text>
        </View>
      </View>

      <View style={styles.badge}>
        <Icon name="pin" size={13} stroke={colors.green} sw={2.2} />
        <Text style={styles.badgeT}>Auto-detected: {cd.label} · {cd.city}</Text>
      </View>

      <View style={styles.map}>
        <View style={[styles.block, { left: '8%', top: '14%', width: '24%', height: '28%' }]} />
        <View style={[styles.block, { left: '40%', top: '58%', width: '18%', height: '26%' }]} />
        <View style={[styles.block, { left: '66%', top: '12%', width: '26%', height: '24%' }]} />
        <View style={[styles.block, { left: '16%', top: '62%', width: '16%', height: '22%' }]} />
        <View style={styles.routeLine} />
        <View style={[styles.stopDot, { left: '10%' }]} />
        <View style={[styles.stopDot, { left: '90%' }]} />
        <View style={styles.vehicle}>
          <Icon name="bus" size={14} stroke={colors.lime} sw={2.2} />
        </View>
        <View style={styles.livePill}>
          <View style={styles.liveDot} />
          <Text style={styles.liveT}>updated just now</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.driverRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarT}>{cd.driver[0]}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.driverName}>{cd.driver}</Text>
            <Text style={styles.driverSub}>
              {cd.vehicle} · {cd.plate}
            </Text>
          </View>
        </View>
        <View style={styles.statRow}>
          <View>
            <Text style={styles.statLabel}>Onboard now</Text>
            <Text style={styles.statValue}>19 / 30 seats</Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${occupancyPct}%` }]} />
          </View>
        </View>
      </View>

      <View style={styles.etaCard}>
        <View style={styles.etaRow}>
          <View style={styles.etaIcon}>
            <Icon name="pin" size={17} stroke={colors.green} sw={1.8} />
          </View>
          <Text style={styles.etaLabel}>Your distance to stop</Text>
          <Text style={styles.etaValue}>{eta ? `${eta.userDistanceM}m · ${eta.userEtaMin} min` : '—'}</Text>
        </View>
        <View style={styles.etaRow}>
          <View style={styles.etaIcon}>
            <Icon name="bus" size={17} stroke={colors.green} sw={1.8} />
          </View>
          <Text style={styles.etaLabel}>Driver's distance to stop</Text>
          <Text style={styles.etaValue}>{eta ? `${eta.driverDistanceM}m · ${eta.driverEtaMin} min` : '—'}</Text>
        </View>
        <View style={[styles.etaRow, styles.etaHighlight]}>
          <View style={[styles.etaIcon, { backgroundColor: colors.green }]}>
            <Icon name="live" size={17} stroke={colors.lime} sw={2} />
          </View>
          <Text style={[styles.etaLabel, { fontWeight: '700' }]}>Boarding together in</Text>
          <Text style={[styles.etaValue, { color: colors.green, fontSize: 15 }]}>~{eta ? eta.togetherEtaMin : 4} min</Text>
        </View>
      </View>

      <Text style={styles.hint}>Position updates via lightweight push events — no continuous streaming needed.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 6 },
  back: { width: 40, height: 40, borderRadius: 13, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: SORA, fontWeight: '700', fontSize: 18, color: colors.ink },
  sub: { fontSize: 12, color: colors.subSoft, fontWeight: '500', fontFamily: MANROPE },
  badge: {
    marginHorizontal: 20,
    marginTop: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E4F2EC',
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 999,
  },
  badgeT: { fontSize: 11.5, color: colors.green, fontWeight: '700', fontFamily: MANROPE },
  map: {
    marginHorizontal: 18,
    marginTop: 10,
    height: 300,
    borderRadius: 22,
    backgroundColor: '#EAF1EC',
    overflow: 'hidden',
    position: 'relative',
  },
  block: { position: 'absolute', borderRadius: 8, backgroundColor: 'rgba(11,21,18,0.09)' },
  routeLine: {
    position: 'absolute',
    left: '10%',
    right: '10%',
    top: '50%',
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.green,
  },
  stopDot: { position: 'absolute', top: '50%', width: 12, height: 12, marginTop: -6, marginLeft: -6, borderRadius: 6, backgroundColor: colors.ink },
  vehicle: {
    position: 'absolute',
    left: '42%',
    top: '50%',
    width: 26,
    height: 26,
    marginTop: -13,
    marginLeft: -13,
    borderRadius: 13,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.green,
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  livePill: {
    position: 'absolute',
    top: 12,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.green },
  liveT: { fontSize: 11, fontWeight: '700', color: '#2d3c34', fontFamily: MANROPE },
  card: { marginHorizontal: 18, marginTop: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 20, padding: 18 },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: colors.rowDivider },
  avatar: { width: 46, height: 46, borderRadius: 14, backgroundColor: '#EEF3EF', alignItems: 'center', justifyContent: 'center' },
  avatarT: { fontFamily: SORA, fontWeight: '700', fontSize: 17, color: colors.green },
  driverName: { fontFamily: SORA, fontWeight: '700', fontSize: 15, color: colors.ink },
  driverSub: { fontSize: 12, color: colors.subSoft, fontWeight: '500', fontFamily: MANROPE },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14 },
  statLabel: { fontSize: 11.5, color: colors.mut, fontWeight: '600', fontFamily: MANROPE },
  statValue: { fontFamily: SORA, fontWeight: '700', fontSize: 16, color: colors.ink, marginTop: 2 },
  track: { width: 96, height: 8, borderRadius: 4, backgroundColor: colors.line, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.green },
  etaCard: { marginHorizontal: 18, marginTop: 14, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 20, overflow: 'hidden' },
  etaRow: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14, borderBottomWidth: 1, borderBottomColor: colors.rowDivider },
  etaHighlight: { backgroundColor: '#F1F8F4', borderBottomWidth: 0 },
  etaIcon: { width: 36, height: 36, borderRadius: 11, backgroundColor: '#EAF1EC', alignItems: 'center', justifyContent: 'center' },
  etaLabel: { flex: 1, fontFamily: SORA, fontWeight: '600', fontSize: 13.5, color: colors.ink },
  etaValue: { fontFamily: SORA, fontWeight: '700', fontSize: 14, color: colors.ink },
  hint: { marginHorizontal: 18, marginTop: 14, fontSize: 12, color: colors.mut, fontWeight: '500', lineHeight: 18, textAlign: 'center', fontFamily: MANROPE },
});

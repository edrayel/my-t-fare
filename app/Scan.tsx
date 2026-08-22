import { View, Text, StyleSheet, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRef, useState } from 'react';
import { colors } from '../theme/tokens';
import { Icon } from '../components/Icon';
import { SlideToPay } from '../components/SlideToPay';
import { useAppStore } from '../store/useAppStore';
import { resolveQr, type DriverQuote } from '../lib/api';
import { fmtCount } from '../lib/money';
import { bioAuth } from '../lib/biometric';

export function Scan() {
  const nav = useNavigation<any>();
  const [perm, requestPerm] = useCameraPermissions();
  const [found, setFound] = useState<DriverQuote | null>(null);
  const [scanning, setScanning] = useState(true);
  const ran = useRef(false);
  const cd = useAppStore((s) => s.campusData());
  const seatCount = useAppStore((s) => s.seatCount);
  const fareTotal = useAppStore((s) => s.fareTotal());
  const setSeatCount = useAppStore((s) => s.setSeatCount);
  const balance = useAppStore((s) => s.balance);
  const flashToast = useAppStore((s) => s.flashToast);

  const payNow = () => {
    if (fareTotal > balance) {
      flashToast('Insufficient funds');
      return;
    }
    nav.navigate('processing');
  };

  const onScanned = (r: BarcodeScanningResult) => {
    if (found || ran.current) return;
    ran.current = true;
    resolveQr(r.data).then((q) => {
      setFound(q);
      setScanning(false);
    });
  };

  const devSimulate = () => {
    if (found || ran.current) return;
    ran.current = true;
    resolveQr('dev').then((q) => {
      setFound(q);
      setScanning(false);
    });
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.top}>
        <TouchableOpacity style={styles.back} onPress={() => nav.goBack()}>
          <Icon name="back" size={20} stroke={colors.paper} sw={2.2} />
        </TouchableOpacity>
        <Text style={styles.title}>Scan to Pay</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.cam}>
        {!perm ? (
          <View style={styles.perm}>
            <Text style={styles.permT}>Loading camera…</Text>
          </View>
        ) : perm.granted ? (
          <CameraView
            style={StyleSheet.absoluteFill}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={onScanned}
          />
        ) : perm.canAskAgain ? (
          <TouchableOpacity style={styles.perm} onPress={() => requestPerm()}>
            <Icon name="qr" size={40} stroke={colors.lime} />
            <Text style={styles.permT}>Tap to enable camera</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.perm} onPress={() => Linking.openSettings()}>
            <Icon name="qr" size={40} stroke={colors.lime} />
            <Text style={styles.permT}>Camera blocked — open Settings</Text>
          </TouchableOpacity>
        )}
        {perm?.granted && (
          <View style={styles.reticleWrap} pointerEvents="none">
            <View style={styles.reticle}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
              {scanning && <View style={styles.scanLine} />}
            </View>
          </View>
        )}
        {perm?.granted && (
          <View style={styles.statusBar}>
            <Text style={[styles.status, !scanning && styles.statusFound]}>
              {scanning ? 'Looking for a QR code…' : 'Driver found · confirm fare below'}
            </Text>
          </View>
        )}
        {__DEV__ && !found && (
          <TouchableOpacity style={styles.devSim} onPress={devSimulate}>
            <Text style={styles.devSimT}>Simulate QR (dev)</Text>
          </TouchableOpacity>
        )}
      </View>

      {found && (
        <View style={styles.driverSheet}>
          <View style={styles.dRow}>
            <View style={styles.dAvatar}>
              <Text style={styles.dAvatarT}>{found.driver[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.dName}>{found.driver}</Text>
              <Text style={styles.dVeh}>{found.vehicle} · {found.plate}</Text>
            </View>
            <View style={styles.rating}>
              <Icon name="star" size={15} stroke="none" fill="#f0b81e" />
              <Text style={styles.ratingT}>{found.rating}</Text>
            </View>
          </View>
          <View style={styles.routeRow}>
            <Icon name="pin" size={18} stroke={colors.green} sw={2} />
            <Text style={styles.routeT}>
              {found.origin} → {found.destination}
            </Text>
            <Text style={styles.campusFare}>{`${cd.label} fare`}</Text>
          </View>
          <View style={styles.seatRow}>
            <Text style={styles.seatLabel}>Seats</Text>
            <TouchableOpacity
              style={[styles.seatBtn, seatCount <= 1 && styles.seatBtnDisabled]}
              disabled={seatCount <= 1}
              onPress={() => setSeatCount(seatCount - 1)}
            >
              <Icon name="minus" size={16} stroke={seatCount <= 1 ? colors.mut : colors.ink} sw={2.4} />
            </TouchableOpacity>
            <Text style={styles.seatCount}>{seatCount}</Text>
            <TouchableOpacity
              style={[styles.seatBtn, seatCount >= 4 && styles.seatBtnDisabled]}
              disabled={seatCount >= 4}
              onPress={() => setSeatCount(seatCount + 1)}
            >
              <Icon name="plus" size={16} stroke={seatCount >= 4 ? colors.mut : colors.ink} sw={2.4} />
            </TouchableOpacity>
          </View>
          <View style={styles.fareRow}>
            <Text style={styles.fareSym}>₦</Text>
            <Text style={styles.fareNum}>{fmtCount(Math.round(fareTotal / 100))}</Text>
          </View>
          <SlideToPay onPay={payNow} amount={fareTotal} />
          <View style={styles.authRow}>
            <TouchableOpacity style={styles.finger} onPress={async () => { if (await bioAuth()) payNow(); }}>
              <Icon name="finger" size={26} stroke={colors.green} sw={1.5} />
            </TouchableOpacity>
            <Text style={styles.help}>Or tap your My T-Fare card on the driver's reader — either way works. Exact digital payment, no cash needed.</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.greenDark },
  cam: {
    flex: 1,
    marginHorizontal: 22,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: '#15211b',
  },
  perm: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  permT: { color: colors.paper, fontFamily: 'Manrope', fontSize: 14 },
  reticleWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reticle: { width: 210, height: 210, marginBottom: 34 },
  corner: { position: 'absolute', width: 42, height: 42, borderColor: colors.lime },
  cornerTL: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 14 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 14 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 14 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 14 },
  scanLine: {
    position: 'absolute',
    left: '8%',
    right: '8%',
    top: '46%',
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.lime,
    shadowColor: colors.lime,
    shadowOpacity: 0.9,
    shadowRadius: 12,
  },
  statusBar: { position: 'absolute', left: 0, right: 0, bottom: 22, alignItems: 'center' },
  status: { color: '#9fc4b4', fontFamily: 'Manrope', fontSize: 13, fontWeight: '600' },
  statusFound: { color: colors.lime, fontWeight: '700' },
  devSim: { position: 'absolute', bottom: 6, alignSelf: 'center', backgroundColor: 'rgba(255,255,255,0.12)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999 },
  devSimT: { color: '#fff', fontSize: 11, fontFamily: 'Manrope', fontWeight: '700' },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingBottom: 8,
    paddingHorizontal: 22,
    zIndex: 4,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: colors.paper, fontSize: 15, fontFamily: 'Sora', fontWeight: '600' },
  driverSheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    paddingTop: 20,
    paddingHorizontal: 22,
    paddingBottom: 26,
  },
  dRow: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  dAvatar: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#EEF3EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dAvatarT: { color: colors.green, fontFamily: 'Sora', fontWeight: '700', fontSize: 18 },
  dName: { fontSize: 16, fontFamily: 'Sora', fontWeight: '700', color: colors.ink },
  dVeh: { fontSize: 12.5, fontFamily: 'Manrope', fontWeight: '500', color: '#75857c' },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingT: { fontSize: 13, fontFamily: 'Sora', fontWeight: '700', color: colors.ink },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F6F8F5',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 13,
    marginVertical: 16,
  },
  routeT: { fontSize: 13, fontFamily: 'Manrope', fontWeight: '600', color: '#2d3c34', flex: 1 },
  campusFare: { fontSize: 12, color: colors.mut, fontFamily: 'Manrope', fontWeight: '600' },
  seatRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 12 },
  seatLabel: { fontSize: 12, fontWeight: '700', color: '#75857c', fontFamily: 'Manrope' },
  seatBtn: { width: 32, height: 32, borderRadius: 10, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  seatBtnDisabled: { opacity: 0.45 },
  seatCount: { fontFamily: 'Sora', fontWeight: '700', fontSize: 16, color: colors.ink, minWidth: 16, textAlign: 'center' },
  fareRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 3,
    marginBottom: 14,
  },
  fareSym: { fontFamily: 'Sora', fontSize: 18, fontWeight: '600', color: colors.ink },
  fareNum: { fontFamily: 'Sora', fontSize: 36, fontWeight: '700', color: colors.ink, letterSpacing: -1 },
  authRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 },
  finger: {
    width: 60,
    height: 50,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#d7e0d9',
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  help: { flex: 1, fontSize: 11.5, color: '#a3afa7', fontFamily: 'Manrope', fontWeight: '600', lineHeight: 16 },
});

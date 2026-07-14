import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { colors } from '../theme/tokens';
import { Icon } from '../components/Icon';
import { SlideToPay } from '../components/SlideToPay';
import { useAppStore } from '../store/useAppStore';
import { resolveQr, type DriverQuote } from '../lib/api';
import { formatKobo } from '../lib/money';
import { bioAuth } from '../lib/biometric';

export function Scan() {
  const nav = useNavigation<any>();
  const [perm, requestPerm] = useCameraPermissions();
  const [found, setFound] = useState<DriverQuote | null>(null);
  const [scanning, setScanning] = useState(true);
  const ran = useRef(false);
  const cd = useAppStore((s) => s.campusData());

  useEffect(() => {
    if (ran.current || found) return;
    ran.current = true;
    resolveQr('').then((q) => {
      setFound(q);
      setScanning(false);
    });
  }, [found]);

  const payNow = () => nav.navigate('processing');

  const onScanned = (r: BarcodeScanningResult) => {
    if (found || ran.current) return;
    ran.current = true;
    resolveQr(r.data).then((q) => {
      setFound(q);
      setScanning(false);
    });
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.cam}>
        {perm?.granted ? (
          <CameraView
            style={StyleSheet.absoluteFill}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={onScanned}
          />
        ) : (
          <TouchableOpacity style={styles.perm} onPress={() => requestPerm()}>
            <Icon name="qr" size={40} stroke={colors.lime} />
            <Text style={styles.permT}>Tap to enable camera</Text>
          </TouchableOpacity>
        )}
        {[styles.cornerTL, styles.cornerTR, styles.cornerBL, styles.cornerBR].map((c, i) => (
          <View key={i} style={[styles.corner, c]} />
        ))}
        {scanning && <View style={styles.scanLine} />}
        <View style={styles.statusBar}>
          <Text style={styles.status}>
            {scanning ? 'Looking for a QR code…' : 'Driver found · confirm fare below'}
          </Text>
        </View>
      </View>

      <View style={styles.top}>
        <TouchableOpacity style={styles.back} onPress={() => nav.goBack()}>
          <Icon name="back" size={22} stroke={colors.paper} />
        </TouchableOpacity>
        <Text style={styles.title}>Scan to Pay</Text>
        <View style={{ width: 22 }} />
      </View>

      {found && (
        <View style={styles.driverSheet}>
          <View style={styles.grab} />
          <View style={styles.dRow}>
            <View style={styles.dAvatar}>
              <Text style={styles.dAvatarT}>{found.driver[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.dName}>{found.driver}</Text>
              <Text style={styles.dVeh}>{found.vehicle} · {found.plate}</Text>
            </View>
            <View style={styles.rating}>
              <Icon name="star" size={13} stroke="#f0b81e" fill="#f0b81e" />
              <Text style={styles.ratingT}>{found.rating}</Text>
            </View>
          </View>
          <View style={styles.routeRow}>
            <Icon name="pin" size={16} stroke={colors.green} />
            <Text style={styles.routeT}>
              {found.origin} → {found.destination}
            </Text>
            <Text style={styles.campusFare}>{`${cd.label} fare`}</Text>
          </View>
          <Text style={styles.fare}>{formatKobo(found.fareKobo)}</Text>
          <SlideToPay onPay={payNow} amount={found.fareKobo} />
          <TouchableOpacity style={styles.finger} onPress={async () => { if (await bioAuth()) payNow(); }}>
            <Icon name="finger" size={22} stroke={colors.brand} />
          </TouchableOpacity>
          <Text style={styles.help}>Tap the print to authorise · students ride fee-free, ₦0 charge</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.greenDark },
  cam: {
    position: 'absolute',
    top: 92,
    left: 22,
    right: 22,
    bottom: 300,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: '#15211b',
  },
  perm: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  permT: { color: colors.paper, fontFamily: 'Manrope', fontSize: 14 },
  corner: { position: 'absolute', width: 26, height: 26, borderColor: colors.lime, borderWidth: 3 },
  cornerTL: { top: 18, left: 18, borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 10 },
  cornerTR: { top: 18, right: 18, borderBottomWidth: 0, borderLeftWidth: 0, borderTopRightRadius: 10 },
  cornerBL: { bottom: 18, left: 18, borderTopWidth: 0, borderRightWidth: 0, borderBottomLeftRadius: 10 },
  cornerBR: { bottom: 18, right: 18, borderTopWidth: 0, borderLeftWidth: 0, borderBottomRightRadius: 10 },
  scanLine: {
    position: 'absolute',
    left: 40,
    right: 40,
    top: '45%',
    height: 2,
    backgroundColor: colors.lime,
    shadowColor: colors.lime,
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  statusBar: { position: 'absolute', left: 0, right: 0, bottom: 22, alignItems: 'center' },
  status: { color: colors.paper, fontFamily: 'Manrope', fontSize: 14, opacity: 0.9 },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: 22,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 4,
  },
  back: { padding: 4 },
  title: { color: colors.paper, fontSize: 18, fontFamily: 'Sora', fontWeight: '700' },
  driverSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    paddingHorizontal: 22,
    paddingBottom: 30,
    gap: 12,
  },
  grab: { width: 44, height: 5, borderRadius: 3, backgroundColor: colors.line, alignSelf: 'center' },
  dRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EEF3EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dAvatarT: { color: colors.green, fontFamily: 'Sora', fontWeight: '700', fontSize: 18 },
  dName: { fontSize: 16, fontFamily: 'Sora', fontWeight: '700', color: colors.ink },
  dVeh: { fontSize: 13, fontFamily: 'Manrope', color: colors.sub },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingT: { fontSize: 13, fontWeight: '700', color: colors.ink },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F6F8F5',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 13,
  },
  routeT: { fontSize: 14, fontFamily: 'Manrope', color: colors.ink, flex: 1 },
  campusFare: { fontSize: 12, color: colors.mut, fontFamily: 'Manrope', fontWeight: '700' },
  fare: {
    fontSize: 36,
    fontFamily: 'Sora',
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -1,
    textAlign: 'center',
    marginVertical: 2,
  },
  finger: {
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.tintCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  help: { textAlign: 'center', fontSize: 12, color: colors.sub, fontFamily: 'Manrope' },
});

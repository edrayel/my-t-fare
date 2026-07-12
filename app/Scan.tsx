import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { colors, radius, typography, space } from '../theme/tokens';
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
  const fareNow = useAppStore((s) => s.fareNow());
  const cd = useAppStore((s) => s.campusData());

  useEffect(() => {
    if (ran.current || found) return;
    ran.current = true;
    // Prototype fakes a 1.8s detect; production: BarCodeScanner -> POST /rides/resolve-qr
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
      </View>

      <View style={styles.top}>
        <TouchableOpacity style={styles.back} onPress={() => nav.goBack()}>
          <Icon name="back" size={22} stroke={colors.paper} />
        </TouchableOpacity>
        <Text style={styles.title}>Scan to Pay</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.statusBar}>
        <Text style={styles.status}>
          {scanning ? 'Looking for a QR code…' : 'Driver found · confirm fare below'}
        </Text>
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
            <Icon name="pin" size={16} stroke={colors.brand} />
            <Text style={styles.routeT}>
              {found.origin} → {found.destination}
            </Text>
            <Text style={styles.campusFare}>{`${cd.label} fare`}</Text>
          </View>
          <Text style={styles.fare}>{formatKobo(found.fareKobo)}</Text>
          <SlideToPay onPay={payNow} />
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
  cam: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: '#15211b' },
  perm: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  permT: { color: colors.paper, fontFamily: 'Manrope', fontSize: 14 },
  corner: { position: 'absolute', width: 26, height: 26, borderColor: colors.lime, borderWidth: 3 },
  cornerTL: { top: 96, left: 24, borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 10 },
  cornerTR: { top: 96, right: 24, borderBottomWidth: 0, borderLeftWidth: 0, borderTopRightRadius: 10 },
  cornerBL: { bottom: 320, left: 24, borderTopWidth: 0, borderRightWidth: 0, borderBottomLeftRadius: 10 },
  cornerBR: { bottom: 320, right: 24, borderTopWidth: 0, borderLeftWidth: 0, borderBottomRightRadius: 10 },
  scanLine: {
    position: 'absolute',
    left: 40,
    right: 40,
    top: 150,
    height: 2,
    backgroundColor: colors.lime,
    shadowColor: colors.lime,
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 56, paddingHorizontal: 22, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 4 },
  back: { padding: 4 },
  title: { color: colors.paper, fontSize: 18, fontFamily: 'Sora', fontWeight: '700' },
  statusBar: { position: 'absolute', top: 320, left: 0, right: 0, alignItems: 'center', zIndex: 4 },
  status: { color: colors.paper, fontFamily: 'Manrope', fontSize: 14, opacity: 0.9 },
  driverSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 18,
    paddingBottom: 30,
    gap: 12,
  },
  grab: { width: 44, height: 5, borderRadius: 3, backgroundColor: colors.line, alignSelf: 'center' },
  dRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  dAvatarT: { color: '#fff', fontFamily: 'Sora', fontWeight: '700', fontSize: 18 },
  dName: { fontSize: 16, fontFamily: 'Sora', fontWeight: '700', color: colors.ink },
  dVeh: { fontSize: 13, fontFamily: 'Manrope', color: colors.sub },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingT: { fontSize: 13, fontWeight: '700', color: colors.ink },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  routeT: { fontSize: 14, fontFamily: 'Manrope', color: colors.ink, flex: 1 },
  campusFare: { fontSize: 12, color: colors.brand, fontFamily: 'Manrope', fontWeight: '700' },
  fare: { fontSize: 36, fontFamily: 'Sora', fontWeight: '700', color: colors.ink, letterSpacing: -1, textAlign: 'center', marginVertical: 2 },
  finger: { alignSelf: 'center', width: 56, height: 56, borderRadius: 28, backgroundColor: colors.tintCard, alignItems: 'center', justifyContent: 'center' },
  help: { textAlign: 'center', fontSize: 12, color: colors.sub, fontFamily: 'Manrope' },
});

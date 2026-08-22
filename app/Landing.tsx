import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, SORA, MANROPE } from '../theme/tokens';
import { Icon } from '../components/Icon';
import { useAppStore } from '../store/useAppStore';

export function Landing({ navigation }: any) {
  const setMode = useAppStore((s) => s.setMode);
  const flashToast = useAppStore((s) => s.flashToast);

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.center}>
        <Image source={require('../assets/mytfare-logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.tagline}>Tap. Ride. Go.</Text>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.heading}>How are you riding today?</Text>
        <Text style={styles.sub}>Choose how you'd like to sign in</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            activeOpacity={0.92}
            style={styles.userBtn}
            onPress={() => {
              setMode('passenger');
              navigation.navigate('role');
            }}
          >
            <View style={styles.userIconWrap}>
              <Icon name="shuttle" size={24} stroke={colors.lime} sw={1.8} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userLabel}>User Login</Text>
              <Text style={styles.userHint}>Pay fares, plan trips, ride cashless</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.driverBtn}
            onPress={() => {
              setMode('driver');
              navigation.navigate('role');
            }}
          >
            <View style={styles.driverIconWrap}>
              <Icon name="taxi" size={24} stroke={colors.green} sw={1.8} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.driverLabel}>Driver Login</Text>
              <Text style={styles.driverHint}>Accept payments, track daily earnings</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: 26, paddingTop: 30, paddingBottom: 30 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  logo: { height: 64, width: 220 },
  tagline: { fontSize: 13, color: colors.sub, fontWeight: '600', marginTop: 6, fontFamily: MANROPE },
  bottom: { gap: 6 },
  heading: { fontFamily: SORA, fontWeight: '700', fontSize: 21, color: colors.ink, letterSpacing: -0.4, textAlign: 'center' },
  sub: { fontSize: 13, color: colors.sub, fontWeight: '500', textAlign: 'center', marginTop: 6, fontFamily: MANROPE },
  actions: { gap: 12, marginTop: 22 },
  userBtn: {
    backgroundColor: colors.green,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: colors.green,
    shadowOpacity: 0.28,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  userIconWrap: { width: 48, height: 48, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' },
  userLabel: { fontFamily: SORA, fontWeight: '700', fontSize: 17, color: '#fff' },
  userHint: { fontSize: 12, color: '#a9d6c5', fontWeight: '500', marginTop: 2, fontFamily: MANROPE },
  driverBtn: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  driverIconWrap: { width: 48, height: 48, borderRadius: 15, backgroundColor: '#EAF1EC', alignItems: 'center', justifyContent: 'center' },
  driverLabel: { fontFamily: SORA, fontWeight: '700', fontSize: 17, color: colors.ink },
  driverHint: { fontSize: 12, color: colors.subSoft, fontWeight: '500', marginTop: 2, fontFamily: MANROPE },
});

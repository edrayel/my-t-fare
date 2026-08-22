import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { colors, SORA, MANROPE, space } from '../../theme/tokens';
import { Icon } from '../../components/Icon';
import { useAppStore } from '../../store/useAppStore';

export function DriverProfile() {
  const nav = useNavigation<any>();
  const signOut = useAppStore((s) => s.signOut);
  const cd = useAppStore((s) => s.campusData());
  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => nav.goBack()}>
          <Icon name="back" size={20} stroke={colors.ink} sw={2.2} />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.top}>
        <View style={styles.avatar}>
          <Text style={styles.avatarT}>M</Text>
        </View>
        <Text style={styles.name}>Musa Abdullahi</Text>
        <Text style={styles.sub}>Driver · {cd.vehicle}</Text>
      </View>

      <View style={styles.list}>
        <View style={styles.row}>
          <Text style={styles.rowIcon}>🚐</Text>
          <Text style={styles.rowLabel}>Vehicle</Text>
          <Text style={styles.rowValue}>{cd.plate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowIcon}>📍</Text>
          <Text style={styles.rowLabel}>Route</Text>
          <Text style={styles.rowValue}>
            {cd.routes[0][0]} → {cd.routes[0][1]}
          </Text>
        </View>
        <TouchableOpacity style={styles.row} activeOpacity={0.8}>
          <Text style={styles.rowIcon}>🛡️</Text>
          <Text style={styles.rowLabel}>Security & PIN</Text>
          <Icon name="chevron" size={16} stroke={colors.mut} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.signout}
        onPress={() => {
          signOut();
          nav.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'landing' }] }));
        }}
      >
        <Text style={styles.signoutT}>Sign out</Text>
      </TouchableOpacity>
      <Text style={styles.footer}>My T-Fare v2.2 · Driver</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper, paddingTop: 56 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, marginBottom: 8 },
  back: { width: 40, height: 40, borderRadius: 13, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: SORA, fontWeight: '700', fontSize: 18, color: colors.ink },
  top: { alignItems: 'center', paddingVertical: 18, gap: 8 },
  avatar: { width: 76, height: 76, borderRadius: 38, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  avatarT: { color: '#fff', fontSize: 30, fontFamily: SORA, fontWeight: '700' },
  name: { fontSize: 22, fontFamily: SORA, fontWeight: '700', color: colors.ink },
  sub: { fontSize: 12, color: colors.sub, fontFamily: MANROPE },
  list: { marginTop: 12, backgroundColor: colors.card, marginHorizontal: space.gutter, borderRadius: 16, borderWidth: 1, borderColor: colors.line },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: colors.rowDivider },
  rowIcon: { fontSize: 18 },
  rowLabel: { flex: 1, fontSize: 15, fontFamily: MANROPE, color: colors.ink, fontWeight: '600' },
  rowValue: { color: colors.sub, fontSize: 13, fontFamily: MANROPE },
  signout: { marginTop: 22, alignItems: 'center' },
  signoutT: { color: colors.danger, fontFamily: SORA, fontWeight: '700', fontSize: 15 },
  footer: { textAlign: 'center', marginTop: 26, color: colors.mut, fontSize: 12, fontFamily: MANROPE },
});

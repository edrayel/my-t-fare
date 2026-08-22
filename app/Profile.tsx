import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { colors, radius, typography, space } from '../theme/tokens';
import { Icon } from '../components/Icon';
import { useAppStore } from '../store/useAppStore';

const SETTINGS: { icon: any; label: string; value: string }[] = [
  { icon: 'cardLine', label: 'Payment methods', value: '4 linked' },
  { icon: 'star', label: 'My T-Fare Points', value: '240 pts' },
  { icon: 'pin', label: 'Saved routes', value: '3' },
  { icon: 'bell', label: 'Notifications', value: 'On' },
  { icon: 'finger', label: 'Security & PIN', value: '' },
];

export function Profile() {
  const nav = useNavigation<any>();
  const role = useAppStore((s) => s.role);
  const points = useAppStore((s) => s.points);
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const signOut = useAppStore((s) => s.signOut);

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.top}>
        <View style={styles.avatar}>
          <Text style={styles.avatarT}>A</Text>
        </View>
        <Text style={styles.name}>Ada Nwosu</Text>
        <View style={styles.rolePill}>
          <Text style={styles.roleT}>{role}</Text>
        </View>
      </View>

      <View style={styles.modeCard}>
        <View style={styles.modeHead}>
          <Text style={styles.modeTitle}>Interface mode</Text>
          <Text style={styles.modeHint}>Switching re-scopes only the transit section on Home — wallet, activity and gifts stay the same.</Text>
        </View>
        <View style={styles.segment}>
          <TouchableOpacity style={[styles.segBtn, view === 'campus' && styles.segOn]} onPress={() => setView('campus')}>
            <Text style={[styles.segT, view === 'campus' && styles.segTOn]}>Campus</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.segBtn, view === 'normal' && styles.segOn]} onPress={() => setView('normal')}>
            <Text style={[styles.segT, view === 'normal' && styles.segTOn]}>Normal</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.list}>
        {SETTINGS.map((s) => (
          <TouchableOpacity
            key={s.label}
            style={styles.row}
            activeOpacity={0.8}
            onPress={() => {
              if (s.label === 'My T-Fare Points') nav.navigate('spending');
              if (s.label === 'Saved routes') nav.navigate('campusMap');
            }}
          >
            <View style={styles.rowIcon}>
              <Icon name={s.icon} size={20} stroke={colors.green} />
            </View>
            <Text style={styles.rowLabel}>{s.label}</Text>
            <Text style={styles.rowValue}>{s.label === 'My T-Fare Points' ? `${points} pts` : s.value}</Text>
          </TouchableOpacity>
        ))}
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

      <Text style={styles.footer}>My T-Fare v2.2 · Tap. Ride. Go.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper, paddingTop: 56 },
  top: { alignItems: 'center', paddingVertical: 18, gap: 10 },
  avatar: { width: 76, height: 76, borderRadius: 38, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  avatarT: { color: '#fff', fontSize: 30, fontFamily: 'Sora', fontWeight: '700' },
  name: { fontSize: 22, fontFamily: 'Sora', fontWeight: '700', color: colors.ink },
  rolePill: { backgroundColor: colors.tintCard, borderRadius: radius.pill, paddingVertical: 6, paddingHorizontal: 14 },
  roleT: { color: colors.brand, fontFamily: 'Sora', fontWeight: '700', fontSize: 13 },
  modeCard: { marginHorizontal: space.gutter, marginTop: 8, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: radius.card, padding: 16, gap: 12 },
  modeHead: { gap: 4 },
  modeTitle: { fontFamily: 'Sora', fontWeight: '700', fontSize: 14, color: colors.ink },
  modeHint: { fontFamily: 'Manrope', fontSize: 12, color: colors.sub, lineHeight: 16 },
  segment: { flexDirection: 'row', backgroundColor: '#E7EBE3', borderRadius: 999, padding: 3, gap: 2 },
  segBtn: { flex: 1, paddingVertical: 8, borderRadius: 999, alignItems: 'center' },
  segOn: { backgroundColor: colors.card, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  segT: { fontFamily: 'Sora', fontWeight: '700', fontSize: 12, color: colors.sub },
  segTOn: { color: colors.ink },
  list: { marginTop: 12, backgroundColor: colors.card, marginHorizontal: space.gutter, borderRadius: radius.card, borderWidth: 1, borderColor: colors.line },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderBottomWidth: 1, borderBottomColor: colors.rowDivider },
  rowIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.tintCard, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontSize: 15, fontFamily: 'Manrope', color: colors.ink, fontWeight: '600' },
  rowValue: { color: colors.sub, fontSize: 13, fontFamily: 'Manrope' },
  signout: { marginTop: 22, alignItems: 'center' },
  signoutT: { color: colors.danger, fontFamily: 'Sora', fontWeight: '700', fontSize: 15 },
  footer: { textAlign: 'center', marginTop: 26, color: colors.mut, fontSize: 12, fontFamily: 'Manrope' },
});

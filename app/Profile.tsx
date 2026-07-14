import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

      <View style={styles.list}>
        {SETTINGS.map((s) => (
          <TouchableOpacity key={s.label} style={styles.row} activeOpacity={0.8}>
            <View style={styles.rowIcon}>
              <Icon name={s.icon} size={20} stroke={colors.green} />
            </View>
            <Text style={styles.rowLabel}>{s.label}</Text>
            <Text style={styles.rowValue}>{s.label === 'My T-Fare Points' ? `${points} pts` : s.value}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.signout} onPress={() => { signOut(); nav.navigate('onboarding'); }}>
        <Text style={styles.signoutT}>Sign out</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>My T-Fare v2.1 · Tap. Ride. Go.</Text>
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
  list: { marginTop: 12, backgroundColor: colors.card, marginHorizontal: space.gutter, borderRadius: radius.card, borderWidth: 1, borderColor: colors.line },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderBottomWidth: 1, borderBottomColor: colors.rowDivider },
  rowIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.tintCard, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontSize: 15, fontFamily: 'Manrope', color: colors.ink, fontWeight: '600' },
  rowValue: { color: colors.sub, fontSize: 13, fontFamily: 'Manrope' },
  signout: { marginTop: 22, alignItems: 'center' },
  signoutT: { color: colors.danger, fontFamily: 'Sora', fontWeight: '700', fontSize: 15 },
  footer: { textAlign: 'center', marginTop: 26, color: colors.mut, fontSize: 12, fontFamily: 'Manrope' },
});

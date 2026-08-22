import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors, SORA } from '../theme/tokens';
import { Icon } from './Icon';

const TABS = [
  { name: 'driverHome', label: 'Home', icon: 'shuttle' as const },
  { name: 'driverHistory', label: 'History', icon: 'live' as const },
];

export function DriverBottomNav({ state, navigation }: BottomTabBarProps) {
  const active = state.routes[state.index]?.name;
  return (
    <View style={styles.bar}>
      {TABS.slice(0, 1).map((t) => (
        <Tab key={t.name} label={t.label} icon={t.icon} active={active === t.name} onPress={() => navigation.navigate(t.name)} />
      ))}
      <TouchableOpacity style={styles.fabWrap} activeOpacity={0.9} onPress={() => navigation.navigate('driverGenerate' as never)}>
        <View style={styles.fab}>
          <Icon name="qr" size={26} stroke={colors.lime} sw={2} />
        </View>
      </TouchableOpacity>
      {TABS.slice(1).map((t) => (
        <Tab key={t.name} label={t.label} icon={t.icon} active={active === t.name} onPress={() => navigation.navigate(t.name)} />
      ))}
      <Tab label="Profile" icon="tag" active={active === 'driverProfile'} onPress={() => navigation.navigate('driverProfile' as never)} />
    </View>
  );
}

function Tab({ label, icon, active, onPress }: { label: string; icon: any; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.tab} onPress={onPress} activeOpacity={0.8}>
      <Icon name={icon} size={22} stroke={active ? colors.green : colors.navIdle} sw={1.9} />
      <Text style={[styles.label, { color: active ? colors.green : colors.navIdle }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bar: { height: 70, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.line, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  tab: { flex: 1, alignItems: 'center', gap: 3, justifyContent: 'center' },
  label: { fontSize: 10.5, fontFamily: SORA, fontWeight: '700' },
  fabWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fab: { width: 58, height: 58, marginTop: -26, borderRadius: 19, backgroundColor: colors.green, borderWidth: 4, borderColor: colors.card, alignItems: 'center', justifyContent: 'center' },
});

import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '../theme/tokens';
import { Icon } from './Icon';

type TabKey = 'homeTab' | 'activityTab' | 'moneyTab' | 'profileTab';

const TABS = [
  { name: 'home', label: 'Home', icon: 'homeTab' as TabKey },
  { name: 'trips', label: 'Activity', icon: 'activityTab' as TabKey },
  { name: 'feed', label: 'Money', icon: 'moneyTab' as TabKey },
  { name: 'profile', label: 'Profile', icon: 'profileTab' as TabKey },
];

export function BottomNav({ state, navigation }: BottomTabBarProps) {
  const activeName = state.routes[state.index]?.name;
  return (
    <View style={styles.bar}>
      {TABS.slice(0, 2).map((t) => (
        <TabItem
          key={t.name}
          icon={t.icon}
          label={t.label}
          active={activeName === t.name}
          onPress={() => navigation.navigate(t.name)}
        />
      ))}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() => (navigation as any).navigate('scan')}
      >
        <View style={styles.fabInner}>
          <Icon name="qr" size={26} stroke={colors.lime} />
        </View>
      </TouchableOpacity>
      {TABS.slice(2).map((t) => (
        <TabItem
          key={t.name}
          icon={t.icon}
          label={t.label}
          active={activeName === t.name}
          onPress={() => navigation.navigate(t.name)}
        />
      ))}
    </View>
  );
}

function TabItem({
  icon,
  label,
  active,
  onPress,
}: {
  icon: Parameters<typeof Icon>[0]['name'];
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.tab} activeOpacity={0.8} onPress={onPress}>
      <Icon name={icon} size={23} stroke={active ? colors.green : colors.navIdle} />
      <Text style={[styles.label, { color: active ? colors.green : colors.navIdle }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 70,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
  },
  tab: { flex: 1, alignItems: 'center', gap: 3 },
  label: { fontSize: 10.5, fontWeight: '700', fontFamily: 'Sora' },
  fab: { width: 58, height: 58, marginTop: -26, alignItems: 'center', justifyContent: 'center' },
  fabInner: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.card,
    shadowColor: colors.green,
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});

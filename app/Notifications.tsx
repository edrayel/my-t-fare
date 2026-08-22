import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { colors, SORA, MANROPE, space } from '../theme/tokens';
import { Icon } from '../components/Icon';
import { useAppStore } from '../store/useAppStore';

export function Notifications() {
  const nav = useNavigation<any>();
  const notifications = useAppStore((s) => s.notifications);
  const markRead = useAppStore((s) => s.markNotificationsRead);

  useFocusEffect(
    useCallback(() => {
      const t = setTimeout(() => markRead(), 800);
      return () => clearTimeout(t);
    }, [markRead]),
  );

  const today = notifications.filter((n) => n.day === 'today');
  const earlier = notifications.filter((n) => n.day === 'earlier');

  const Group = ({ title, items }: { title: string; items: typeof notifications }) => (
    <>
      <Text style={styles.groupLabel}>{title}</Text>
      <View style={styles.group}>
        {items.map((n) => (
          <View key={n.id} style={styles.row}>
            <View style={[styles.icon, !n.read && styles.iconUnread]}>
              <Icon name={n.icon as any} size={18} stroke={n.read ? colors.mut : colors.green} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, !n.read && styles.rowTitleUnread]}>{n.title}</Text>
              <Text style={styles.rowBody}>{n.body}</Text>
              <Text style={styles.rowTime}>{n.time}</Text>
            </View>
            {!n.read && <View style={styles.dot} />}
          </View>
        ))}
      </View>
    </>
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 30 }}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => nav.goBack()}>
          <Icon name="back" size={20} stroke={colors.ink} sw={2.2} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
      </View>
      {today.length > 0 && <Group title="Today" items={today} />}
      {earlier.length > 0 && <Group title="Earlier" items={earlier} />}
      {notifications.length === 0 && <Text style={styles.empty}>No notifications yet</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper, paddingTop: 56 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, marginBottom: 8 },
  back: { width: 40, height: 40, borderRadius: 13, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: SORA, fontWeight: '700', fontSize: 18, color: colors.ink },
  groupLabel: { fontFamily: MANROPE, fontSize: 12, fontWeight: '700', color: colors.mut, marginHorizontal: space.gutter, marginTop: 16, marginBottom: 8 },
  group: { marginHorizontal: space.gutter, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 16, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: colors.rowDivider },
  icon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F6F8F5', alignItems: 'center', justifyContent: 'center' },
  iconUnread: { backgroundColor: '#EAF1EC' },
  rowTitle: { fontFamily: SORA, fontWeight: '600', fontSize: 14, color: colors.ink },
  rowTitleUnread: { fontWeight: '700' },
  rowBody: { fontFamily: MANROPE, fontSize: 12.5, color: colors.sub, marginTop: 2 },
  rowTime: { fontFamily: MANROPE, fontSize: 11, color: colors.mut, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.green },
  empty: { textAlign: 'center', marginTop: 40, fontFamily: MANROPE, fontSize: 13, color: colors.mut },
});

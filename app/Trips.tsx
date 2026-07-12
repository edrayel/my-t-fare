import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { colors, radius, typography, space } from '../theme/tokens';
import { Header } from '../components/Header';
import { TripRow } from '../components/TripRow';
import { useAppStore, type Trip } from '../store/useAppStore';

const FILTERS = ['All', 'Rides', 'Top-ups'] as const;
type Filter = (typeof FILTERS)[number];

export function Trips() {
  const nav = useNavigation<any>();
  const trips = useAppStore((s) => s.trips);
  const [filter, setFilter] = useState<Filter>('All');

  const shown = trips.filter((t) => {
    if (filter === 'Rides') return t.type === 'ride' || t.type === 'gift';
    if (filter === 'Top-ups') return t.type === 'topup';
    return true;
  });
  const today = shown.filter((t) => t.day === 'today');
  const earlier = shown.filter((t) => t.day === 'earlier');

  const renderGroup = (label: string, items: Trip[]) =>
    items.length === 0 ? null : (
      <View style={{ marginTop: 8 }}>
        <Text style={styles.group}>{label}</Text>
        <View style={styles.card}>
          {items.map((t, i) => (
            <View key={t.id}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => nav.navigate('receipt', { trip: t })}
                style={styles.rowWrap}
              >
                <TripRow type={t.type} title={t.title} sub={t.sub} amount={t.amount} time={t.time} />
              </TouchableOpacity>
              {i < items.length - 1 && <View style={styles.div} />}
            </View>
          ))}
        </View>
      </View>
    );

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <Header title="Activity" subtitle="All your rides & top-ups" />
      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <TouchableOpacity key={f} style={[styles.chip, filter === f && styles.chipOn]} onPress={() => setFilter(f)}>
            <Text style={[styles.chipT, filter === f && styles.chipTOn]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={[1]}
        keyExtractor={() => 'list'}
        renderItem={() => (
          <View>
            {renderGroup('Today', today)}
            {renderGroup('Earlier', earlier)}
            <View style={{ height: 110 }} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  filters: { flexDirection: 'row', gap: 10, paddingHorizontal: space.gutter, marginTop: 6, marginBottom: 4 },
  chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: radius.pill, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  chipOn: { backgroundColor: colors.green },
  chipT: { color: colors.ink, fontFamily: 'Manrope', fontWeight: '600', fontSize: 13 },
  chipTOn: { color: '#fff' },
  group: { paddingHorizontal: space.gutter, fontSize: 13, fontFamily: 'Manrope', fontWeight: '700', color: colors.sub, marginBottom: 6 },
  card: { backgroundColor: colors.card, marginHorizontal: space.gutter, borderRadius: radius.card, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 14 },
  rowWrap: {},
  div: { height: 1, backgroundColor: colors.rowDivider },
});

import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { colors, SORA, MANROPE } from '../theme/tokens';
import { Icon } from '../components/Icon';

const ALERTS = [
  { title: 'Bus at Yaba Gate', time: '08:12 · Today' },
  { title: 'Keke near Akoka', time: '07:40 · Today' },
  { title: 'Shuttle at Main Gate', time: '18:30 · Yesterday' },
];

export function NormalTransit() {
  const nav = useNavigation<any>();
  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => nav.goBack()}>
          <Icon name="back" size={20} stroke={colors.ink} sw={2.2} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Nearby stop alerts</Text>
          <Text style={styles.sub}>Normal View · city-wide</Text>
        </View>
      </View>

      <View style={styles.pulsingCard}>
        <View style={styles.pulseWrap}>
          <View style={styles.pulse} />
          <View style={styles.icon}>
            <Icon name="bus" size={21} stroke={colors.lime} sw={1.8} />
          </View>
        </View>
        <View>
          <Text style={styles.pulsingTitle}>Bus approaching Yaba Gate</Text>
          <Text style={styles.pulsingSub}>~3 min · updated just now</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Earlier today</Text>
      <View style={styles.list}>
        {ALERTS.map((a, i) => (
          <View key={a.title} style={[styles.row, i === ALERTS.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={styles.rowIcon}>
              <Icon name="bus" size={18} stroke={colors.green} sw={1.8} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{a.title}</Text>
              <Text style={styles.rowTime}>{a.time}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.hint}>City buses don't run fixed stops yet — we notify you when one is near your saved stop, instead of showing a live map.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 6 },
  back: { width: 40, height: 40, borderRadius: 13, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: SORA, fontWeight: '700', fontSize: 18, color: colors.ink },
  sub: { fontSize: 12, color: colors.subSoft, fontWeight: '500', fontFamily: MANROPE },
  pulsingCard: {
    marginHorizontal: 18,
    marginTop: 14,
    backgroundColor: '#0a4030',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  pulseWrap: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  pulse: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 22, backgroundColor: colors.lime, opacity: 0.16 },
  icon: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(199,240,63,0.16)', alignItems: 'center', justifyContent: 'center' },
  pulsingTitle: { fontFamily: SORA, fontWeight: '700', fontSize: 14, color: '#fff' },
  pulsingSub: { fontSize: 12, color: '#a9d6c5', fontWeight: '500', marginTop: 2, fontFamily: MANROPE },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: colors.mut, textTransform: 'uppercase', letterSpacing: 0.5, marginHorizontal: 22, marginTop: 18, marginBottom: 8, fontFamily: MANROPE },
  list: { marginHorizontal: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 20, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 13, borderBottomWidth: 1, borderBottomColor: colors.rowDivider },
  rowIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#EAF1EC', alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontFamily: SORA, fontWeight: '600', fontSize: 13, color: colors.ink },
  rowTime: { fontSize: 11.5, color: colors.mut, fontWeight: '500', fontFamily: MANROPE },
  hint: { marginHorizontal: 18, marginTop: 12, fontSize: 12, color: colors.mut, fontWeight: '500', lineHeight: 18, textAlign: 'center', fontFamily: MANROPE },
});

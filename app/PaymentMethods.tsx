import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { colors, SORA, MANROPE, space } from '../theme/tokens';
import { Icon } from '../components/Icon';
import { useAppStore } from '../store/useAppStore';

const METHODS = [
  { key: 'opay', label: 'OPay', detail: '0803 •• ••20 · primary', icon: 'cardLine' as const },
  { key: 'palmpay', label: 'PalmPay', detail: '0814 •• ••40', icon: 'cardLine' as const },
  { key: 'bank', label: 'GTBank', detail: '•••• 6789 · savings', icon: 'cardLine' as const },
];

export function PaymentMethods() {
  const nav = useNavigation<any>();
  const flashToast = useAppStore((s) => s.flashToast);
  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 30 }}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => nav.goBack()}>
          <Icon name="back" size={20} stroke={colors.ink} sw={2.2} />
        </TouchableOpacity>
        <Text style={styles.title}>Payment methods</Text>
      </View>

      <View style={styles.list}>
        {METHODS.map((m, i) => (
          <View key={m.key} style={[styles.row, i === METHODS.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={styles.icon}>
              <Icon name={m.icon} size={20} stroke={colors.green} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{m.label}</Text>
              <Text style={styles.detail}>{m.detail}</Text>
            </View>
            {i === 0 && <View style={styles.dot} />}
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.add} onPress={() => flashToast('Add method — coming soon')}>
        <Icon name="plus" size={18} stroke={colors.green} sw={2} />
        <Text style={styles.addT}>Add payment method</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper, paddingTop: 56 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, marginBottom: 8 },
  back: { width: 40, height: 40, borderRadius: 13, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: SORA, fontWeight: '700', fontSize: 18, color: colors.ink },
  list: { marginHorizontal: space.gutter, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 16, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: colors.rowDivider },
  icon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#EAF1EC', alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: SORA, fontWeight: '600', fontSize: 14, color: colors.ink },
  detail: { fontFamily: MANROPE, fontSize: 12, color: colors.mut, marginTop: 2 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.green },
  add: { marginHorizontal: space.gutter, marginTop: 14, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center' },
  addT: { fontFamily: SORA, fontWeight: '700', fontSize: 14, color: colors.green },
});

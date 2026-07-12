import { Text, View, StyleSheet } from 'react-native';
import { colors, typography } from '../theme/tokens';

export function ResultRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      {typeof value === 'string' ? <Text style={styles.value}>{value}</Text> : value}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 11 },
  label: { ...typography.body, color: colors.sub },
  value: { ...typography.label, fontSize: 14, color: colors.ink },
});

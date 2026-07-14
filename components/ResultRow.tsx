import { Text, View, StyleSheet } from 'react-native';
import { colors, typography } from '../theme/tokens';

export function ResultRow({
  label,
  value,
  onDark,
}: {
  label: string;
  value: React.ReactNode;
  onDark?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, onDark && styles.labelDark]}>{label}</Text>
      {typeof value === 'string' ? (
        <Text style={[styles.value, onDark && styles.valueDark]}>{value}</Text>
      ) : (
        value
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
  },
  label: { ...typography.body, color: colors.sub },
  labelDark: { color: '#9fc4b4' },
  value: { ...typography.label, fontSize: 14, color: colors.ink },
  valueDark: { color: '#fff' },
});

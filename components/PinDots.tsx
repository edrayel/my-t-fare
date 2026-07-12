import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/tokens';

export function PinDots({ pin, max = 4 }: { pin: string; max?: number }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: max }).map((_, i) => (
        <View key={i} style={[styles.dot, i < pin.length ? styles.filled : styles.empty]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 16, justifyContent: 'center' },
  dot: { width: 16, height: 16, borderRadius: 8 },
  filled: { backgroundColor: colors.brand },
  empty: { borderWidth: 1.5, borderColor: colors.fieldEdge },
});

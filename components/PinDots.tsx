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
  row: { flexDirection: 'row', gap: 28, justifyContent: 'center' },
  dot: { width: 18, height: 18, borderRadius: 9 },
  filled: { backgroundColor: colors.green },
  empty: { borderWidth: 1.5, borderColor: '#cdd5cf' },
});

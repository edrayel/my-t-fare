import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { colors, typography } from '../theme/tokens';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'dot', '0', 'del'];

export function Keypad({
  onKey,
  onDelete,
}: {
  onKey: (k: string) => void;
  onDelete: () => void;
}) {
  return (
    <View style={styles.grid}>
      {KEYS.map((k) => {
        if (k === 'dot') return <View key={k} style={styles.cell} />;
        const isDel = k === 'del';
        return (
          <TouchableOpacity
            key={k}
            activeOpacity={0.6}
            style={styles.cell}
            onPress={() => (isDel ? onDelete() : onKey(k))}
          >
            {isDel ? (
              <Text style={styles.del}>⌫</Text>
            ) : (
              <Text style={[typography.amountSm, styles.key]}>{k}</Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  cell: {
    width: '32%',
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  key: { color: colors.ink },
  del: { fontSize: 26, color: colors.ink },
});

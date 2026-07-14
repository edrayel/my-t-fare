import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/tokens';

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <View style={styles.row} accessibilityLabel="My T-Fare">
      <Text style={[styles.mark, { fontSize: size }]}>
        <Text style={{ color: colors.brand }}>MY</Text>
        <Text style={{ color: colors.ink }}>T</Text>
        <Text style={{ color: colors.brand }}>-FARE</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  mark: { fontFamily: 'Sora', fontWeight: '800', letterSpacing: -0.5 },
});

import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius } from '../theme/tokens';

export function Logo({ size = 40, bg = colors.green }: { size?: number; bg?: string }) {
  return (
    <View style={[styles.box, { width: size, height: size, borderRadius: size * 0.32, backgroundColor: bg }]}>
      <Text style={[styles.t, { fontSize: size * 0.5 }]}>T</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center' },
  t: { color: '#fff', fontFamily: 'Sora', fontWeight: '800', letterSpacing: -1 },
});

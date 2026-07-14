import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { colors, radius } from '../theme/tokens';
import { Icon } from './Icon';

export function Tile({
  icon,
  label,
  onPress,
  sub,
  value,
  accent,
  stroke,
}: {
  icon: Parameters<typeof Icon>[0]['name'];
  label: string;
  onPress?: () => void;
  sub?: string;
  value?: string;
  accent?: string;
  stroke?: string;
}) {
  const Comp = onPress ? TouchableOpacity : View;
  return (
    <Comp activeOpacity={0.85} onPress={onPress} style={styles.tile}>
      <View style={[styles.icon, { backgroundColor: accent ?? colors.tintCard }]}>
        <Icon name={icon} size={20} stroke={stroke ?? colors.green} />
      </View>
      {value ? (
        <Text style={styles.value}>{value}</Text>
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
      {sub && <Text style={styles.sub}>{sub}</Text>}
    </Comp>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 72,
    backgroundColor: colors.card,
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: colors.green,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.icon,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  label: { fontSize: 11, fontFamily: 'Sora', fontWeight: '600', color: colors.ink, textAlign: 'center' },
  value: { fontSize: 14, fontFamily: 'Sora', fontWeight: '700', color: colors.ink },
  sub: { fontSize: 10, color: colors.sub, marginTop: 2, textAlign: 'center' },
});

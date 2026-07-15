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
      <View style={[styles.icon, { backgroundColor: accent ?? '#EAF1EC' }]}>
        <Icon name={icon} size={21} stroke={stroke ?? colors.green} sw={1.8} />
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
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.icon,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  label: { fontSize: 11, fontFamily: 'Sora', fontWeight: '600', color: colors.inkSoft, textAlign: 'center', lineHeight: 13 },
  value: { fontSize: 14, fontFamily: 'Sora', fontWeight: '700', color: colors.ink },
  sub: { fontSize: 10, color: colors.sub, marginTop: 2, textAlign: 'center' },
});

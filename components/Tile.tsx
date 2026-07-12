import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { colors, radius, typography, space } from '../theme/tokens';
import { Icon } from './Icon';

export function Tile({
  icon,
  label,
  onPress,
  sub,
  value,
  tinted,
}: {
  icon: Parameters<typeof Icon>[0]['name'];
  label: string;
  onPress?: () => void;
  sub?: string;
  value?: string;
  tinted?: boolean;
}) {
  const Comp = onPress ? TouchableOpacity : View;
  return (
    <Comp activeOpacity={0.85} onPress={onPress} style={styles.tile}>
      <View style={[styles.icon, tinted && styles.iconTint]}>
        <Icon name={icon} size={22} stroke={tinted ? colors.brand : colors.green} />
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
    backgroundColor: colors.card,
    borderRadius: radius.tile,
    padding: 14,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: colors.green,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: radius.icon,
    backgroundColor: colors.tintCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconTint: { backgroundColor: colors.tintCard },
  label: { ...typography.body, color: colors.ink, fontWeight: '600' },
  value: { ...typography.label, fontSize: 18, color: colors.ink },
  sub: { ...typography.body, marginTop: 2 },
});

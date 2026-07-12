import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { colors, radius, typography } from '../theme/tokens';
import { Icon } from './Icon';
import { formatKobo } from '../lib/money';

const TYPE_ICON: Record<string, Parameters<typeof Icon>[0]['name']> = {
  ride: 'shuttle',
  gift: 'gift',
  topup: 'plus',
};

export function TripRow({
  type,
  title,
  sub,
  amount,
  time,
  onPress,
}: {
  type: 'ride' | 'gift' | 'topup';
  title: string;
  sub: string;
  amount: number;
  time?: string;
  onPress?: () => void;
}) {
  const credit = amount > 0;
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.row}>
      <View style={styles.icon}>
        <Icon name={TYPE_ICON[type]} size={20} stroke={colors.green} />
      </View>
      <View style={styles.mid}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{sub}</Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: credit ? colors.green : colors.danger }]}>
          {formatKobo(amount)}
        </Text>
        {time && <Text style={styles.time}>{time}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.tintCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mid: { flex: 1 },
  right: { alignItems: 'flex-end' },
  title: { ...typography.body, color: colors.ink, fontWeight: '600', fontSize: 14 },
  sub: { ...typography.body, fontSize: 12.5 },
  amount: { ...typography.label, fontSize: 15 },
  time: { ...typography.body, fontSize: 11.5, marginTop: 2 },
});

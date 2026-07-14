import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { colors, typography } from '../theme/tokens';
import { Icon } from './Icon';
import { formatKobo } from '../lib/money';

const TYPE_ICON: Record<string, Parameters<typeof Icon>[0]['name']> = {
  ride: 'shuttle',
  gift: 'gift',
  topup: 'up',
};
const TYPE_BG: Record<string, string> = {
  ride: colors.tintCard,
  gift: colors.tintCard,
  topup: '#FBF3DC',
};
const TYPE_STROKE: Record<string, string> = {
  ride: colors.green,
  gift: colors.green,
  topup: '#7a5d12',
};

export function TripRow({
  type,
  title,
  sub,
  amount,
  time,
  onPress,
  last,
}: {
  type: 'ride' | 'gift' | 'topup';
  title: string;
  sub: string;
  amount: number;
  time?: string;
  onPress?: () => void;
  last?: boolean;
}) {
  const credit = amount > 0;
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.row, !last && styles.divider]}
    >
      <View style={[styles.icon, { backgroundColor: TYPE_BG[type] }]}>
        <Icon name={TYPE_ICON[type]} size={20} stroke={TYPE_STROKE[type]} />
      </View>
      <View style={styles.mid}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{sub}</Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: credit ? colors.green : colors.ink }]}>
          {formatKobo(amount)}
        </Text>
        {time && <Text style={styles.time}>{time}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 15,
  },
  divider: { borderBottomWidth: 1, borderColor: colors.rowDivider },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mid: { flex: 1 },
  right: { alignItems: 'flex-end' },
  title: { ...typography.body, color: colors.ink, fontWeight: '600', fontSize: 13.5 },
  sub: { ...typography.body, fontSize: 12 },
  amount: { ...typography.label, fontSize: 14 },
  time: { ...typography.body, fontSize: 11.5, marginTop: 2 },
});

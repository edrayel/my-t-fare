import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { colors, typography, space } from '../theme/tokens';
import { Icon } from './Icon';

export function Header({
  title,
  subtitle,
  right,
  onBack,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onBack?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.back} hitSlop={10}>
            <Icon name="back" size={22} stroke={colors.ink} />
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}>
          <Text style={typography.screenTitle}>{title}</Text>
          {subtitle && <Text style={[styles.sub, { marginTop: 2 }]}>{subtitle}</Text>}
        </View>
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.gutter, paddingTop: 6, paddingBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  back: { padding: 4, marginLeft: -4 },
  sub: { ...typography.body, color: colors.sub },
});

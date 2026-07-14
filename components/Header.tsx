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
          <Text style={{ fontFamily: 'Sora', fontWeight: '700', fontSize: 18, color: colors.ink, letterSpacing: -0.5 }}>{title}</Text>
          {subtitle && <Text style={[styles.sub, { marginTop: 2 }]}>{subtitle}</Text>}
        </View>
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  back: { width: 40, height: 40, borderRadius: 13, borderWidth: 1, borderColor: colors.line, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginLeft: -4 },
  sub: { ...typography.body, color: colors.sub },
});

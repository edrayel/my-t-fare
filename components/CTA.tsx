import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { colors, radius, typography } from '../theme/tokens';

type Variant = 'brand' | 'lime' | 'outline' | 'dark';

export interface CTAProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  full?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function CTA({ label, onPress, variant = 'brand', disabled, full, loading, style }: CTAProps) {
  const bg =
    variant === 'lime' ? colors.lime : variant === 'dark' ? colors.greenDark : variant === 'outline' ? 'transparent' : colors.brand;
  const fg = variant === 'lime' ? colors.ink : variant === 'outline' ? colors.ink : '#fff';
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.btn,
        { backgroundColor: bg, borderColor: variant === 'outline' ? colors.fieldEdge : 'transparent' },
        full && styles.full,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text style={[typography.label, { color: fg }]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 18,
    shadowColor: colors.brand,
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  full: { width: '100%' },
  disabled: { opacity: 0.5 },
});

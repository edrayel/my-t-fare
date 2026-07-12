import { Text, View, StyleSheet } from 'react-native';
import { colors, typography, radius } from '../theme/tokens';
import { useAppStore } from '../store/useAppStore';
import { Icon } from './Icon';

export function BioOverlay() {
  const busy = useAppStore((s) => s.bioBusy);
  if (!busy) return null;
  return (
    <View style={styles.scrim}>
      <View style={styles.tile}>
        <Icon name="finger" size={42} stroke={colors.lime} sw={1.8} />
      </View>
      <Text style={[typography.label, styles.text]}>Authenticating…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(8,15,11,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  tile: {
    width: 96,
    height: 96,
    borderRadius: radius.cardLg,
    backgroundColor: 'rgba(199,240,63,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  text: { color: colors.paper },
});

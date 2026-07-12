import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, space } from '../theme/tokens';
import { Icon } from './Icon';

export function SectionHead({
  title,
  right,
  onSeeAll,
  seeAllLabel = 'See all',
}: {
  title: string;
  right?: React.ReactNode;
  onSeeAll?: () => void;
  seeAllLabel?: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {onSeeAll ? (
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.see}>{seeAllLabel}</Text>
        </TouchableOpacity>
      ) : (
        right
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.gutter,
    marginTop: space.sectionTop,
    marginBottom: space.sectionGap,
  },
  title: { ...typography.label, fontSize: 17 },
  see: { ...typography.body, color: colors.brand, fontWeight: '600' },
});

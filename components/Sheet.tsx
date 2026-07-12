import { useEffect, type ReactNode } from 'react';
import { Modal, TouchableOpacity, View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { colors, radius, space, typography } from '../theme/tokens';

export function Sheet({
  open,
  onClose,
  title,
  children,
  height = '78%',
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  height?: string | number;
}) {
  const y = useSharedValue(1);

  useEffect(() => {
    y.value = withTiming(open ? 0 : 1, { duration: 280 });
  }, [open, y]);

  const panel = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value * 720 }],
  }));

  return (
    <Modal visible={open} transparent animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <Animated.View style={[styles.panel, { height: height as ViewStyle['height'] }, panel]}>
        <View style={styles.handle} />
        {title && <Text style={[typography.screenTitle, styles.title]}>{title}</Text>}
        <View style={{ paddingHorizontal: space.gutter, paddingBottom: space.gutterLg }}>{children}</View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(8,15,11,0.45)' },
  panel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 50,
    shadowOffset: { width: 0, height: -20 },
    elevation: 14,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.line,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: { paddingHorizontal: space.gutter, marginBottom: 10, fontSize: 20 },
});

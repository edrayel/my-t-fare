import { Text, View, StyleSheet, Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';
import { colors, typography, radius } from '../theme/tokens';
import { useAppStore } from '../store/useAppStore';
import { Icon } from './Icon';

export function Toast() {
  const toast = useAppStore((s) => s.toast);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toast) {
      Animated.timing(opacity, { toValue: 1, duration: 200, easing: Easing.linear, useNativeDriver: true }).start();
    } else {
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }
  }, [toast, opacity]);

  if (!toast) return null;
  return (
    <Animated.View style={[styles.pill, { opacity }]} pointerEvents="none">
      <Icon name="check" size={18} stroke={colors.lime} />
      <Text style={styles.msg}>{toast}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    position: 'absolute',
    bottom: 96,
    alignSelf: 'center',
    backgroundColor: colors.greenDark,
    borderRadius: radius.pill,
    paddingVertical: 11,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  msg: { ...typography.body, color: colors.paper, fontSize: 13.5, fontFamily: 'Sora' },
});

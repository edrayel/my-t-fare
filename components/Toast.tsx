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
      <View style={styles.badge}>
        <Icon name="check" size={16} stroke="#0a2117" sw={2.4} />
      </View>
      <Text style={styles.msg}>{toast}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    position: 'absolute',
    bottom: 86,
    left: 18,
    right: 18,
    backgroundColor: colors.greenDark,
    borderRadius: radius.pill,
    paddingVertical: 11,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  msg: { ...typography.body, color: colors.paper, fontSize: 13.5, fontFamily: 'Sora' },
});

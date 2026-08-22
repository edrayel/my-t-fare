import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { colors, typography } from '../theme/tokens';
import { useAppStore } from '../store/useAppStore';

export function Processing() {
  const nav = useNavigation<any>();
  const spin = useRef(new Animated.Value(0)).current;
  const payRide = useAppStore((s) => s.payRide);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true }),
    ).start();
  }, [spin]);

  useEffect(() => {
    const t = setTimeout(() => {
      const r = payRide();
      if (!r.ref) {
        if (nav.canGoBack()) nav.goBack();
        return;
      }
      nav.navigate('success');
    }, 1100);
    return () => clearTimeout(t);
  }, [nav, payRide]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <Animated.View style={[styles.spinner, { transform: [{ rotate }] }]} />
      <Text style={[typography.label, styles.text]}>Confirming payment…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.greenDark, alignItems: 'center', justifyContent: 'center', gap: 22 },
  spinner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 5,
    borderColor: 'rgba(199,240,63,0.25)',
    borderTopColor: colors.lime,
  },
  text: { color: colors.paper },
});

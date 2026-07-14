import { Image, StyleSheet } from 'react-native';

const LOGO_W = 404;
const LOGO_H = 142;
const RATIO = LOGO_W / LOGO_H;

export function Logo({ size = 40 }: { size?: number }) {
  const height = size;
  const width = height * RATIO;
  return (
    <Image
      source={require('../assets/logo.png')}
      style={[styles.logo, { width, height }]}
      resizeMode="contain"
      accessibilityLabel="My T-Fare"
    />
  );
}

const styles = StyleSheet.create({
  logo: { resizeMode: 'contain' },
});

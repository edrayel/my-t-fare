import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  State,
  type PanGestureHandlerEventPayload,
  type GestureEvent,
  type HandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import { colors, radius } from '../theme/tokens';

const { width } = Dimensions.get('window');
const TRACK = width - 56;
const KNOB = 64;
const MAX = TRACK - KNOB;
const THRESHOLD = 0.82;

export function SlideToPay({ onPay, disabled }: { onPay: () => void; disabled?: boolean }) {
  const x = useSharedValue(0);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: x.value >= MAX * THRESHOLD ? colors.green : 'rgba(8,15,11,0.08)',
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: KNOB + x.value,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  }));

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: 1 - x.value / MAX,
  }));

  const onGesture = (e: GestureEvent<PanGestureHandlerEventPayload>) => {
    x.value = Math.min(Math.max(e.nativeEvent.translationX, 0), MAX);
  };

  const onState = (e: HandlerStateChangeEvent<PanGestureHandlerEventPayload>) => {
    if (e.nativeEvent.state !== State.END) return;
    if (x.value >= MAX * THRESHOLD) {
      runOnJS(onPay)();
    }
    x.value = withSpring(0);
  };

  return (
    <View style={styles.wrap}>
      <PanGestureHandler
        enabled={!disabled}
        onGestureEvent={onGesture}
        onHandlerStateChange={onState}
      >
        <Animated.View style={[styles.track, trackStyle]}>
          <Animated.View style={[styles.fill, fillStyle]} />
          <Animated.Text style={[styles.label, labelStyle]}>Slide to pay</Animated.Text>
          <Animated.View style={[styles.knob, knobStyle]}>
            <View style={styles.knobInner}>
              <Text style={styles.knobArrow}>›</Text>
            </View>
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 0, marginTop: 8 },
  track: {
    position: 'relative',
    height: KNOB,
    borderRadius: radius.full,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  label: {
    position: 'absolute',
    right: 28,
    color: 'rgba(8,15,11,0.55)',
    fontSize: 15,
    fontFamily: 'Manrope',
    fontWeight: '700',
  },
  knob: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: KNOB,
    height: KNOB,
    padding: 6,
  },
  knobInner: {
    flex: 1,
    borderRadius: radius.full,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  knobArrow: { color: colors.paper, fontSize: 30, fontWeight: '700', lineHeight: 30 },
});

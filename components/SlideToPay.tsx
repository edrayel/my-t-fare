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
import { formatKobo } from '../lib/money';

const { width } = Dimensions.get('window');
const TRACK = width - 56;
const KNOB = 50;
const TRACK_H = 60;
const MAX = TRACK - KNOB;
const THRESHOLD = 0.82;

export function SlideToPay({
  onPay,
  disabled,
  amount,
}: {
  onPay: () => void;
  disabled?: boolean;
  amount?: number;
}) {
  const x = useSharedValue(0);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: colors.green,
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

  const label = amount != null ? `Slide to pay ${formatKobo(amount)} »` : 'Slide to pay »';

  return (
    <View style={styles.wrap}>
      <PanGestureHandler
        enabled={!disabled}
        onGestureEvent={onGesture}
        onHandlerStateChange={onState}
      >
        <Animated.View style={[styles.track, trackStyle]}>
          <Animated.View style={[styles.fill, fillStyle]} />
          <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>
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
  wrap: { marginTop: 8 },
  track: {
    position: 'relative',
    height: TRACK_H,
    borderRadius: radius.full,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(199,240,63,0.25)',
  },
  label: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14.5,
    fontFamily: 'Sora',
    fontWeight: '700',
  },
  knob: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: KNOB,
    height: TRACK_H,
    padding: 5,
  },
  knobInner: {
    flex: 1,
    borderRadius: radius.full,
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  knobArrow: { color: '#0a2117', fontSize: 26, fontWeight: '700', lineHeight: 26 },
});

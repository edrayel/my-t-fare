import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import {
  PanGestureHandler,
  State,
  type PanGestureHandlerEventPayload,
  type GestureEvent,
  type HandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import { colors } from '../theme/tokens';
import { formatKobo } from '../lib/money';

const { width } = Dimensions.get('window');
const TRACK = width - 56;
const KNOB = 50;
const TRACK_H = 60;
const RIGHT_PAD = 10;
const MAX = TRACK - KNOB - RIGHT_PAD;
const THRESHOLD = 0.82;

const TRACK_R = 18;
const INNER_R = 14;
const ARROW = 'M5 12h12M12 6l6 6-6 6';

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
  }));

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
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
          <Animated.Text style={styles.label}>{label}</Animated.Text>
          <Animated.View style={[styles.knob, knobStyle]}>
            <View style={styles.knobInner}>
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#0a2117" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
                <Path d={ARROW} />
              </Svg>
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
    borderRadius: TRACK_R,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  fill: {
    position: 'absolute',
    left: 5,
    top: 5,
    bottom: 5,
    backgroundColor: 'rgba(199,240,63,0.25)',
    borderRadius: INNER_R,
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
  },
  knobInner: {
    position: 'absolute',
    top: 5,
    left: 0,
    right: 0,
    height: 50,
    borderRadius: INNER_R,
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
});

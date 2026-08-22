import { useId, useState } from 'react';
import { View, StyleSheet, type LayoutChangeEvent } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect } from 'react-native-svg';

function angleToCoords(angle: number) {
  const rad = (angle * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  return {
    x1: `${(0.5 - dx * 0.5) * 100}%`,
    y1: `${(0.5 - dy * 0.5) * 100}%`,
    x2: `${(0.5 + dx * 0.5) * 100}%`,
    y2: `${(0.5 + dy * 0.5) * 100}%`,
  };
}

export function Gradient({
  colors,
  angle = 160,
  locations,
  style,
  radius = 0,
}: {
  colors: string[];
  angle?: number;
  locations?: number[];
  style?: object;
  radius?: number;
}) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const id = useId().replace(/:/g, '');
  const coords = angleToCoords(angle);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.w || height !== size.h) setSize({ w: width, h: height });
  };

  return (
    <View
      onLayout={onLayout}
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { borderRadius: radius, overflow: 'hidden' }, style]}
    >
      {size.w > 0 && size.h > 0 && (
        <Svg width={size.w} height={size.h}>
          <Defs>
            <SvgLinearGradient id={id} x1={coords.x1} y1={coords.y1} x2={coords.x2} y2={coords.y2}>
              {colors.map((c, i) => (
                <Stop
                  key={i}
                  offset={`${((locations?.[i] ?? (colors.length === 1 ? 0 : i / (colors.length - 1))) * 100).toFixed(0)}%`}
                  stopColor={c}
                />
              ))}
            </SvgLinearGradient>
          </Defs>
          <Rect x="0" y="0" width={size.w} height={size.h} fill={`url(#${id})`} />
        </Svg>
      )}
    </View>
  );
}

import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect } from 'react-native-svg';
import { StyleSheet } from 'react-native';

function angleToCoords(angle: number) {
  const rad = (angle * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  return {
    x1: `${(0.5 - (dx * 0.5)) * 100}%`,
    y1: `${(0.5 - (dy * 0.5)) * 100}%`,
    x2: `${(0.5 + (dx * 0.5)) * 100}%`,
    y2: `${(0.5 + (dy * 0.5)) * 100}%`,
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
  const coords = angleToCoords(angle);
  return (
    <Svg
      style={[StyleSheet.absoluteFill, { borderRadius: radius, overflow: 'hidden' }, style]}
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <Defs>
        <SvgLinearGradient id="g" x1={coords.x1} y1={coords.y1} x2={coords.x2} y2={coords.y2}>
          {colors.map((c, i) => (
            <Stop
              key={i}
              offset={`${((locations?.[i] ?? (colors.length === 1 ? 0 : i / (colors.length - 1))) * 100).toFixed(0)}%`}
              stopColor={c}
            />
          ))}
        </SvgLinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100" height="100" fill="url(#g)" />
    </Svg>
  );
}

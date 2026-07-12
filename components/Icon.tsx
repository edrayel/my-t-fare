import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme/tokens';
import { P, INLINE, type IconName } from '../theme/paths';

export type IconProps = {
  name: IconName | keyof typeof INLINE;
  size?: number;
  stroke?: string;
  sw?: number;
  fill?: string;
};

/** Single-path line icon. Mirrors design/rn_handoff/shared_components.md §1. */
export function Icon({ name, size = 22, stroke = colors.green, sw = 1.8, fill = 'none' }: IconProps) {
  const d = (P as Record<string, string>)[name] ?? (INLINE as Record<string, string>)[name];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <Path d={d} />
    </Svg>
  );
}

export default Icon;

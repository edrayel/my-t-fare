/**
 * My T-Fare — Design Tokens (RN theme)
 * Source of truth: design/rn_handoff/design_tokens.md
 * Paste-friendly, auditable. Import into every StyleSheet.
 */
import { TextStyle } from 'react-native';

export const colors = {
  ink: '#0B1512',
  paper: '#F4F3EE',
  green: '#0C6B4F',
  greenDeep: '#0a4030',
  greenDark: '#0c1611',
  brand: '#00AC57',
  lime: '#C7F03F',
  sub: '#6b7a72',
  mut: '#8a978f',
  line: '#ECEAE3',
  card: '#ffffff',

  // status
  statusPaid: '#0C6B4F',
  statusPending: '#b07d12',
  statusPendingBg: '#FBF3DC',
  danger: '#b4413a',

  // frequent near-white / grey tints used inline in the design
  tint: '#EEF3EF',
  tintWarm: '#FBF3DC',
  tintBlue: '#E7EFF5',
  tintCard: '#F1F8F4',
  rowDivider: '#F1EFE8',
  navIdle: '#aab6ae',
  fieldEdge: '#E4E1D8',
  inkSoft: '#2d3c34',
  subSoft: '#75857c',
} as const;

export const SORA = 'Sora';
export const MANROPE = 'Manrope';

export const radius = {
  tile: 12,
  icon: 13,
  pill: 999,
  full: 999,
  card: 18,
  cardLg: 20,
  sheet: 30,
  hero: 20,
  heroLg: 26,
} as const;

export const shadows = {
  card: {
    shadowColor: '#0C6B4F',
    shadowOpacity: 0.28,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  sheet: {
    shadowColor: '#000000',
    shadowOpacity: 0.4,
    shadowRadius: 50,
    shadowOffset: { width: 0, height: 20 },
    elevation: 12,
  },
  qr: {
    shadowColor: '#000000',
    shadowOpacity: 0.4,
    shadowRadius: 50,
    shadowOffset: { width: 0, height: 20 },
    elevation: 12,
  },
} as const;

export const space = {
  gutter: 18,
  gutterLg: 22,
  gap: 10,
  gapLg: 14,
  sectionTop: 22,
  sectionGap: 10,
} as const;

export const typography = {
  screenTitle: {
    fontFamily: SORA,
    fontSize: 24,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: colors.ink,
    letterSpacing: -0.5,
  },
  amount: {
    fontFamily: SORA,
    fontSize: 40,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: colors.ink,
    letterSpacing: -1,
  },
  amountSm: {
    fontFamily: SORA,
    fontSize: 36,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: colors.ink,
    letterSpacing: -1,
  },
  label: {
    fontFamily: SORA,
    fontSize: 15,
    fontWeight: '600' as TextStyle['fontWeight'],
    color: colors.ink,
  },
  body: {
    fontFamily: MANROPE,
    fontSize: 13.5,
    color: colors.sub,
  },
} as const;

export const theme = {
  colors,
  radius,
  shadows,
  space,
  fonts: { display: SORA, body: MANROPE },
  text: typography,
};

export default theme;

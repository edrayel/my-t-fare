/**
 * My T-Fare — Icon path table (RN)
 * Source of truth: design/rn_handoff/shared_components.md §1 (`App.jsx` `P`).
 * Each entry is an SVG path `d` for react-native-svg <Path d={...} />.
 * See components/Icon.tsx for the renderer.
 */
export const P = {
  qr: 'M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10',
  route: 'M9 20l-5-2V4l5 2 6-2 5 2v14l-5-2-6 2zM9 6v14M15 4v14',
  book: 'M5 17h14M6 17l1.5-5h9L18 17M7 12V8h10v4M8 20v-3M16 20v-3',
  live: 'M12 21c-4-4-7-7.5-7-11a7 7 0 0 1 14 0c0 3.5-3 7-7 11zM12 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2',
  bus: 'M4 5h16v11H4zM4 11h16M7 20v-2M17 20v-2M8 16v.01M16 16v.01',
  taxi: 'M5 17h14M6 17l1.5-5h9L18 17M9 12V9h6v3M8 20v-3M16 20v-3M9 6h6',
  keke: 'M6 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4M18 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4M6 16V6h6l2 4h4l-2 6M3 8h4',
  shuttle: 'M4 6h16v9H4zM4 11h16M7 19v-2M17 19v-2M8 6V4h8v2',
  brt: 'M3 16h18M5 16V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v9M5 11h14M7 20v-2M17 20v-2',
  boat: 'M3 14h18l-2 5H5l-2-5zM5 14l1-6h12l1 6M12 2v6',
  bike: 'M6 18a3 3 0 1 0 0-6 3 3 0 1 0 0 6M18 18a3 3 0 1 0 0-6 3 3 0 1 0 0 6M6 15l4-6h4l-2 6M10 9l2-3h3',
  gift: 'M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7',
  star: 'M12 2l2.6 6.3L21 9l-4.8 4.3L17.6 20 12 16.5 6.4 20l1.4-6.7L3 9l6.4-0.7z',
  tag: 'M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8zM7.5 7.5h.01',
  chart: 'M3 3v18h18M7 14l3-3 3 3 5-6',
  pin: 'M12 21c-4-4-7-7.5-7-11a7 7 0 0 1 14 0c0 3.5-3 7-7 11Z',
  back: 'M15 6l-6 6 6 6',
  chevron: 'M9 6l6 6-6 6',
  caret: 'M6 9l6 6 6-6',
  check: 'M5 13l4 4L19 7',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  up: 'M12 19V5 M6 11l6-6 6 6',
  finger: 'M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4M14 13.12c0 2.38 0 6.38-1 8.88M17.29 21.02c.12-.6.43-2.3.5-3.02M2 12a10 10 0 0 1 18-6M2 16h.01M21.8 16c.2-2 .131-5.354 0-6M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2M8.65 22c.21-.66.45-1.32.57-2M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2',
  bell: 'M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
} as const;

/** Ad-hoc inline paths (not in `P`) used directly in the design. */
export const INLINE = {
  homeTab: 'M3 10.5L12 3l9 7.5M5 9.5V21h14V9.5',
  activityTab: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  moneyTab: 'M3 17l5-5 4 4 8-9M21 7h-4M21 7v4',
  profileTab: 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7',
  cardLine: 'M2 5h20v14H2zM2 10h20',
  cardWifi: 'M5 12a7 7 0 0 1 0 0M8 9a4 4 0 0 1 0 6M11 6a8 8 0 0 1 0 12',
  feedLike: 'M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z',
  feedComment: 'M21 11.5a8.4 8.4 0 0 1-11.9 7.6L3 21l1.9-6.1A8.4 8.4 0 1 1 21 11.5z',
  feedShare: 'M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13',
  feedSave: 'M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z',
  giftSend: 'M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z',
  giftRequest: 'M2 22 13 11M2 22l7-20 4 9 9 4-20 7z',
  orderCard: 'M12 8v4l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  autoDetect: 'M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0M12 1v3M12 20v3M23 12h-3M4 12H1',
} as const;

export type IconName = keyof typeof P;

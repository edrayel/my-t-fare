# My T-Fare (React Native)

Cashless transport payment & mobility app for Nigeria — *Tap. Ride. Go.*

This is the **React Native** implementation of the My T-Fare passenger app
(Commuter experience). It is built from the design handoff in
`../design/rn_handoff/` (read `INDEX.md` first).

## Stack

- **Expo SDK 57** · React Native 0.86 · TypeScript
- Navigation: `@react-navigation` (bottom tabs + stack)
- Gestures/animation: `react-native-gesture-handler` + `react-native-reanimated`
- Icons: `react-native-svg` (exact `theme/paths.ts`)
- Camera/QR: `expo-camera` + `expo-barcode-scanner`, `react-native-qrcode-svg`
- Biometrics: `expo-local-authentication`
- State: `zustand`; server state: `@tanstack/react-query`

## Design tokens

All colors, typography, spacing, radius, and shadows live in `theme/tokens.ts`
(source: `design/rn_handoff/design_tokens.md`). Icon paths are in
`theme/paths.ts`. Import these everywhere — do **not** hardcode hex values.

## Getting started

```bash
npm install
npm run android   # or: npm run ios / npm run web
```

## Build order

See `design/rn_handoff/rn_build_guide.md` §12 for the suggested sequence:
theme → shared components → auth → tabs/FAB → home → scan → activity/card/profile
→ feed → gift flow → API wiring.

> These designs are references. Money, fares, and auth are always resolved
> **server-side** (see `../design/rn_handoff/references/API_SPEC.md`).

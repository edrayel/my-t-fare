import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

/** Root stack — every route is reachable by name from anywhere. */
export type RootStackParamList = {
  '(tabs)': undefined;
  scan: undefined;
  processing: undefined;
  success: undefined;
  receipt: undefined;
  giftPick: undefined;
  giftAmount: undefined;
  giftConfirm: undefined;
  giftSuccess: undefined;
  requestSuccess: undefined;
  requestQR: undefined;
  onboarding: undefined;
  role: undefined;
  signin: undefined;
  signup: undefined;
};

/** Tabs + the modal routes shown above them (typed so tab screens can navigate). */
export type TabParamList = {
  home: undefined;
  trips: undefined;
  card: undefined;
  profile: undefined;
  feed: undefined;
  scan: undefined;
  processing: undefined;
  success: undefined;
  receipt: undefined;
  giftPick: undefined;
  giftAmount: undefined;
  giftConfirm: undefined;
  giftSuccess: undefined;
  requestSuccess: undefined;
  requestQR: undefined;
};

export type StackProps<K extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, K>;
export type TabProps<K extends keyof TabParamList> = BottomTabScreenProps<TabParamList, K>;

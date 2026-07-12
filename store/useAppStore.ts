/**
 * My T-Fare — global app store (replaces App.jsx `ctx`).
 * Single zustand store for wallet, identity, campus, trips, feed, UI.
 *
 * Money is **integer kobo** (₦1 = 100 kobo). Demo seed keeps the
 * prototype's visible values (balance ₦2,450 · points 240 · UNILAG fare ₦150).
 */
import { create } from 'zustand';
import { kobo } from '../lib/money';

export type Role =
  | 'Commuter'
  | 'Driver'
  | 'Fleet Owner'
  | 'Transport Company'
  | 'Institution'
  | 'Government';

export type CampusKey = 'UNILAG' | 'LASU' | 'UNIPORT' | 'UI' | 'UNIBEN';

export type TripType = 'ride' | 'topup' | 'gift';

export interface Campus {
  key: CampusKey;
  label: string;
  city: string;
  driver: string;
  vehicle: string;
  plate: string;
  routes: [string, string, number][]; // [origin, destination, fareKobo]
}

export interface RoleDef {
  key: Role;
  icon: keyof typeof import('../theme/paths').P;
  desc: string;
}

export interface Recipient {
  name: string;
  phone: string;
  initial: string;
}

export interface FeedItem {
  id: string;
  category: string;
  live: boolean;
  time: string;
  stat: string;
  statSub: string;
  title: string;
  body: string;
  source: string;
  followed: boolean;
}

export interface Trip {
  id: string;
  type: TripType;
  title: string;
  sub: string;
  amount: number; // kobo, negative = debit
  time: string;
  day: 'today' | 'earlier';
}

export interface Slide {
  icon: keyof typeof import('../theme/paths').P;
  title: string;
  body: string;
}

export interface PayMethod {
  key: string;
  label: string;
  badge: string;
  hint: string;
}

export const CAMPUS: Record<CampusKey, Campus> = {
  UNILAG: {
    key: 'UNILAG',
    label: 'UNILAG',
    city: 'Lagos',
    driver: 'Musa Abdullahi',
    vehicle: 'Shuttle B2',
    plate: 'LAG-227-XA',
    routes: [
      ['Main Gate', 'Akoka', kobo(150)],
      ['Akoka', 'New Hall', kobo(150)],
      ['Main Gate', 'Senate', kobo(150)],
      ['Faculty of Sci.', 'Hostel', kobo(200)],
    ],
  },
  LASU: {
    key: 'LASU',
    label: 'LASU',
    city: 'Lagos',
    driver: 'Bola Adeyemi',
    vehicle: 'Shuttle L4',
    plate: 'LAG-884-KJ',
    routes: [
      ['Gate', 'Main Lib.', kobo(140)],
      ['Main Lib.', 'Hostel', kobo(140)],
      ['Gate', 'Lecture', kobo(140)],
      ['Faculty', 'Gate', kobo(180)],
    ],
  },
  UNIPORT: {
    key: 'UNIPORT',
    label: 'UNIPORT',
    city: 'Port Harcourt',
    driver: 'Emeka Wodu',
    vehicle: 'Campus Bus 7',
    plate: 'RIV-330-AB',
    routes: [
      ['Main Gate', 'Students Hall', kobo(160)],
      ['Students Hall', 'Hostel', kobo(160)],
      ['Main Gate', 'Faculty', kobo(170)],
      ['Gate', 'Lecture', kobo(160)],
    ],
  },
  UI: {
    key: 'UI',
    label: 'UI Ibadan',
    city: 'Ibadan',
    driver: 'Yusuf Alabi',
    vehicle: 'Shuttle UI-2',
    plate: 'OYO-115-CD',
    routes: [
      ['Main Gate', 'Kenneth Dike', kobo(130)],
      ['Kenneth Dike', 'Hostel', kobo(130)],
      ['Main Gate', 'Faculty', kobo(130)],
      ['Gate', 'Lecture', kobo(140)],
    ],
  },
  UNIBEN: {
    key: 'UNIBEN',
    label: 'UNIBEN',
    city: 'Benin City',
    driver: 'Efe Osaro',
    vehicle: 'Shuttle B9',
    plate: 'EDO-208-EF',
    routes: [
      ['Main Gate', 'Ekosodin', kobo(120)],
      ['Ekosodin', 'Hostel', kobo(120)],
      ['Main Gate', 'Faculty', kobo(130)],
      ['Gate', 'Lecture', kobo(120)],
    ],
  },
};

export const ROLES: RoleDef[] = [
  { key: 'Commuter', icon: 'shuttle', desc: 'Ride cashless across campus & city' },
  { key: 'Driver', icon: 'taxi', desc: 'Get paid instantly, track earnings' },
  { key: 'Fleet Owner', icon: 'bus', desc: 'Manage your vehicles & drivers' },
  { key: 'Transport Company', icon: 'brt', desc: 'Run operations at scale' },
  { key: 'Institution', icon: 'tag', desc: 'Issue cards to your students' },
  { key: 'Government', icon: 'live', desc: 'See mobility data for your city' },
];

export const SLIDES: Slide[] = [
  {
    icon: 'qr',
    title: 'Your fare, one tap away',
    body: 'Scan, tap or swipe to pay any driver straight from your phone. No cash, no change, no wahala.',
  },
  {
    icon: 'shuttle',
    title: 'Starts on campus. Built for the city.',
    body: 'Live on shuttles today — rolling out to every bus, keke and cab across Nigeria.',
  },
  {
    icon: 'tag',
    title: 'Top up once, ride everywhere',
    body: 'Pay from your wallet, tap your card or use NFC. Inclusive by design — no one left behind.',
  },
];

export const METHODS: PayMethod[] = [
  { key: 'opay', label: 'OPay', badge: 'O', hint: 'Instant' },
  { key: 'palmpay', label: 'PalmPay', badge: 'P', hint: 'Instant' },
  { key: 'momo', label: 'MTN MoMo', badge: 'M', hint: 'USSD' },
  { key: 'bank', label: 'Bank transfer', badge: 'B', hint: 'Pay via bank' },
];

export const RECIPIENTS: Recipient[] = [
  { name: 'Olufemi Akintayo', phone: '0802 143 8824', initial: 'O' },
  { name: 'Chidinma Eze', phone: '0803 552 1190', initial: 'C' },
  { name: 'Tunde Bakare', phone: '0701 884 2235', initial: 'T' },
  { name: 'Amaka Obi', phone: '0814 220 9981', initial: 'A' },
];

export const FEED: FeedItem[] = [
  {
    id: 'f1',
    category: 'Markets',
    live: true,
    time: '2m',
    stat: '₦1,540/$',
    statSub: 'per dollar · now',
    title: 'Naira steady against the dollar',
    body: 'The naira holds at ₦1,540 to the dollar in early trading as CBN holds its line on liquidity.',
    source: 'CBN · LIVE',
    followed: false,
  },
  {
    id: 'f2',
    category: 'Invest',
    live: false,
    time: '1h',
    stat: '₦5,000',
    statSub: 'min. treasury bill',
    title: 'T-bills open for subscription',
    body: 'The latest NTB auction is live — open from ₦5,000 for students building a habit.',
    source: 'DMO',
    followed: false,
  },
  {
    id: 'f3',
    category: 'Deal',
    live: false,
    time: '3h',
    stat: '8% back',
    statSub: 'on transport',
    title: 'Get 8% back on every campus ride',
    body: 'Tap to pay with My T-Fare and earn cashback on shuttle and keke trips this week.',
    source: 'My T-Fare',
    followed: false,
  },
  {
    id: 'f4',
    category: 'Markets',
    live: false,
    time: '5h',
    stat: '22% p.a.',
    statSub: 'fixed income yield',
    title: 'Bond yields ease to 22%',
    body: 'Yields on the 10-year FGN bond slipped as inflation expectations cooled month-on-month.',
    source: 'FMDQ',
    followed: false,
  },
  {
    id: 'f5',
    category: 'Seminar',
    live: false,
    time: 'Yesterday',
    stat: 'Free',
    statSub: 'this weekend',
    title: 'Fintech for students — free seminar',
    body: 'A hands-on session on wallets, APIs and staying safe with money apps. Hostel common room, Saturday.',
    source: 'My T-Fare',
    followed: false,
  },
];

const seedTrips: Trip[] = [
  { id: 't1', type: 'ride', title: 'Main Gate → Akoka', sub: 'Shuttle B2 · Musa A.', amount: -kobo(150), time: '08:12', day: 'today' },
  { id: 't2', type: 'topup', title: 'Wallet top-up', sub: 'OPay', amount: kobo(2000), time: '07:55', day: 'today' },
  { id: 't3', type: 'ride', title: 'Faculty of Sci. → Hostel', sub: 'Campus cab · Chidi O.', amount: -kobo(200), time: '18:40', day: 'earlier' },
  { id: 't4', type: 'ride', title: 'Akoka → New Hall', sub: 'Shuttle A1', amount: -kobo(150), time: '16:05', day: 'earlier' },
  { id: 't5', type: 'topup', title: 'Wallet top-up', sub: 'PalmPay', amount: kobo(5000), time: '09:10', day: 'earlier' },
  { id: 't6', type: 'ride', title: 'Main Gate → Senate', sub: 'Keke · shared', amount: -kobo(100), time: '08:30', day: 'earlier' },
];

const nextRef = () => `MTF-${Math.floor(1000 + Math.random() * 9000)}`;

export interface AppState {
  // identity / onboarding
  authed: boolean;
  role: Role;
  campus: CampusKey;
  phone: string;
  name: string;
  // wallet
  balance: number; // kobo
  points: number;
  trips: Trip[];
  // gift / request flow
  giftMode: 'send' | 'request';
  giftRecipient: Recipient | null;
  giftAmount: number; // kobo
  giftRef: string;
  requestNote: string;
  requestQrPayload: string;
  setGiftMode: (m: 'send' | 'request') => void;
  setGiftRecipient: (r: Recipient | null) => void;
  setGiftAmount: (n: number) => void;
  setRequestNote: (s: string) => void;
  setRequestQr: (p: string) => void;
  // ui
  feedLiked: Record<string, boolean>;
  feedFollowed: Record<string, boolean>;
  bioBusy: boolean;
  toast: string | null;
  lastRef: string;
  // derived helpers
  campusData: () => Campus;
  fareNow: () => number;
  routeNow: () => string;
  // actions
  setRole: (r: Role) => void;
  setCampus: (k: CampusKey) => void;
  signIn: () => void;
  signOut: () => void;
  confirmTopUp: (amountKobo: number, method: string) => void;
  payRide: () => { ref: string };
  completeGift: () => void;
  toggleFeedLike: (id: string) => void;
  toggleFeedFollow: (id: string) => void;
  toggleBio: (v: boolean) => void;
  flashToast: (m: string) => void;
  clearToast: () => void;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useAppStore = create<AppState>((set, get) => ({
  authed: false,
  role: 'Commuter',
  campus: 'UNILAG',
  phone: '803 124 9920',
  name: 'Ada Nwosu',

  balance: kobo(2450), // ₦2,450 (prototype showed 2450 ₦)
  points: 240,
  trips: seedTrips,

  giftMode: 'send',
  giftRecipient: null,
  giftAmount: 0,
  giftRef: '',
  requestNote: '',
  requestQrPayload: '',

  setGiftMode: (m) => set({ giftMode: m }),
  setGiftRecipient: (r) => set({ giftRecipient: r }),
  setGiftAmount: (n) => set({ giftAmount: n }),
  setRequestNote: (s) => set({ requestNote: s }),
  setRequestQr: (p) => set({ requestQrPayload: p }),

  feedLiked: {},
  feedFollowed: {},
  bioBusy: false,
  toast: null,
  lastRef: '',

  campusData: () => CAMPUS[get().campus],
  fareNow: () => CAMPUS[get().campus].routes[0][2],
  routeNow: () => {
    const [o, d] = CAMPUS[get().campus].routes[0];
    return `${o} → ${d}`;
  },

  setRole: (r) => set({ role: r }),
  setCampus: (k) => {
    set({ campus: k });
    get().flashToast(`Fares updated · ${CAMPUS[k].label}`);
  },

  signIn: () => set({ authed: true }),

  signOut: () => set({ authed: false }),

  setTopupAmount: (n: number) => set({ balance: n }),

  confirmTopUp: (amountKobo: number, method: string) => {
    set((s) => ({
      balance: s.balance + amountKobo,
      trips: [
        {
          id: `u-${Date.now()}`,
          type: 'topup',
          title: 'Wallet top-up',
          sub: method,
          amount: amountKobo,
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          day: 'today',
        },
        ...s.trips,
      ],
    }));
    get().flashToast('Wallet topped up');
  },

  payRide: () => {
    const ref = nextRef();
    const fare = get().fareNow();
    set((s) => ({
      balance: s.balance - fare,
      points: s.points + 15,
      lastRef: ref,
      trips: [
        {
          id: `r-${Date.now()}`,
          type: 'ride',
          title: get().routeNow(),
          sub: `${get().campusData().vehicle} · ${get().campusData().driver.split(' ')[0]}`,
          amount: -fare,
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          day: 'today',
        },
        ...s.trips,
      ],
    }));
    return { ref };
  },

  completeGift: () => {
    const ref = nextRef();
    const amt = get().giftAmount;
    set((s) => ({
      balance: s.balance - amt,
      giftRef: ref,
      trips: [
        {
          id: `g-${Date.now()}`,
          type: 'gift',
          title: `Gift to ${s.giftRecipient?.name ?? 'friend'}`,
          sub: s.giftRecipient?.phone ?? '',
          amount: -amt,
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          day: 'today',
        },
        ...s.trips,
      ],
    }));
  },

  toggleFeedLike: (id) =>
    set((s) => ({ feedLiked: { ...s.feedLiked, [id]: !s.feedLiked[id] } })),
  toggleFeedFollow: (id) =>
    set((s) => ({ feedFollowed: { ...s.feedFollowed, [id]: !s.feedFollowed[id] } })),

  toggleBio: (v) => set({ bioBusy: v }),

  flashToast: (m) => {
    set({ toast: m });
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => set({ toast: null }), 2500);
  },
  clearToast: () => set({ toast: null }),
}));

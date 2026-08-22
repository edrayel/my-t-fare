/**
 * Networking wrappers for the My T-Fare backend (references/API_SPEC.md).
 *
 * The prototype resolved money/fares/auth **in-memory**. These are the real
 * call sites: today they simulate latency; later, swap the bodies for `mtfFetch`.
 * Every money-moving POST must carry an `Idempotency-Key`.
 */
import { kobo } from './money';

const BASE = 'https://api.mytfare.com/v1';

let TOKEN = '';
export const setToken = (t: string) => {
  TOKEN = t;
};

export async function mtfFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`MyT-Fare API ${res.status}`);
  return (await res.json()) as T;
}

export const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export type DriverQuote = {
  driver: string;
  vehicle: string;
  plate: string;
  rating: number;
  origin: string;
  destination: string;
  fareKobo: number;
};

/** POST /rides/resolve-qr — prototype fakes a 1.8s detect. */
export async function resolveQr(_payload: string): Promise<DriverQuote> {
  await delay(1800);
  return {
    driver: 'Musa Abdullahi',
    vehicle: 'Shuttle B2',
    plate: 'LAG-227-XA',
    rating: 4.9,
    origin: 'Main Gate',
    destination: 'Akoka',
    fareKobo: kobo(150),
  };
}

/** POST /transfers/request/qr — payload for the request-a-friend QR. */
export async function requestQr(amountKobo?: number): Promise<{ qrPayload: string; shareUrl: string }> {
  await delay(400);
  return {
    qrPayload: JSON.stringify({ t: 'req', a: amountKobo ?? null, ref: 'MTF-REQ' }),
    shareUrl: 'https://mytfare.com/r/',
  };
}

/** GET /campuses/resolve — fake ~1.3s auto-detect. */
export async function resolveCampus(_lat?: number, _lng?: number): Promise<{ label: string; city: string }> {
  await delay(1300);
  return { label: 'UNILAG', city: 'Lagos' };
}

export type VehicleEta = {
  userDistanceM: number;
  userEtaMin: number;
  driverDistanceM: number;
  driverEtaMin: number;
  togetherEtaMin: number;
};

/** GET /vehicles/{id}/eta — stub for Campus Map 3-row panel. */
export async function getVehicleEta(): Promise<VehicleEta> {
  await delay(600);
  return { userDistanceM: 180, userEtaMin: 3, driverDistanceM: 320, driverEtaMin: 4, togetherEtaMin: 4 };
}

export type PaymentCode = { id: string; amount: number; routeId: string; qrPayload: string; status: 'waiting' | 'paid' };

export async function createPaymentCode(amountKobo: number, routeId: string): Promise<PaymentCode> {
  await delay(700);
  return { id: `pc-${Date.now()}`, amount: amountKobo, routeId, qrPayload: JSON.stringify({ t: 'pay', a: amountKobo, r: routeId, id: Date.now() }), status: 'waiting' };
}

export async function getDriverLocation(): Promise<{ label: string; city: string }> {
  await delay(900);
  return { label: 'Near Main Gate', city: 'Lagos' };
}

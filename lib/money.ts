/**
 * Money helpers. All persisted amounts are **integer kobo** (₦1 = 100 kobo).
 * The prototype displayed naira units loosely; we keep production parity here.
 */
export const kobo = (naira: number): number => Math.round(naira * 100);

const nf = new Intl.NumberFormat('en-NG', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Format a kobo integer as ₦1,234.00 (always 2dp, thousands separators). */
export function formatKobo(amount: number): string {
  const naira = amount / 100;
  const sign = amount < 0 ? '-' : '';
  return `${sign}₦${nf.format(Math.abs(naira))}`;
}

/** Format a raw naira number as ₦1,234.00. */
export function fmtNaira(naira: number): string {
  return `₦${nf.format(naira)}`;
}

/** Format a kobo integer with an explicit + sign when positive (for credits). */
export function formatSigned(amount: number): string {
  const base = formatKobo(amount);
  if (amount > 0) return `+${base.replace('₦', '₦')}`;
  return base;
}

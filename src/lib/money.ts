export interface MoneyFormatOptions {
  currencyCode?: string;
  locale?: string;
}

export const DEFAULT_CURRENCY = "TWD";
export const DEFAULT_LOCALE = "zh-TW";
/** App-wide money precision; ignore CLDR (TWD is 0) so splits/inputs keep cents. */
export const MONEY_DECIMAL_PLACES = 2;

/** Amounts travel through the form as strings (`"1234.5"`), so normalise before comparing. */
export const toCents = (value: number | string | null | undefined) =>
  Math.round((Number(value) || 0) * 100);

export const fromCents = (cents: number) => cents / 100;

export const isTwoDecimalPlaces = (value: number | string) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return false;

  const scaled = n * 10 ** MONEY_DECIMAL_PLACES;
  const nearest = Math.round(scaled);
  // Scale with |n|: cents/100 is not binary-exact, and 1e-9 is tighter than 1 ULP at ~1e7.
  const tolerance = Math.max(1e-8, Number.EPSILON * Math.abs(scaled) * 8);

  return Math.abs(scaled - nearest) < tolerance;
};

interface SelectableAmount {
  amount: number | string;
  isSelected?: boolean;
}

export const sumSelectedCents = (
  rows: readonly SelectableAmount[] | undefined,
) =>
  (rows ?? []).reduce(
    (total, row) => (row?.isSelected ? total + toCents(row.amount) : total),
    0,
  );

export const formatMoneyFromCents = (
  cents: number,
  {
    currencyCode = DEFAULT_CURRENCY,
    locale = DEFAULT_LOCALE,
  }: MoneyFormatOptions = {},
) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: MONEY_DECIMAL_PLACES,
  }).format(fromCents(cents));

export const formatSignedMoney = (cents: number, currency: string): string => {
  const absolute = formatMoneyFromCents(Math.abs(cents), {
    currencyCode: currency,
  });

  if (cents > 0) {
    return `+ ${absolute}`;
  }

  if (cents < 0) {
    return `- ${absolute}`;
  }

  return absolute;
};

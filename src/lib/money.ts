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

/** 「10.999」這種輸入會被靜默進位，所以在驗證階段就擋掉。 */
export const isTwoDecimalPlaces = (value: number | string) => {
  const n = Number(value);
  return Number.isFinite(n) && Math.abs(n * 100 - Math.round(n * 100)) < 1e-9;
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

export const formatMoney = (
  value: number,
  {
    currencyCode = DEFAULT_CURRENCY,
    locale = DEFAULT_LOCALE,
  }: MoneyFormatOptions = {},
) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(value);

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

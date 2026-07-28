import { NextResponse } from "next/server";

export type CurrencyItem = {
  code: string;
  symbol: string;
};

export async function GET() {
  const res = await fetch("https://api.frankfurter.dev/v2/currencies", {
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch currencies" },
      { status: 502 },
    );
  }

  const data: Record<string, string>[] = await res.json();

  const currencyList: CurrencyItem[] = data.map((item) => ({
    code: item.iso_code,
    symbol: item.symbol,
  }));

  return NextResponse.json(currencyList);
}

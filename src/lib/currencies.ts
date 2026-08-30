export type CurrencyItem = {
  code: string;
  symbol: string;
};

export async function getCurrencies(): Promise<CurrencyItem[]> {
  try {
    // Cache the currencies for 24 hours
    const res = await fetch("https://api.frankfurter.dev/v2/currencies", {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch currencies");
    }

    const data: Record<string, string>[] = await res.json();

    return data.map((item) => ({
      code: item.iso_code,
      symbol: item.symbol,
    }));
  } catch (error) {
    console.error("Error fetching currencies:", error);
    return [];
  }
}

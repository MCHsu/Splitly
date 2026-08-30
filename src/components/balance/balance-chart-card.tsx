import { SectionContainer } from "@/components/shared/section-container";
import { BalanceChartRow } from "@/components/balance/balance-chart-row";
import { formatSignedMoney } from "@/lib/money";

export type BalanceChartDatum = {
  memberId: string;
  name: string;
  balanceInCents: number;
};

interface BalanceChartCardProps {
  data: BalanceChartDatum[];
  currency?: string;
  className?: string;
}

export function BalanceChartCard({
  data,
  currency = "TWD",
  className,
}: BalanceChartCardProps) {
  const allSettled =
    data.length === 0 || data.every((d) => d.balanceInCents === 0);

  const maxAbs = Math.max(0, ...data.map((d) => Math.abs(d.balanceInCents)));

  return (
    <div className="w-full">
      <p className="mb-3 text-sm text-muted-foreground">Member balances</p>

      <SectionContainer>
        {allSettled ? (
          <p className="text-muted-foreground">No member balances.</p>
        ) : (
          <ul className="relative flex flex-col gap-1.5">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border"
            />
            {data.map((entry) => {
              const widthPercent =
                maxAbs === 0
                  ? 0
                  : (Math.abs(entry.balanceInCents) / maxAbs) * 100;
              const signedAmount = formatSignedMoney(
                entry.balanceInCents,
                currency,
              );

              return (
                <li
                  key={entry.memberId}
                  aria-label={`${entry.name}: ${signedAmount}`}
                  className="grid h-10 grid-cols-2 items-center"
                >
                  <BalanceChartRow
                    name={entry.name}
                    balanceInCents={entry.balanceInCents}
                    signedAmount={signedAmount}
                    widthPercent={widthPercent}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </SectionContainer>
    </div>
  );
}

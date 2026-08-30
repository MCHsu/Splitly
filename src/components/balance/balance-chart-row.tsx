import { UserAvatar } from "@/components/shared/user-avatar";
import { cn } from "@/lib/utils";

interface BalanceChartRowProps {
  name: string;
  balanceInCents: number;
  signedAmount: string;
  widthPercent: number;
}

export function BalanceChartRow({
  name,
  balanceInCents,
  signedAmount,
  widthPercent,
}: BalanceChartRowProps) {
  const isNegative = balanceInCents < 0;
  const isPositive = balanceInCents > 0;

  const member = (
    <div
      className={cn(
        "flex min-w-0 items-center gap-3",
        isNegative ? "pl-3" : "justify-end pr-3",
      )}
    >
      <UserAvatar name={name} size="md" />
      <span
        className={cn(
          "truncate text-sm font-medium sm:text-base",
          !isNegative && "order-first",
        )}
      >
        {name}
      </span>
    </div>
  );

  const bar = (
    <div
      className={cn(
        "flex h-full min-w-0 items-stretch",
        isNegative && "justify-end",
      )}
    >
      <div
        className={cn(
          "flex h-full items-center px-3 text-sm font-semibold whitespace-nowrap text-foreground tabular-nums sm:text-base",
          isNegative && "justify-end rounded-l-lg bg-destructive/30",
          isPositive && "rounded-r-lg bg-success/30",
        )}
        style={{ width: `${widthPercent}%` }}
      >
        {signedAmount}
      </div>
    </div>
  );

  return (
    <>
      {isNegative ? (
        <>
          {bar}
          {member}
        </>
      ) : (
        <>
          {member}
          {bar}
        </>
      )}
    </>
  );
}

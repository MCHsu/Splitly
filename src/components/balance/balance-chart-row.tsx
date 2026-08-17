import { UserAvatar } from "@/components/shared/user-avatar";
import { cn } from "@/lib/utils";

interface BalanceChartRowProps {
  variant: "positive" | "negative" | "zero";
  name: string;
  signedAmount: string;
  widthPercent: number;
}

export function BalanceChartRow({
  variant,
  name,
  signedAmount,
  widthPercent,
}: BalanceChartRowProps) {
  const isNegative = variant === "negative";
  const isZero = variant === "zero";

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
          "truncate text-base font-medium",
          !isNegative && "order-first",
        )}
      >
        {name}
      </span>
    </div>
  );

  const bar = isZero ? (
    <div />
  ) : (
    <div
      className={cn(
        "flex h-full min-w-0 items-stretch",
        isNegative && "justify-end",
      )}
    >
      <div
        className={cn(
          "flex h-full items-center px-2 text-sm font-bold whitespace-nowrap text-foreground md:text-base",
          isNegative
            ? "justify-end rounded-l-md bg-destructive/40"
            : "rounded-r-md bg-success/40",
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

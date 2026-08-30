import { Receipt, Wallet } from "lucide-react";

import { SectionContainer } from "@/components/shared/section-container";
import { formatMoneyFromCents, formatSignedMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

interface GroupSpendCardProps {
  totalGroupSpend: number;
  yourBalance: number;
  currency?: string;
  className?: string;
}

export function GroupSpendCard({
  totalGroupSpend,
  yourBalance,
  currency = "TWD",
  className,
}: GroupSpendCardProps) {
  return (
    <SectionContainer
      className={cn(
        "flex flex-col justify-center gap-4 lg:flex-row lg:items-stretch",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col items-center gap-3 lg:gap-4">
        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground md:gap-2">
          <Receipt className="size-4 shrink-0" />
          <p>Total Group Spend</p>
        </div>

        <p className="text-2xl font-bold tabular-nums lg:text-3xl">
          {formatMoneyFromCents(totalGroupSpend, { currencyCode: currency })}
        </p>
      </div>

      <div
        aria-hidden
        className="h-px w-full shrink-0 bg-border lg:h-auto lg:w-px lg:self-stretch"
      />

      <div className="flex min-w-0 flex-1 flex-col items-center gap-3 lg:gap-4">
        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground md:gap-2">
          <Wallet className="size-4 shrink-0" />
          <p className="text-sm font-medium text-muted-foreground">
            Your balance
          </p>
        </div>

        <p
          className={cn(
            "text-2xl font-bold tabular-nums lg:text-3xl",
            yourBalance > 0 && "text-success",
            yourBalance < 0 && "text-destructive",
          )}
        >
          {formatSignedMoney(yourBalance, currency)}
        </p>
      </div>
    </SectionContainer>
  );
}

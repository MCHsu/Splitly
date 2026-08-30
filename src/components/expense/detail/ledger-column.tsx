import { formatMoneyFromCents } from "@/lib/money";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/user-avatar";

export type LedgerEntry = {
  memberId: string;
  name: string;
  amountInCents: number;
};

interface LedgerColumnProps {
  title: string;
  entries: LedgerEntry[];
  currency: string;
  className?: string;
}

export function LedgerColumn({
  title,
  entries,
  currency,
  className,
}: LedgerColumnProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-5", className)}>
      <h3 className="text-xs font-medium text-muted-foreground uppercase">
        {title}
      </h3>

      <ul className="flex flex-col gap-6">
        {entries.map((entry) => (
          <li key={entry.memberId} className="flex items-center gap-3">
            <UserAvatar name={entry.name} size="md" showName />

            <span
              aria-hidden
              className="min-w-2 flex-1 border-b border-dotted border-muted-foreground/40"
            />
            <span className="text-base font-semibold tabular-nums md:text-lg">
              {formatMoneyFromCents(entry.amountInCents, {
                currencyCode: currency,
              })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

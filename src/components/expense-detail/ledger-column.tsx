import { formatMoneyFromCents } from "@/lib/money";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/user-avatar";

export type LedgerEntry = {
  memberId: string;
  name: string;
  amountInCents: number;
  isInactive?: boolean;
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
  const total = entries.reduce((sum, entry) => sum + entry.amountInCents, 0);

  return (
    <div className={cn("flex min-w-0 flex-col gap-3", className)}>
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {title}
      </h3>

      <ul className="flex flex-col gap-6">
        {entries.map((entry) => (
          <li key={entry.memberId} className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-3">
              <UserAvatar name={entry.name} size="w-10 h-10" />
              <span className="text-base font-medium">{entry.name}</span>
            </div>

            <span
              aria-hidden
              className="min-w-2 flex-1 border-b border-dotted border-muted-foreground/40"
            />
            <span className="tabular-nums text-lg font-bold">
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

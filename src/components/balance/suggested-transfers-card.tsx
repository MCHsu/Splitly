import { SectionContainer } from "@/components/shared/section-container";
import { UserAvatar } from "@/components/shared/user-avatar";
import { formatMoneyFromCents } from "@/lib/money";
import { MoveDown, MoveRight } from "lucide-react";

export type SuggestedTransfer = {
  fromMemberId: string;
  toMemberId: string;
  fromName: string;
  toName: string;
  amountInCents: number;
};

interface SuggestedTransfersCardProps {
  transfers: SuggestedTransfer[];
  currency?: string;
  className?: string;
}

export function SuggestedTransfersCard({
  transfers,
  currency = "TWD",
  className,
}: SuggestedTransfersCardProps) {
  const count = transfers.length;

  return (
    <div className="w-full">
      <p className="mb-3 text-sm text-muted-foreground">
        Suggested transfers ({count})
      </p>

      <SectionContainer>
        {count === 0 ? (
          <p className="text-muted-foreground">No suggested transfers.</p>
        ) : (
          <ul className="flex flex-col gap-4 divide-y">
            {transfers.map((transfer) => (
              <li
                key={`${transfer.fromMemberId}-${transfer.toMemberId}-${transfer.amountInCents}`}
                className="flex items-center justify-between gap-3 pb-4 text-sm"
              >
                <div className="flex min-w-0 flex-col items-center gap-3 truncate sm:flex-row">
                  <UserAvatar name={transfer.fromName} size="md" showName />

                  <MoveRight className="hidden size-6 text-muted-foreground sm:block" />
                  <MoveDown className="block size-6 text-muted-foreground sm:hidden" />

                  <UserAvatar name={transfer.toName} size="md" showName />
                </div>
                <span className="shrink-0 text-base font-semibold tabular-nums sm:text-lg">
                  {formatMoneyFromCents(transfer.amountInCents, {
                    currencyCode: currency,
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SectionContainer>
    </div>
  );
}

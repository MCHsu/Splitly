import { SectionContainer } from "@/components/shared/section-container";
import { UserAvatar } from "@/components/shared/user-avatar";
import { formatMoneyFromCents } from "@/lib/money";
import { ArrowBigDownDash, ArrowBigRightDash } from "lucide-react";
import { cn } from "@/lib/utils";

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
          <p className="text-sm text-muted-foreground">All settled</p>
        ) : (
          <ul className="flex flex-col gap-4 divide-y">
            {transfers.map((transfer) => (
              <li
                key={`${transfer.fromMemberId}-${transfer.toMemberId}-${transfer.amountInCents}`}
                className="flex items-center justify-between gap-3 pb-4 text-sm"
              >
                <div className="flex min-w-0 flex-col items-center gap-3 truncate sm:flex-row">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={transfer.fromName} size="md" />
                    <span className="font-medium">{transfer.fromName}</span>
                  </div>
                  <ArrowBigRightDash className="hidden size-6 text-muted-foreground sm:block" />
                  <ArrowBigDownDash className="block size-6 text-muted-foreground sm:hidden" />
                  <div className="flex items-center gap-3">
                    <UserAvatar name={transfer.toName} size="md" />
                    <span className="font-medium">{transfer.toName}</span>
                  </div>
                </div>
                <span className="shrink-0 text-lg font-bold sm:text-xl">
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

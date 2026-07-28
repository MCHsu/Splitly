"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoneyFromCents } from "@/lib/money";
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
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Suggested transfers ({count})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {count === 0 ? (
          <p className="text-sm text-muted-foreground">All settled</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {transfers.map((transfer) => (
              <li
                key={`${transfer.fromMemberId}-${transfer.toMemberId}-${transfer.amountInCents}`}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="min-w-0 truncate">
                  <span className="font-medium">{transfer.fromName}</span>
                  <span className="text-muted-foreground"> → </span>
                  <span className="font-medium">{transfer.toName}</span>
                </span>
                <span className="shrink-0 font-medium">
                  {formatMoneyFromCents(transfer.amountInCents, {
                    currencyCode: currency,
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

import { CheckCircle2, CircleDashed, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  formatMoneyFromCents,
  fromCents,
  toCents,
  MoneyFormatOptions,
} from "@/lib/money";

type BalanceStatus = "empty" | "under" | "over" | "balanced";

const tones = {
  empty: {
    accent: "text-muted-foreground",
    track: "bg-muted-foreground/15",
    fill: "bg-muted-foreground/30",
    Icon: CircleDashed,
  },
  under: {
    accent: "text-warning",
    track: "bg-muted-foreground/15",
    fill: "bg-warning",
    Icon: TriangleAlert,
  },
  over: {
    accent: "text-destructive",
    track: "bg-destructive/10",
    fill: "bg-destructive",
    Icon: TriangleAlert,
  },
  balanced: {
    accent: "text-success",
    track: "bg-success/10",
    fill: "bg-success",
    Icon: CheckCircle2,
  },
} as const;

interface AmountProgressProps extends MoneyFormatOptions {
  label: string;
  /** The expense amount every selected row has to add up to. */
  target: number;
  /** Sum of the selected rows. */
  current: number;
  className?: string;
}

export function AmountProgress({
  label,
  target,
  current,
  currencyCode,
  locale,
  className,
}: AmountProgressProps) {
  const targetCents = toCents(target);
  const currentCents = toCents(current);
  const diffCents = currentCents - targetCents;

  const status: BalanceStatus =
    targetCents <= 0
      ? "empty"
      : diffCents === 0
        ? "balanced"
        : diffCents < 0
          ? "under"
          : "over";

  const { accent, track, fill, Icon } = tones[status];

  // Scale to whichever is larger so an over-allocated total visibly overshoots the target tick.
  const scale = Math.max(targetCents, currentCents, 1);
  const fillPercent = Math.min((currentCents / scale) * 100, 100);
  const targetPercent = (targetCents / scale) * 100;

  const money = (cents: number) =>
    formatMoneyFromCents(cents, { currencyCode, locale });

  const hint = {
    empty: "Set the expense amount to start splitting",
    balanced: "Balanced — the totals match",
    under: `${money(-diffCents)} still to assign`,
    over: `${money(diffCents)} over the expense amount`,
  }[status];

  return (
    <div className={cn("space-y-2 text-left", className)}>
      <div className="flex items-end justify-between gap-3">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <p className="tabular-nums">
          <span className={cn("text-lg font-bold tracking-tight", accent)}>
            {money(currentCents)}
          </span>
          <span className="mx-1 text-sm text-muted-foreground/70">/</span>
          <span className="text-sm font-semibold text-foreground">
            {money(targetCents)}
          </span>
        </p>
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={fromCents(targetCents)}
        aria-valuenow={fromCents(currentCents)}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full",
          track,
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            fill,
          )}
          style={{ width: `${fillPercent}%` }}
        />
        {status === "over" && (
          <span
            aria-hidden
            className="absolute inset-y-0 w-0.5 bg-card/90"
            style={{ left: `${targetPercent}%` }}
          />
        )}
      </div>

      <p
        aria-live="polite"
        className={cn("flex items-center gap-1.5 text-xs font-medium", accent)}
      >
        <Icon className="size-3.5 shrink-0" aria-hidden />
        {hint}
      </p>
    </div>
  );
}

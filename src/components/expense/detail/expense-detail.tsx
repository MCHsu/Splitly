import { format } from "date-fns";

import { SectionContainer } from "@/components/shared/section-container";
import {
  LedgerColumn,
  type LedgerEntry,
} from "@/components/expense/detail/ledger-column";
import {
  EXPENSE_CATEGORIES,
  getExpenseCategory,
} from "@/lib/constants/expense-categories";
import { formatMoneyFromCents } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { ExpenseDetailData } from "@/types/expense";
import type { ExpensePartyMember } from "@/types/member";

interface ExpenseDetailProps {
  expense: ExpenseDetailData;
  currency: string;
  currentUserId?: string | null;
}

function toLedgerEntries(
  rows: { amountInCents: number; member: ExpensePartyMember }[],
): LedgerEntry[] {
  return rows.map((row) => ({
    memberId: row.member.id,
    name: row.member.name,
    amountInCents: row.amountInCents,
    isInactive: !row.member.isActive,
  }));
}

function netPositionCopy(
  netCents: number,
  currency: string,
): { text: string; className: string } | null {
  if (netCents === 0) return null;

  const formatted = formatMoneyFromCents(Math.abs(netCents), {
    currencyCode: currency,
  });

  if (netCents > 0) {
    return {
      text: `You lent ${formatted}`,
      className: "text-success",
    };
  }

  return {
    text: `You owe ${formatted}`,
    className: "text-destructive",
  };
}

export function ExpenseDetail({
  expense,
  currency,
  currentUserId,
}: ExpenseDetailProps) {
  const category =
    getExpenseCategory(expense.category ?? "") ??
    EXPENSE_CATEGORIES.find((c) => c.value === "other")!;
  const CategoryIcon = category.icon;

  const paidEntries = toLedgerEntries(expense.payments);
  const splitEntries = toLedgerEntries(expense.shares);

  const myPaid =
    currentUserId == null
      ? 0
      : expense.payments
          .filter((p) => p.member.userId === currentUserId)
          .reduce((sum, p) => sum + p.amountInCents, 0);
  const myShare =
    currentUserId == null
      ? 0
      : expense.shares
          .filter((s) => s.member.userId === currentUserId)
          .reduce((sum, s) => sum + s.amountInCents, 0);
  const net = myPaid - myShare;
  const position =
    currentUserId != null ? netPositionCopy(net, currency) : null;

  return (
    <SectionContainer>
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-md",
                  category.color.bg,
                )}
              >
                <CategoryIcon className={cn("size-5", category.color.icon)} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {category.label}
                </p>
                <h1 className="truncate text-xl font-semibold tracking-tight md:text-2xl">
                  {expense.description}
                </h1>
              </div>
            </div>
            <time
              dateTime={expense.date.toISOString()}
              className="shrink-0 text-sm text-muted-foreground"
            >
              {format(expense.date, "d MMMM yyyy")}
            </time>
          </div>

          <p className="font-mono text-4xl tracking-tight tabular-nums md:text-5xl">
            {formatMoneyFromCents(expense.amountInCents, {
              currencyCode: currency,
            })}
          </p>
        </header>

        <div className="-mx-4 border-t md:-mx-6 lg:-mx-10" />

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-0">
          <LedgerColumn
            title="Paid by"
            entries={paidEntries}
            currency={currency}
            className="md:pr-6 lg:pr-10"
          />
          <div className="-mx-4 border-t lg:mx-0 lg:hidden" />
          <LedgerColumn
            title="Split between"
            entries={splitEntries}
            currency={currency}
            className="lg:border-l lg:pl-10"
          />
        </div>

        {position ? (
          <>
            <div className="-mx-4 border-t md:-mx-6 lg:-mx-10" />
            <p
              className={cn(
                "font-mono text-base font-medium tabular-nums md:text-lg",
                position.className,
              )}
            >
              {position.text}
            </p>
          </>
        ) : null}

        <div className="-mx-4 border-t md:-mx-6 lg:-mx-10" />

        <footer className="space-y-2 text-sm text-muted-foreground">
          {expense.note ? <p>{expense.note}</p> : null}
          <p>
            Added {format(expense.createdAt, "d MMM yyyy")}
            {expense.updatedAt.getTime() !== expense.createdAt.getTime() ? (
              <> · Updated {format(expense.updatedAt, "d MMM yyyy")}</>
            ) : null}
          </p>
        </footer>
      </div>
    </SectionContainer>
  );
}

import { SectionContainer } from "@/components/shared/section-container";
import { formatDate } from "@/lib/date";
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
  }));
}

export function ExpenseDetail({
  expense,
  currency,
  currentUserId,
}: ExpenseDetailProps) {
  const category =
    getExpenseCategory(expense.category) ??
    EXPENSE_CATEGORIES.find((c) => c.value === "other")!;
  const CategoryIcon = category.icon;

  const paidEntries = toLedgerEntries(expense.payments);
  const splitEntries = toLedgerEntries(expense.shares);

  return (
    <div className="flex flex-col justify-between gap-4 md:gap-6">
      <SectionContainer>
        <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
          <header className="flex flex-col gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg sm:size-10 sm:rounded-xl",
                  category.color.bg,
                )}
              >
                <CategoryIcon className={cn("size-4", category.color.icon)} />
              </div>
              <time
                dateTime={formatDate(expense.date)}
                className="shrink-0 text-sm font-medium text-muted-foreground"
              >
                {formatDate(expense.date)}
              </time>
            </div>

            <div className="flex flex-row flex-wrap items-center justify-between gap-6 sm:gap-8 md:flex-nowrap lg:gap-10">
              <h1 className="text-xl font-bold first-letter:uppercase sm:text-2xl md:text-3xl">
                {expense.description}
              </h1>

              <p className="text-xl font-semibold tabular-nums sm:text-2xl md:text-3xl">
                {formatMoneyFromCents(expense.amountInCents, {
                  currencyCode: currency,
                })}
              </p>
            </div>
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

          {expense.note ? (
            <>
              <div className="-mx-4 border-t md:-mx-6 lg:-mx-10" />

              <footer className="text-sm text-muted-foreground">
                <p>
                  <span className="font-medium uppercase">Note:</span>{" "}
                  {expense.note}
                </p>
              </footer>
            </>
          ) : null}
        </div>
      </SectionContainer>

      <p className="px-2 text-xs text-muted-foreground md:px-3">
        Added: {formatDate(expense.createdAt)}
        {expense.updatedAt.getTime() !== expense.createdAt.getTime() ? (
          <> · Updated: {formatDate(expense.updatedAt)}</>
        ) : null}
      </p>
    </div>
  );
}

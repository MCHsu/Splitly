import Link from "next/link";

import {
  EXPENSE_CATEGORIES,
  getExpenseCategory,
} from "@/lib/constants/expense-categories";
import { formatMoneyFromCents } from "@/lib/money";
import type { GroupMemberWithUser } from "@/types/member";
import { cn } from "@/lib/utils";
import type { ExpenseListItem } from "@/types/expense";

interface ExpenseRowProps {
  expense: ExpenseListItem;
  groupId?: string;
  members?: GroupMemberWithUser[];
  currentUserId?: string | null;
  currency?: string;
}

export function ExpenseRow({
  expense,
  groupId,
  members,
  currentUserId,
  currency = "TWD",
}: ExpenseRowProps) {
  const paidByText =
    expense.payments.length === 1
      ? expense.payments[0].member.name
      : `${expense.payments.length} people`;

  const paidTotal = expense.amountInCents;

  const myShare = currentUserId
    ? expense.shares.find(
        (share) =>
          share.member.userId === currentUserId ||
          members?.find((m) => m.id === share.member.id)?.userId ===
            currentUserId,
      )?.amountInCents
    : undefined;

  const category =
    getExpenseCategory(expense.category ?? "") ??
    EXPENSE_CATEGORIES.find((c) => c.value === "other")!;
  const CategoryIcon = category.icon;

  return (
    <div className="py-5 transition-colors hover:bg-muted/60">
      <Link
        href={groupId ? `/groups/${groupId}/expenses/${expense.id}` : "#"}
        className="flex items-center gap-3 md:gap-4"
      >
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg sm:size-10 sm:rounded-xl",
            category.color.bg,
          )}
        >
          <CategoryIcon className={cn("size-4", category.color.icon)} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-foreground first-letter:uppercase">
            {expense.description}
          </h3>
          <p className="truncate text-xs text-muted-foreground md:text-sm">
            {paidByText} Paid{" "}
            {formatMoneyFromCents(paidTotal, {
              currencyCode: currency,
            })}
          </p>
        </div>

        {myShare != null ? (
          <div className="shrink-0 text-base font-semibold tabular-nums sm:text-lg">
            {formatMoneyFromCents(myShare, {
              currencyCode: currency,
            })}
          </div>
        ) : (
          <div className="w-6 shrink-0 md:w-10"></div>
        )}
      </Link>
    </div>
  );
}

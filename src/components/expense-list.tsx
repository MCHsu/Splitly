"use client";

import { format } from "date-fns";
import Link from "next/link";
import {
  SectionContainer,
  SectionContainerItem,
} from "@/components/shared/section-container";
import {
  EXPENSE_CATEGORIES,
  getExpenseCategory,
} from "@/lib/constants/expense-categories";
import { formatMoneyFromCents } from "@/lib/money";
import type { GroupMemberWithUser } from "@/lib/member";
import { cn } from "@/lib/utils";

interface ExpenseItem {
  id: string;
  date: Date;
  description: string;
  amountInCents: number;
  category?: string | null;
  payments?: {
    amountInCents: number;
    member: {
      id?: string;
      name: string;
      isActive?: boolean;
      userId?: string | null;
    };
  }[];
  shares?: {
    amountInCents: number;
    member: {
      id?: string;
      name: string;
      isActive?: boolean;
      userId?: string | null;
    };
  }[];
}

interface ExpenseListProps {
  expenses: ExpenseItem[];
  groupId?: string;
  members?: GroupMemberWithUser[];
  currentUserId?: string | null;
  currency?: string;
}

function formatMemberName(
  name: string,
  memberId?: string,
  members?: GroupMemberWithUser[],
  paymentMember?: { isActive?: boolean },
) {
  const isInactive =
    paymentMember?.isActive === false ||
    (memberId && members?.find((m) => m.id === memberId)?.isActive === false);

  return (
    <span className={isInactive ? "text-muted-foreground" : undefined}>
      {name}
      {isInactive && (
        <span className="ml-1 text-xs text-muted-foreground">(Inactive)</span>
      )}
    </span>
  );
}

export function ExpenseList({
  expenses,
  groupId,
  members,
  currentUserId,
  currency = "TWD",
}: ExpenseListProps) {
  const groupedExpenses = expenses.reduce(
    (acc, expense) => {
      const dayKey = format(expense.date, "d MMMM yyyy");
      if (!acc[dayKey]) {
        acc[dayKey] = [];
      }
      acc[dayKey].push(expense);
      return acc;
    },
    {} as Record<string, ExpenseItem[]>,
  );

  return (
    <div className="w-full">
      <p className="mb-3 text-sm text-muted-foreground">
        {expenses.length} {expenses.length === 1 ? "expense" : "expenses"}
      </p>

      <SectionContainer className="divide-y">
        {Object.entries(groupedExpenses).map(([dayLabel, items]) => (
          <div key={dayLabel}>
            <div className="bg-muted/40 px-4 py-2">
              <h3 className="text-xs font-medium text-muted-foreground">
                {dayLabel}
              </h3>
            </div>

            <div className="divide-y">
              {items.map((expense) => {
                const payments = expense.payments ?? [];
                const paidByText =
                  payments.length === 1
                    ? formatMemberName(
                        payments[0].member.name,
                        payments[0].member.id,
                        members,
                        payments[0].member,
                      )
                    : `${payments.length} people`;

                const paidTotal =
                  payments.length === 1
                    ? payments[0].amountInCents
                    : expense.amountInCents;

                const myShare = currentUserId
                  ? expense.shares?.find(
                      (share) =>
                        share.member.userId === currentUserId ||
                        members?.find((m) => m.id === share.member.id)
                          ?.userId === currentUserId,
                    )?.amountInCents
                  : undefined;

                const category =
                  getExpenseCategory(expense.category ?? "") ??
                  EXPENSE_CATEGORIES.find((c) => c.value === "other")!;
                const CategoryIcon = category.icon;

                return (
                  <SectionContainerItem
                    key={expense.id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    <Link
                      href={
                        groupId
                          ? `/groups/${groupId}/expenses/${expense.id}`
                          : "#"
                      }
                      className="flex items-center gap-3"
                    >
                      <div
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-md",
                          category.color.bg,
                        )}
                      >
                        <CategoryIcon
                          className={cn("size-4", category.color.icon)}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold text-foreground">
                          {expense.description}
                        </h3>
                        <p className="truncate text-sm text-muted-foreground">
                          {paidByText} Paid{" "}
                          {formatMoneyFromCents(paidTotal, {
                            currencyCode: currency,
                          })}
                          {myShare != null && (
                            <>
                              {" · "}Your share{" "}
                              {formatMoneyFromCents(myShare, {
                                currencyCode: currency,
                              })}
                            </>
                          )}
                        </p>
                      </div>

                      {myShare != null && (
                        <div className="shrink-0 text-base font-bold">
                          {formatMoneyFromCents(myShare, {
                            currencyCode: currency,
                          })}
                        </div>
                      )}
                    </Link>
                  </SectionContainerItem>
                );
              })}
            </div>
          </div>
        ))}
      </SectionContainer>
    </div>
  );
}

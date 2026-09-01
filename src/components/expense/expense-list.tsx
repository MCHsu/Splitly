import { ExpenseRow } from "@/components/expense/expense-row";
import { formatDate } from "@/lib/date";
import { SectionContainer } from "@/components/shared/section-container";
import type { GroupMemberWithUser } from "@/types/member";
import type { ExpenseListItem } from "@/types/expense";

interface ExpenseListProps {
  expenses: ExpenseListItem[];
  groupId?: string;
  members?: GroupMemberWithUser[];
  currentUserId?: string | null;
  currency?: string;
}

export function ExpenseList({
  expenses,
  groupId,
  members,
  currentUserId,
  currency,
}: ExpenseListProps) {
  const groupedExpenses = expenses.reduce(
    (acc, expense) => {
      const dayKey = formatDate(expense.date);
      if (!acc[dayKey]) {
        acc[dayKey] = [];
      }
      acc[dayKey].push(expense);
      return acc;
    },
    {} as Record<string, ExpenseListItem[]>,
  );

  return (
    <div className="w-full">
      <p className="mb-3 text-sm text-muted-foreground">
        {expenses.length} {expenses.length === 1 ? "expense" : "expenses"}
      </p>

      <SectionContainer>
        {Object.entries(groupedExpenses).map(([dayLabel, items]) => (
          <div key={dayLabel}>
            <div className="rounded-md bg-muted px-3 py-1.5">
              <h3 className="text-xs font-medium text-muted-foreground">
                {dayLabel}
              </h3>
            </div>

            <div className="divide-y divide-border">
              {items.map((expense) => (
                <ExpenseRow
                  key={expense.id}
                  expense={expense}
                  groupId={groupId}
                  members={members}
                  currentUserId={currentUserId}
                  currency={currency}
                />
              ))}
            </div>
          </div>
        ))}
      </SectionContainer>
    </div>
  );
}

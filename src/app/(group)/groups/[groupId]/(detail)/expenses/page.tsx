import { notFound } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCurrentUserId } from "@/lib/queries/auth.query";
import { getGroupExpenses, getGroupStats } from "@/lib/queries/group.query";
import { ExpenseList } from "@/components/expense/expense-list";
import { SectionContainer } from "@/components/shared/section-container";
import { GroupSpendCard } from "@/components/group/group-spend-card";

export default async function GroupExpensesPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const [groupExpenses, currentUserId, stats] = await Promise.all([
    getGroupExpenses(groupId),
    getCurrentUserId(),
    getGroupStats(groupId),
  ]);

  if (!groupExpenses) {
    notFound();
  }

  const { currency, expenses, members } = groupExpenses;

  if (expenses.length === 0) {
    return (
      <SectionContainer>
        <div className="flex flex-col items-center justify-center gap-4 md:gap-5 lg:gap-6">
          <p className="text-muted-foreground">
            No expenses yet. Add an expense to get started.
          </p>
          <Link href={`/groups/${groupId}/expenses/new`}>
            <Button>
              <Plus />
              New Expense
            </Button>
          </Link>
        </div>
      </SectionContainer>
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:gap-10">
      <GroupSpendCard
        totalGroupSpend={stats.totalGroupSpend}
        yourBalance={stats.yourBalance}
        currency={currency}
      />
      <ExpenseList
        expenses={expenses}
        groupId={groupId}
        members={members}
        currentUserId={currentUserId}
        currency={currency}
      />
    </div>
  );
}

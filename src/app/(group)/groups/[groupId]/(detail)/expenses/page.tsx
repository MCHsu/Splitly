import { notFound } from "next/navigation";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCurrentUserId } from "@/lib/queries/auth.query";
import { getGroupById, getGroupStats } from "@/lib/queries/group.query";
import { ExpenseList } from "@/components/expense/expense-list";
import { SectionContainer } from "@/components/shared/section-container";
import { GroupSpendCard } from "@/components/group/group-spend-card";

export default async function GroupExpensesPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const [group, currentUserId, stats] = await Promise.all([
    getGroupById(groupId),
    getCurrentUserId(),
    getGroupStats(groupId),
  ]);

  if (!group) {
    notFound();
  }

  const spend = {
    totalGroupSpend: stats.totalGroupSpend,
    yourShare: stats.yourShare,
    currency: group.currency,
  };

  if (group.expenses.length === 0) {
    return (
      <SectionContainer>
        <div className="flex flex-col items-center justify-center gap-4 md:gap-5 lg:gap-6">
          <p className="text-gray-600">
            No expenses yet. Add an expense to get started.
          </p>
          <Link href={`/groups/${groupId}/expenses/new`}>
            <Button>
              <PlusCircle />
              New Expense
            </Button>
          </Link>
        </div>
      </SectionContainer>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6 lg:gap-10">
      {spend && (
        <GroupSpendCard
          totalGroupSpend={spend.totalGroupSpend}
          yourShare={spend.yourShare}
          currency={spend.currency}
        />
      )}
      <ExpenseList
        expenses={group.expenses}
        groupId={groupId}
        members={group.members}
        currentUserId={currentUserId}
        currency={group.currency}
      />
    </div>
  );
}

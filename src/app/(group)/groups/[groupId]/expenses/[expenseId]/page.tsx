import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";

import { getExpenseById } from "@/app/actions/expense.action";
import { getCurrentUserId } from "@/app/actions/auth.action";
import { ExpenseDetail } from "@/components/expense-detail/expense-detail";
import { PageHeader } from "@/components/shared/page-header";

export default async function ExpenseDetailPage({
  params,
}: {
  params: Promise<{ groupId: string; expenseId: string }>;
}) {
  const { groupId, expenseId } = await params;
  const [expense, currentUserId] = await Promise.all([
    getExpenseById(expenseId),
    getCurrentUserId(),
  ]);

  if (!expense || expense.groupId !== groupId) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title="Expense"
        action={{
          href: `/groups/${groupId}/expenses/${expenseId}/edit`,
          label: "Edit",
          icon: Pencil,
        }}
      />
      <ExpenseDetail
        expense={expense}
        currency={expense.group.currency}
        currentUserId={currentUserId}
      />
    </>
  );
}

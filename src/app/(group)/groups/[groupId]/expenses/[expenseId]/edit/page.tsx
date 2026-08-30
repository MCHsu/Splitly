import { notFound } from "next/navigation";

import { updateExpense } from "@/app/actions/expense.action";
import { getExpenseById } from "@/lib/queries/expense.query";
import { getGroupById } from "@/lib/queries/group.query";
import { ExpenseForm } from "@/components/expense/form/expense-form";
import { PageHeader } from "@/components/shared/page-header";
import { toExpenseFormValues } from "@/lib/expense-form-values";

export default async function EditExpensePage({
  params,
}: {
  params: Promise<{ groupId: string; expenseId: string }>;
}) {
  const { groupId, expenseId } = await params;
  const [expense, group] = await Promise.all([
    getExpenseById(expenseId),
    getGroupById(groupId),
  ]);

  if (!expense || expense.groupId !== groupId || !group) {
    notFound();
  }

  const defaultValues = toExpenseFormValues(expense, group.members);

  const updateExpenseWithExpenseId = updateExpense.bind(null, expenseId);

  return (
    <>
      <PageHeader title="Edit Expense" />
      <ExpenseForm
        mode="edit"
        defaultValues={defaultValues}
        onSubmit={updateExpenseWithExpenseId}
      />
    </>
  );
}

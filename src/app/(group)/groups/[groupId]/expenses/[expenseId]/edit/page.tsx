import { notFound, redirect } from "next/navigation";

import { updateExpense } from "@/app/actions/expense.action";
import { getExpenseById } from "@/lib/queries/expense.query";
import { getGroupById } from "@/lib/queries/group.query";
import { ExpenseForm } from "@/components/expense/form/expense-form";
import { PageHeader } from "@/components/shared/page-header";
import { toExpenseFormValues } from "@/lib/expense-form-values";
import type { ExpenseFormData } from "@/lib/validations/expense";

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

  async function handleSubmit(data: ExpenseFormData) {
    "use server";
    const result = await updateExpense(expenseId, data);
    if (!result.success) {
      throw new Error(
        "error" in result ? result.error : "Failed to update expense",
      );
    }
    redirect(`/groups/${groupId}/expenses/${expenseId}`);
  }

  return (
    <>
      <PageHeader title="Edit Expense" />
      <ExpenseForm
        mode="edit"
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        cancelHref={`/groups/${groupId}/expenses/${expenseId}`}
      />
    </>
  );
}

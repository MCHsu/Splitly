import { notFound } from "next/navigation";

import { updateExpense } from "@/app/actions/expense.action";
import { getExpenseById } from "@/lib/queries/expense.query";
import { getGroupMembers } from "@/lib/queries/group.query";
import { ExpenseForm } from "@/components/expense/form/expense-form";
import { PageHeader } from "@/components/shared/page-header";
import { toExpenseFormValues } from "@/lib/domain/expense-form-values";
import { MembersProvider } from "@/providers/member-provider";

export default async function EditExpensePage({
  params,
}: {
  params: Promise<{ groupId: string; expenseId: string }>;
}) {
  const { groupId, expenseId } = await params;
  const [expense, members] = await Promise.all([
    getExpenseById(expenseId),
    getGroupMembers(groupId),
  ]);

  if (!expense || expense.groupId !== groupId || !members) {
    notFound();
  }

  const defaultValues = toExpenseFormValues(expense, members);
  const updateExpenseWithExpenseId = updateExpense.bind(null, expenseId);

  return (
    <>
      <PageHeader title="Edit Expense" />
      <MembersProvider members={members}>
        <ExpenseForm
          currency={expense.group.currency}
          mode="edit"
          defaultValues={defaultValues}
          onSubmit={updateExpenseWithExpenseId}
        />
      </MembersProvider>
    </>
  );
}

import { createExpense } from "@/app/actions/expense.action";
import { ExpenseForm } from "@/components/expense/form/expense-form";
import { PageHeader } from "@/components/shared/page-header";

export default async function AddExpensePage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;

  const createExpenseWithGroupId = createExpense.bind(null, groupId);

  return (
    <>
      <PageHeader title="New Expense" />
      <ExpenseForm mode="add" onSubmit={createExpenseWithGroupId} />
    </>
  );
}

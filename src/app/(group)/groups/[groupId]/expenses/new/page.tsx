import { ExpenseForm } from "@/components/expense/form/expense-form";
import { PageHeader } from "@/components/shared/page-header";

export default async function AddExpensePage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;

  return (
    <>
      <PageHeader title="Create New Expense" />
      <ExpenseForm groupId={groupId} />
    </>
  );
}

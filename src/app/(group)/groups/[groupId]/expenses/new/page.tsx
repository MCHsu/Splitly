import { notFound } from "next/navigation";

import { createExpense } from "@/app/actions/expense.action";
import { ExpenseForm } from "@/components/expense/form/expense-form";
import { PageHeader } from "@/components/shared/page-header";
import { getGroupSummary, getGroupMembers } from "@/lib/queries/group.query";
import { MembersProvider } from "@/providers/member-provider";

export default async function AddExpensePage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const [group, members] = await Promise.all([
    getGroupSummary(groupId),
    getGroupMembers(groupId),
  ]);

  if (!group || !members) {
    notFound();
  }

  const createExpenseWithGroupId = createExpense.bind(null, groupId);

  return (
    <>
      <PageHeader title="New Expense" />
      <MembersProvider members={members}>
        <ExpenseForm
          currency={group.currency}
          mode="add"
          onSubmit={createExpenseWithGroupId}
        />
      </MembersProvider>
    </>
  );
}

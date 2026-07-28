import { ExpenseForm } from "@/components/expense-form/expense-form";
import { PageHeader } from "@/components/shared/page-header";
// import { getGroupMembers } from "@/app/actions/member.action";

export default async function AddExpensePage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  // const members = await getGroupMembers(groupId);

  return (
    <>
      <PageHeader title="Create New Expense" />
      <ExpenseForm groupId={groupId} />
    </>
  );
}

import { notFound } from "next/navigation";

import { getExpenseById } from "@/app/actions/expense.action";
import { GroupBreadcrumbs } from "@/components/shared/group-breadcrumbs";

export default async function Page({
  params,
}: {
  params: Promise<{ groupId: string; expenseId: string }>;
}) {
  const { groupId, expenseId } = await params;
  const expense = await getExpenseById(expenseId);

  if (!expense || expense.groupId !== groupId) {
    notFound();
  }

  return (
    <GroupBreadcrumbs
      groupId={groupId}
      trailing={[
        {
          label: expense.description,
          href: `/groups/${groupId}/expenses/${expenseId}`,
        },
      ]}
    />
  );
}

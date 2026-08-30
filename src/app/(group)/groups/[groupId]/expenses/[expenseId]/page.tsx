import { notFound } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

import { getExpenseById } from "@/lib/queries/expense.query";
import { getCurrentUserId } from "@/lib/queries/auth.query";
import { ExpenseDetail } from "@/components/expense/detail/expense-detail";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { deleteExpense } from "@/app/actions/expense.action";

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

  async function deleteExpenseWithId() {
    "use server";
    await deleteExpense(expenseId);
  }

  if (!expense || expense.groupId !== groupId) {
    notFound();
  }

  return (
    <>
      <PageHeader
        // showBackButton
        actions={
          <>
            <form action={deleteExpenseWithId}>
              <Button type="submit" variant="destructive">
                <Trash2 />
                {/* Delete */}
              </Button>
            </form>
            <Button asChild>
              <Link href={`/groups/${groupId}/expenses/${expenseId}/edit`}>
                <Pencil />
                Edit
              </Link>
            </Button>
          </>
        }
      />
      <ExpenseDetail
        expense={expense}
        currency={expense.group.currency}
        currentUserId={currentUserId}
      />
    </>
  );
}

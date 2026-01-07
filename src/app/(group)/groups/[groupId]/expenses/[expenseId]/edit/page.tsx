"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ExpenseForm } from "@/components/expense-form/expense-form";

export default function EditExpensePage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;
  const expenseId = params.expenseId as string;

  const mockExpenseData = {
    description: "Dinner at Mario's",
    amount: 250.0,
    date: new Date(2024, 0, 13),
    paidByMode: "single" as const,
    paidBy: [{ memberId: "user-1", amount: 250.0 }],
    allocations: [
      { memberId: "user-1", amount: 125.0 },
      { memberId: "user-2", amount: 125.0 },
    ],
  };

  const handleSubmit = (data: any) => {
    console.log("Update expense:", data);
    router.push(`/groups/${groupId}`);
  };

  const handleCancel = () => {
    router.push(`/groups/${groupId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push(`/groups/${groupId}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Group
        </Button>

        <h1 className="text-3xl font-bold mb-2">Edit Expense</h1>
        <p className="text-gray-600 mb-8">
          Update the details of this expense.
        </p>

        <ExpenseForm
          mode="edit"
          defaultValues={mockExpenseData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}

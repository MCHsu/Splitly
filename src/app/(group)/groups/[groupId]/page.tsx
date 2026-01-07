"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserPlus, Receipt, ArrowLeft } from "lucide-react";
import { ExpenseList } from "@/components/expense-list";

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;

  const mockActivities = [
    {
      id: "1",
      type: "expense" as const,
      date: new Date(2024, 0, 13),
      description: "Dinner at Mario's",
      paidBy: "You",
      amount: 250.0,
      status: "lent" as const,
      statusAmount: 200.0,
      icon: "dining",
    },
    {
      id: "2",
      type: "expense" as const,
      date: new Date(2024, 0, 17),
      description: "Uber to Hotel",
      paidBy: "Sarah",
      amount: 45.5,
      status: "owed" as const,
      statusAmount: 11.37,
      icon: "transport",
    },
    {
      id: "3",
      type: "member-added" as const,
      date: new Date(2024, 0, 17),
      description: "",
      addedMember: "Mike Ross",
      addedBy: "Sarah",
    },
    {
      id: "4",
      type: "expense" as const,
      date: new Date(2024, 0, 13),
      description: "Walmart Groceries",
      paidBy: "Mike",
      amount: 89.2,
      status: "not-involved" as const,
      icon: "shopping",
    },
    {
      id: "5",
      type: "expense" as const,
      date: new Date(2024, 0, 15),
      description: "Flight Tickets",
      paidBy: "You",
      amount: 900.0,
      status: "lent" as const,
      statusAmount: 450.0,
      icon: "flight",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push("/groups")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Groups
        </Button>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          {/* Group Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Group Name</h1>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <Link href={`/groups/${groupId}/members/new`}>
              <Button>
                <UserPlus />
                Add Member
              </Button>
            </Link>
            <Link href={`/groups/${groupId}/expenses/new`}>
              <Button>
                <Receipt />
                Add Expense
              </Button>
            </Link>
          </div>
        </div>

        {/* Members Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Members</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">
              No members yet. Add members to get started.
            </p>
          </div>
        </div>

        {/* Expenses Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Expense</h2>
          {mockActivities.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">
                No expenses yet. Add an expense to get started.
              </p>
            </div>
          ) : (
            <ExpenseList activities={mockActivities} groupId={groupId} />
          )}
        </div>
      </div>
    </div>
  );
}

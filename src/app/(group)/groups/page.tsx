import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function GroupsPage() {
  const mockGroups = [
    { id: "1", name: "Trip to Vegas", memberCount: 4, expenseCount: 12 },
    { id: "2", name: "Office Lunch", memberCount: 6, expenseCount: 3 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Groups</h1>
        <Link href="/groups/new">
          <Button>
            <PlusCircle />
            New Group
          </Button>
        </Link>
      </div>

      {mockGroups.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">
            No groups yet. Create your first group to get started.
          </p>
          <Link href="/groups/new">
            <Button>
              <PlusCircle />
              Create New Group
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockGroups.map((group) => (
            <Link key={group.id} href={`/groups/${group.id}`}>
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <h2 className="text-xl font-semibold mb-2">{group.name}</h2>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{group.memberCount} members</p>
                  <p>{group.expenseCount} expenses</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

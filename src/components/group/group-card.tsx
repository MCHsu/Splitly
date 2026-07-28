import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface GroupCardProps {
  id: string;
  name: string;
  memberCount: number;
  expenseCount: number;
}

export function GroupCard({ id, name, memberCount, expenseCount }: GroupCardProps) {
  return (
    <Link href={`/groups/${id}`}>
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div>
          <h2 className="text-xl font-semibold mb-2">{name}</h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p>{memberCount} members</p>
            <p>{expenseCount} expenses</p>
          </div>
        </div>
        <ChevronRight className="size-5 text-gray-400 shrink-0" />
      </div>
    </Link>
  );
}

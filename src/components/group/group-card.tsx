import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface GroupCardProps {
  id: string;
  name: string;
  memberCount: number;
  expenseCount: number;
}

export function GroupCard({
  id,
  name,
  memberCount,
  expenseCount,
}: GroupCardProps) {
  return (
    <Link href={`/groups/${id}`}>
      <div className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg">
        <div>
          <h2 className="mb-2 text-xl font-semibold">{name}</h2>
          <div className="space-y-1 text-sm text-gray-600">
            <p>{memberCount} members</p>
            <p>{expenseCount} expenses</p>
          </div>
        </div>
        <ChevronRight className="size-5 shrink-0 text-gray-400" />
      </div>
    </Link>
  );
}

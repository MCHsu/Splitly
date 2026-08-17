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
      <div className="flex cursor-pointer items-center justify-between rounded-lg border bg-card p-6 transition-shadow hover:bg-muted">
        <div>
          <h2 className="mb-2 text-xl font-semibold">{name}</h2>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>{memberCount} members</p>
            <p>{expenseCount} expenses</p>
          </div>
        </div>
        <ChevronRight className="size-5 shrink-0 text-muted-foreground/70" />
      </div>
    </Link>
  );
}

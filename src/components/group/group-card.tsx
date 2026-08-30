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
      <div className="flex w-full items-center justify-between gap-4 rounded-2xl border bg-card p-6 hover:bg-muted sm:rounded-[20px] xl:gap-6">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
          <h2 className="w-full truncate text-xl font-semibold first-letter:uppercase">
            {name}
          </h2>
          <div className="flex flex-col items-start text-sm text-muted-foreground">
            <p>{memberCount} members</p>
            <p>{expenseCount} expenses</p>
          </div>
        </div>
        <ChevronRight className="size-5 shrink-0 text-muted-foreground/70" />
      </div>
    </Link>
  );
}

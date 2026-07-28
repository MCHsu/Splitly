import Link from "next/link";
import { Receipt } from "lucide-react";

import { Button } from "@/components/ui/button";

interface GroupDetailMobileCtaProps {
  groupId: string;
}

export function GroupDetailMobileCta({ groupId }: GroupDetailMobileCtaProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-4 md:hidden">
      <div className="pointer-events-auto mx-auto flex max-w-lg justify-center">
        <Button asChild size="lg" className="shadow-lg">
          <Link href={`/groups/${groupId}/expenses/new`}>
            <Receipt />
            New Expense
          </Link>
        </Button>
      </div>
    </div>
  );
}

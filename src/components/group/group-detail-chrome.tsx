import Link from "next/link";
import { Plus } from "lucide-react";

import { GroupDetailMobileCta } from "@/components/group/group-detail-mobile-cta";
import { GroupDetailTabs } from "@/components/group/group-detail-tabs";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

interface GroupDetailChromeProps {
  groupId: string;
  groupName: string;
  children: React.ReactNode;
}

export function GroupDetailChrome({
  groupId,
  groupName,
  children,
}: GroupDetailChromeProps) {
  return (
    <div className="relative pb-20 md:pb-0">
      <PageHeader
        showBackButton={false}
        title={groupName}
        actions={
          <Button asChild className="hidden md:inline-flex">
            <Link href={`/groups/${groupId}/expenses/new`}>
              <Plus />
              New Expense
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
        <GroupDetailTabs groupId={groupId} />
        <div>{children}</div>
      </div>

      <GroupDetailMobileCta groupId={groupId} />
    </div>
  );
}

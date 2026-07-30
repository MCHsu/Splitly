import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { SectionContainer } from "@/components/shared/section-container";
import { GroupCard } from "@/components/group/group-card";
import { getAllGroups } from "@/app/actions/group.action";
import { getAuthSession } from "@/app/actions/auth.action";

export default async function GroupsPage() {
  const groups = await getAllGroups();
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/auth");
  }

  return (
    <>
      <PageHeader
        title="Groups"
        action={{
          href: "/groups/new",
          label: "New Group",
          icon: PlusCircle,
        }}
      />

      {groups.length === 0 ? (
        <SectionContainer>
          <div className="flex flex-col items-center justify-center gap-4 md:gap-5 lg:gap-6">
            <p className="text-gray-600">
              No groups yet. Create your first group to get started.
            </p>
            <Link href="/groups/new">
              <Button>
                <PlusCircle />
                New Group
              </Button>
            </Link>
          </div>
        </SectionContainer>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              id={group.id}
              name={group.name}
              memberCount={group._count.members}
              expenseCount={group._count.expenses}
            />
          ))}
        </div>
      )}
    </>
  );
}

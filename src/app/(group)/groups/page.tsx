import Link from "next/link";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { SectionContainer } from "@/components/shared/section-container";
import { GroupCard } from "@/components/group/group-card";
import { getAllGroups } from "@/lib/queries/group.query";
import { getAuthSession } from "@/lib/queries/auth.query";

export default async function GroupsPage() {
  const groups = await getAllGroups();
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/auth");
  }

  const isGuest = Boolean(session.user.isAnonymous);

  return (
    <>
      <PageHeader
        title="My Groups"
        showBackButton={false}
        actions={
          isGuest ? undefined : (
            <Button asChild className="w-full md:w-auto">
              <Link href="/groups/new">
                <Plus />
                New Group
              </Link>
            </Button>
          )
        }
      />

      <div className={isGuest ? undefined : "pb-20 md:pb-0"}>
        {groups.length === 0 ? (
          <SectionContainer>
            <div className="flex flex-col items-center justify-center gap-4 md:gap-5 lg:gap-6">
              <p className="text-muted-foreground">
                {isGuest
                  ? "No groups yet. Join a group with an invite link to get started."
                  : "No groups yet. Create your first group to get started."}
              </p>
              {!isGuest ? (
                <Link href="/groups/new">
                  <Button>
                    <Plus />
                    New Group
                  </Button>
                </Link>
              ) : null}
            </div>
          </SectionContainer>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      </div>
    </>
  );
}

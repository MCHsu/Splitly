import { notFound } from "next/navigation";

import { getMemberManagementData } from "@/lib/queries/member.query";
import { ManageMembersClient } from "@/components/group/manage-members-client";

export default async function GroupMembersPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const data = await getMemberManagementData(groupId);

  if (!data) {
    notFound();
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Manage Members</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add virtual members, delete, deactivate, or leave the group.
        </p>
      </div>

      <ManageMembersClient
        groupId={groupId}
        members={data.members}
        balances={data.balances}
        expenseCounts={data.expenseCounts}
        callerMembership={data.callerMembership}
        currentUserId={data.currentUserId}
      />
    </>
  );
}

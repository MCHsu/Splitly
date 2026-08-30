import { notFound } from "next/navigation";

import { AddMember } from "@/components/members/add-member";
import { InviteLink } from "@/components/members/invite-link";
import { MemberList } from "@/components/members/member-list";
import { getMemberManagementData } from "@/lib/queries/member.query";

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

  const isOwner = data.callerMembership.role === "OWNER";
  const memberCount = data.members.length;

  return (
    <div className="flex flex-col gap-6 lg:gap-10">
      <div className="w-full">
        <p className="mb-3 text-sm text-muted-foreground">Invite</p>
        <InviteLink inviteCode={data.inviteCode} />
      </div>

      {isOwner && (
        <div className="w-full">
          <p className="mb-3 text-sm text-muted-foreground">Add member</p>
          <AddMember groupId={groupId} />
        </div>
      )}

      <div className="w-full">
        <p className="mb-3 text-sm text-muted-foreground">
          {memberCount} {memberCount === 1 ? "member" : "members"}
        </p>
        <MemberList
          groupId={groupId}
          members={data.members}
          hasFinancialRecords={data.hasFinancialRecords}
          callerMembership={data.callerMembership}
          currentUserId={data.currentUserId}
        />
      </div>
    </div>
  );
}

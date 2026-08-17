import { notFound, redirect } from "next/navigation";

import { JoinGroupClient } from "@/components/join/join-group-client";
import { getJoinPageData } from "@/lib/queries/member.query";

export default async function JoinPage({
  params,
}: {
  params: Promise<{ inviteCode: string }>;
}) {
  const { inviteCode } = await params;
  const data = await getJoinPageData(inviteCode);

  if (!data) {
    notFound();
  }

  if (data.alreadyMember) {
    redirect(`/groups/${data.group.id}`);
  }

  return (
    <JoinGroupClient
      inviteCode={inviteCode}
      groupName={data.group.name}
      unclaimedMembers={data.unclaimedMembers}
    />
  );
}

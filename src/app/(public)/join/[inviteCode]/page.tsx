import { notFound, redirect } from "next/navigation";

import { JoinGroupForm } from "@/components/join/join-group-form";
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
    <JoinGroupForm
      inviteCode={inviteCode}
      groupName={data.group.name}
      unclaimedMembers={data.unclaimedMembers}
      isSignedIn={data.isSignedIn}
    />
  );
}

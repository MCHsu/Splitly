import { notFound } from "next/navigation";
import { getGroupByInviteCode } from "@/lib/queries/member.query";
import { JoinGroupClient } from "@/components/group/join-group-client";

export default async function JoinPage({
  params,
}: {
  params: Promise<{ inviteCode: string }>;
}) {
  const { inviteCode } = await params;
  const group = await getGroupByInviteCode(inviteCode);

  if (!group) {
    notFound();
  }

  return <JoinGroupClient inviteCode={inviteCode} groupName={group.name} />;
}

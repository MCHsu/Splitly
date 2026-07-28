import { notFound } from "next/navigation";

import { getGroupById } from "@/app/actions/group.action";
import { GroupProvider } from "@/providers/group-provider";
import { MembersProvider } from "@/providers/member-provider";

export default async function GroupIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const group = await getGroupById(groupId);

  if (!group) {
    notFound();
  }

  return (
    <GroupProvider currency={group.currency}>
      <MembersProvider members={group.members}>
        <div className="flex flex-1 flex-col">{children}</div>
      </MembersProvider>
    </GroupProvider>
  );
}

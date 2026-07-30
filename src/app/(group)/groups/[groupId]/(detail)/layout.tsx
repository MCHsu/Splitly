import { notFound } from "next/navigation";

import { getGroupById } from "@/lib/queries/group.query";
import { GroupDetailChrome } from "@/components/group/group-detail-chrome";

export default async function GroupDetailLayout({
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
    <GroupDetailChrome groupId={groupId} groupName={group.name}>
      {children}
    </GroupDetailChrome>
  );
}

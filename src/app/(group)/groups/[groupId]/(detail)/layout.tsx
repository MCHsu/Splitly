import { getGroupById, getGroupStats } from "@/app/actions/group.action";
import { GroupDetailChrome } from "@/components/group/group-detail-chrome";

export default async function GroupDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const [group, stats] = await Promise.all([
    getGroupById(groupId),
    getGroupStats(groupId),
  ]);

  if (!group) {
    return null;
  }

  return (
    <GroupDetailChrome groupId={groupId} groupName={group.name}>
      {children}
    </GroupDetailChrome>
  );
}

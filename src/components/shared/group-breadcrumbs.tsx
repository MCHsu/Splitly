import { getGroupById } from "@/app/actions/group.action";
import { Breadcrumbs, type Crumb } from "@/components/shared/breadcrumbs";

export async function GroupBreadcrumbs({
  groupId,
  trailing = [],
}: {
  groupId: string;
  trailing?: Crumb[];
}) {
  const group = await getGroupById(groupId);

  return (
    <Breadcrumbs
      items={[
        { label: "Groups", href: "/groups" },
        {
          label: group?.name ?? "Group",
          href: trailing.length > 0 ? `/groups/${groupId}/expenses` : undefined,
        },
        ...trailing,
      ]}
    />
  );
}

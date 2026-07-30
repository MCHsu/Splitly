import { getGroupById } from "@/lib/queries/group.query";
import { Breadcrumbs, type Crumb } from "@/components/shared/breadcrumbs";

interface GroupBreadcrumbsProps {
  groupId: string;
  trailing?: Crumb[];
}

export async function GroupBreadcrumbs({
  groupId,
  trailing = [],
}: GroupBreadcrumbsProps) {
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

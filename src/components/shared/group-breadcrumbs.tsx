import { getGroupSummary } from "@/lib/queries/group.query";
import { Breadcrumbs, type Crumb } from "@/components/shared/breadcrumbs";

interface GroupBreadcrumbsProps {
  groupId: string;
  trailing?: Crumb[];
}

export async function GroupBreadcrumbs({
  groupId,
  trailing = [],
}: GroupBreadcrumbsProps) {
  const group = await getGroupSummary(groupId);

  return (
    <Breadcrumbs
      items={[
        { label: "My Groups", href: "/groups" },
        {
          label: group?.name ?? "My Group",
          href: trailing.length > 0 ? `/groups/${groupId}/expenses` : undefined,
          shrink: true,
        },
        ...trailing,
      ]}
    />
  );
}

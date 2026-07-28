import { GroupBreadcrumbs } from "@/components/shared/group-breadcrumbs";

export default async function Page({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  return <GroupBreadcrumbs groupId={groupId} />;
}

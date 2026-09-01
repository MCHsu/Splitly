import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";

import { updateGroup, deleteGroup } from "@/app/actions/group.action";
import { getCurrentUserId } from "@/lib/queries/auth.query";
import { getGroupById } from "@/lib/queries/group.query";
import { GroupForm } from "@/components/group/group-form";
import { ActionSection } from "@/components/shared/action-section";
import { getCurrencies } from "@/lib/queries/currencies.query";

export default async function GroupSettingsPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const [group, currencies] = await Promise.all([
    getGroupById(groupId),
    getCurrencies(),
  ]);

  if (!group) {
    notFound();
  }

  const currentUserId = await getCurrentUserId();
  const callerMembership = group.members.find(
    (member) => member.userId === currentUserId && member.isActive,
  );
  const isOwner = callerMembership?.role === "OWNER";

  const updateGroupWithId = updateGroup.bind(null, groupId);

  return (
    <div className="flex flex-col gap-6 lg:gap-10">
      <div className="w-full">
        <p className="mb-3 text-sm text-muted-foreground">Group details</p>

        <GroupForm
          mode="edit"
          currencies={currencies}
          defaultValues={{
            name: group.name,
            currency: group.currency,
            description: group.description ?? "",
          }}
          onSubmit={updateGroupWithId}
        />
      </div>

      {isOwner && (
        <div className="w-full">
          <p className="mb-3 text-sm text-muted-foreground">Danger zone</p>
          <ActionSection
            title="Delete group"
            description="Permanently deletes this group for everyone, including all expenses and members. This can't be undone."
            actionLabel="Delete"
            icon={<Trash2 className="text-destructive" />}
            variant="destructive"
            onAction={deleteGroup.bind(null, groupId)}
          />
        </div>
      )}
    </div>
  );
}

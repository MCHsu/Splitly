import { notFound } from "next/navigation";
import { Trash2, DoorOpen } from "lucide-react";

import { getGroupById, updateGroup } from "@/app/actions/group.action";
import { GroupForm } from "@/components/group-form/group-form";
import { ActionSection } from "@/components/shared/action-section";
import { InviteLinkButton } from "@/components/group/invite-link-button";
import type { GroupFormData } from "@/lib/validations/group";

export default async function GroupSettingsPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const group = await getGroupById(groupId);

  if (!group) {
    notFound();
  }

  async function handleUpdate(data: GroupFormData) {
    "use server";
    await updateGroup(groupId, data);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Group</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit group details and share an invite link.
          </p>
        </div>
        <InviteLinkButton inviteCode={group.inviteCode} />
      </div>

      <GroupForm
        mode="edit"
        defaultValues={{
          name: group.name,
          description: group.description ?? "",
          currency: group.currency,
        }}
        onSubmit={handleUpdate}
      />

      <div className="flex flex-col gap-4">
        <ActionSection
          title="Delete group"
          description="Permanently deletes this group for everyone, including all expenses, members and settlement history. This can't be undone."
          actionLabel="Delete"
          icon={<Trash2 className="text-destructive" />}
        />
        {/* <ActionSection
          title="Leave group"
          description="You'll lose access unless someone invites you back. Your past expenses stay in the group's history."
          actionLabel="Leave"
          icon={<DoorOpen className="text-destructive" />}
        /> */}
      </div>
    </div>
  );
}

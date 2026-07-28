"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CirclePlus } from "lucide-react";
import { MemberManagementList } from "@/components/group/member-management-list";
import { SectionContainer } from "@/components/shared/section-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addVirtualMember } from "@/app/actions/member.action";
import type { GroupMemberWithUser } from "@/lib/member";

interface ManageMembersClientProps {
  groupId: string;
  members: GroupMemberWithUser[];
  balances: Record<string, number>;
  expenseCounts: Record<string, number>;
  callerMembership: GroupMemberWithUser;
  currentUserId: string;
}

export function ManageMembersClient({
  groupId,
  members,
  balances,
  expenseCounts,
  callerMembership,
  currentUserId,
}: ManageMembersClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [newMemberName, setNewMemberName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAddVirtual = () => {
    if (!newMemberName.trim()) return;

    setError(null);
    startTransition(async () => {
      const result = await addVirtualMember(groupId, newMemberName.trim());

      if (result.success) {
        setNewMemberName("");
        router.refresh();
      } else {
        setError(result.error ?? "Failed to add member");
      }
    });
  };

  return (
    <div className="space-y-8">
      <SectionContainer>
        <h2 className="mb-4 text-lg font-semibold">Add Virtual Member</h2>
        <p className="mb-4 text-sm text-gray-600">
          For friends who won&apos;t use their own device.
        </p>
        <div className="flex gap-2">
          <Input
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            placeholder="Friend's name"
            disabled={isPending}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddVirtual();
            }}
          />
          <Button
            type="button"
            onClick={handleAddVirtual}
            disabled={isPending || !newMemberName.trim()}
          >
            <CirclePlus className="size-4" />
            Add
          </Button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </SectionContainer>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Members</h2>
        <MemberManagementList
          groupId={groupId}
          members={members}
          balances={balances}
          expenseCounts={expenseCounts}
          callerMembership={callerMembership}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}

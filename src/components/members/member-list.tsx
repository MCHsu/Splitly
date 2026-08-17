"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { deleteMember } from "@/app/actions/member.action";
import { MemberRow } from "@/components/members/member-row";
import { SectionContainer } from "@/components/shared/section-container";
import { StatusMessage } from "@/components/shared/status-message";
import type { GroupMemberWithUser } from "@/lib/member";

interface MemberListProps {
  groupId: string;
  members: GroupMemberWithUser[];
  hasFinancialRecords: Record<string, boolean>;
  callerMembership: GroupMemberWithUser;
  currentUserId: string;
}

function sortMembers(
  members: GroupMemberWithUser[],
  currentUserId: string,
): GroupMemberWithUser[] {
  return [...members].sort((a, b) => {
    if (a.userId === currentUserId) return -1;
    if (b.userId === currentUserId) return 1;
    return a.name.localeCompare(b.name);
  });
}

export function MemberList({
  groupId,
  members,
  hasFinancialRecords,
  callerMembership,
  currentUserId,
}: MemberListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isOwner = callerMembership.role === "OWNER";
  const sorted = sortMembers(members, currentUserId);

  const handleDelete = (memberId: string) => {
    setError(null);
    startTransition(async () => {
      const result = await deleteMember(groupId, memberId);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error ?? "Failed to delete member");
      }
    });
  };

  return (
    <div className="space-y-4">
      {error && <StatusMessage tone="error">{error}</StatusMessage>}

      <SectionContainer className="divide-y p-0">
        {sorted.map((member) => {
          const isSelf = member.userId === currentUserId;
          const canDelete =
            isOwner && member.role !== "OWNER" && !isSelf;

          return (
            <MemberRow
              key={member.id}
              member={member}
              isSelf={isSelf}
              canDelete={canDelete}
              hasFinancialRecords={hasFinancialRecords[member.id] ?? false}
              isPending={isPending}
              onDelete={() => handleDelete(member.id)}
            />
          );
        })}
      </SectionContainer>
    </div>
  );
}

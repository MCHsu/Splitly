"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, UserMinus, LogOut } from "lucide-react";
import { UserAvatar } from "@/components/shared/user-avatar";
import {
  SectionContainer,
  SectionContainerItem,
} from "@/components/shared/section-container";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  deleteMember,
  deactivateMember,
  leaveGroup,
} from "@/app/actions/member.action";
import type { GroupMemberWithUser } from "@/lib/member";
import { cn } from "@/lib/utils";
import { useGroup } from "@/providers/group-provider";

interface MemberManagementListProps {
  groupId: string;
  members: GroupMemberWithUser[];
  balances: Record<string, number>;
  expenseCounts: Record<string, number>;
  callerMembership: GroupMemberWithUser;
  currentUserId: string;
}

export function MemberManagementList({
  groupId,
  members,
  balances,
  expenseCounts,
  callerMembership,
  currentUserId,
}: MemberManagementListProps) {
  const router = useRouter();
  const { currency } = useGroup();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isOwner = callerMembership.role === "OWNER";

  const handleAction = (
    action: () => Promise<{
      success: boolean;
      error?: string;
      groupId?: string;
    }>,
  ) => {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error ?? "Action failed");
      }
    });
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <SectionContainer className="divide-y">
        {members.map((member) => {
          const balance = balances[member.id] ?? 0;
          const expenseCount = expenseCounts[member.id] ?? 0;
          const isSelf = member.userId === currentUserId;
          const canDelete = expenseCount === 0;
          const canDeactivateOrLeave = balance === 0;
          const isVirtual = member.userId === null;

          return (
            <SectionContainerItem
              key={member.id}
              className={cn(
                "flex items-center justify-between gap-4",
                !member.isActive && "opacity-60",
              )}
            >
              <div className="flex min-w-0 items-center gap-3">
                <UserAvatar name={member.name} size="w-10 h-10" />
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {member.name}
                    {!member.isActive && (
                      <span className="ml-2 text-xs font-normal text-gray-500">
                        (Inactive)
                      </span>
                    )}
                    {isSelf && (
                      <span className="ml-2 text-xs font-normal text-blue-600">
                        (You)
                      </span>
                    )}
                    {isVirtual && (
                      <span className="ml-2 text-xs font-normal text-gray-400">
                        (Virtual)
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    {member.role === "OWNER" ? "Owner" : "Member"}
                  </p>
                </div>
              </div>

              {member.isActive && !isSelf && (
                <div className="flex shrink-0 gap-2">
                  {canDelete ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isPending}
                      onClick={() =>
                        handleAction(() => deleteMember(groupId, member.id))
                      }
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </Button>
                  ) : isOwner ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isPending || !canDeactivateOrLeave}
                            onClick={() =>
                              handleAction(() =>
                                deactivateMember(groupId, member.id),
                              )
                            }
                          >
                            <UserMinus className="size-4" />
                            Deactivate
                          </Button>
                        </span>
                      </TooltipTrigger>
                      {!canDeactivateOrLeave && (
                        <TooltipContent>Settle balance first</TooltipContent>
                      )}
                    </Tooltip>
                  ) : null}
                </div>
              )}

              {member.isActive && isSelf && member.role !== "OWNER" && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isPending || !canDeactivateOrLeave}
                        onClick={() => handleAction(() => leaveGroup(groupId))}
                      >
                        <LogOut className="size-4" />
                        Leave
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {!canDeactivateOrLeave && (
                    <TooltipContent>Settle balance first</TooltipContent>
                  )}
                </Tooltip>
              )}
            </SectionContainerItem>
          );
        })}
      </SectionContainer>
    </div>
  );
}

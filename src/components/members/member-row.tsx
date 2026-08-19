"use client";

import { Trash2 } from "lucide-react";

import {
  getMemberDisplayName,
  getMemberKind,
  MEMBER_KIND_ICON,
  MEMBER_KIND_LABEL,
  type GroupMemberWithUser,
} from "@/lib/member";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/user-avatar";
import { SectionContainerItem } from "@/components/shared/section-container";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MemberRowProps {
  member: GroupMemberWithUser;
  isSelf: boolean;
  canDelete: boolean;
  hasFinancialRecords: boolean;
  isPending: boolean;
  onDelete: () => void;
}

export function MemberRow({
  member,
  isSelf,
  canDelete,
  hasFinancialRecords,
  isPending,
  onDelete,
}: MemberRowProps) {
  const kind = getMemberKind(member);
  const KindIcon = MEMBER_KIND_ICON[kind];
  const displayName = getMemberDisplayName(member);
  const deleteBlocked = hasFinancialRecords;

  return (
    <SectionContainerItem
      className={cn(
        "flex items-center justify-between gap-4",
        !member.isActive && "opacity-60",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <UserAvatar name={displayName} size="lg" />
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 truncate font-medium">
            <span className="truncate">
              {displayName}
              {isSelf && (
                <span className="ml-1.5 text-xs text-primary">(You)</span>
              )}
            </span>
            {KindIcon && (
              <KindIcon className="size-4 shrink-0 text-muted-foreground" />
            )}
          </p>
          {kind === "owner" && (
            <span className="mt-0.5 inline-flex rounded-lg bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
              {MEMBER_KIND_LABEL.owner}
            </span>
          )}
          {kind === "linked" && (
            <span className="mt-0.5 inline-flex rounded-lg bg-success/10 px-1.5 py-0.5 text-xs font-medium text-success">
              {MEMBER_KIND_LABEL.linked}
            </span>
          )}
          {kind === "anonymous" && (
            <span className="mt-0.5 inline-flex rounded-lg bg-muted-foreground/10 px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
              {MEMBER_KIND_LABEL.anonymous}
            </span>
          )}
          {kind === "unclaimed" && (
            <span className="text-xs font-medium text-muted-foreground">
              {MEMBER_KIND_LABEL.unclaimed}
            </span>
          )}
        </div>
      </div>

      {canDelete && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                variant="ghost"
                size="icon"
                disabled={isPending || deleteBlocked}
                onClick={onDelete}
                className={cn(deleteBlocked && "opacity-40")}
                aria-label={`Delete ${displayName}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </span>
          </TooltipTrigger>
          {deleteBlocked && (
            <TooltipContent>
              Can&apos;t delete a member with expenses or settlements
            </TooltipContent>
          )}
        </Tooltip>
      )}
    </SectionContainerItem>
  );
}

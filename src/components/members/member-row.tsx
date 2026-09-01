"use client";

import type { LucideIcon } from "lucide-react";
import { BadgeCheck, BadgeQuestionMark, Trash2 } from "lucide-react";

import {
  getMemberKind,
  MEMBER_KIND_LABEL,
  type MemberKind,
} from "@/lib/domain/member";
import type { GroupMemberWithUser } from "@/types/member";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PILL_CLASS =
  "mt-0.5 inline-flex rounded-lg px-1.5 py-0.5 text-xs font-medium";

const MEMBER_KIND_ICON: Partial<Record<MemberKind, LucideIcon>> = {
  owner: BadgeCheck,
  linked: BadgeCheck,
  anonymous: BadgeQuestionMark,
};

const MEMBER_KIND_BADGE_CLASS: Record<MemberKind, string> = {
  owner: cn(PILL_CLASS, "bg-primary/10 text-primary"),
  linked: cn(PILL_CLASS, "bg-success/10 text-success"),
  anonymous: cn(PILL_CLASS, "bg-muted-foreground/10 text-muted-foreground"),
  unclaimed: "text-xs font-medium text-muted-foreground",
};

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
  const displayName = member.name;

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <UserAvatar name={displayName} size="lg" />
        <div className="min-w-0">
          <p className="flex min-w-0 items-center gap-1.5 font-medium">
            <span className="truncate">{displayName}</span>
            {isSelf ? (
              <span className="shrink-0 text-xs text-primary">(You)</span>
            ) : null}
          </p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span
              className={cn(
                "inline-flex items-center gap-1",
                MEMBER_KIND_BADGE_CLASS[kind],
              )}
            >
              {KindIcon ? <KindIcon className="size-3 shrink-0" /> : null}
              {MEMBER_KIND_LABEL[kind]}
            </span>
          </div>
        </div>
      </div>

      {canDelete && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                variant="ghost"
                size="icon-lg"
                disabled={isPending || hasFinancialRecords}
                onClick={onDelete}
                className={cn(
                  hasFinancialRecords
                    ? "text-muted-foreground"
                    : "text-destructive",
                )}
                aria-label={
                  hasFinancialRecords
                    ? `Can't delete ${displayName}: has expenses or settlements`
                    : `Delete ${displayName}`
                }
              >
                <Trash2 className="size-5" />
              </Button>
            </span>
          </TooltipTrigger>

          {hasFinancialRecords ? (
            <TooltipContent>
              Can't delete a member with expenses or settlements
            </TooltipContent>
          ) : null}
        </Tooltip>
      )}
    </div>
  );
}

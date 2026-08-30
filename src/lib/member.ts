import type { LucideIcon } from "lucide-react";
import { BadgeCheck, BadgeQuestionMark } from "lucide-react";

import type { GroupMemberWithUser } from "@/types/member";

export type { GroupMemberWithUser };

export type MemberKind = "owner" | "linked" | "anonymous" | "unclaimed";

export const getMemberDisplayName = (member: GroupMemberWithUser) => {
  if (member.user && !member.user.isAnonymous) {
    return member.user.name;
  }

  return member.name;
};

export function getMemberKind(member: GroupMemberWithUser): MemberKind {
  if (member.role === "OWNER") {
    return "owner";
  }

  if (member.userId == null) {
    return "unclaimed";
  }

  if (member.user?.isAnonymous) {
    return "anonymous";
  }

  return "linked";
}

export const MEMBER_KIND_LABEL: Record<MemberKind, string> = {
  owner: "Owner",
  linked: "Linked account",
  anonymous: "Anonymous",
  unclaimed: "Not joined",
};

export const MEMBER_KIND_ICON: Partial<Record<MemberKind, LucideIcon>> = {
  owner: BadgeCheck,
  linked: BadgeCheck,
  anonymous: BadgeQuestionMark,
};

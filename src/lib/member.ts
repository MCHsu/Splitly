import type { GroupMemberWithUser } from "@/types/member";

export type { GroupMemberWithUser };

export const getMemberDisplayName = (member: GroupMemberWithUser) =>
  member.user?.name ?? member.name;

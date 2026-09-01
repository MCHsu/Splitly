import type { GroupMemberWithUser } from "@/types/member";

type SortableMember = Pick<GroupMemberWithUser, "id" | "userId" | "createdAt">;

/** Current user first, then by createdAt ascending, then id as tiebreaker. */
export function sortGroupMembers<T extends SortableMember>(
  members: T[],
  currentUserId: string | null | undefined,
): T[] {
  return [...members].sort((a, b) => {
    if (currentUserId) {
      if (a.userId === currentUserId) return -1;
      if (b.userId === currentUserId) return 1;
    }

    const createdAtDiff = a.createdAt.getTime() - b.createdAt.getTime();
    if (createdAtDiff !== 0) return createdAtDiff;

    return a.id.localeCompare(b.id);
  });
}

export type MemberKind = "owner" | "linked" | "anonymous" | "unclaimed";

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
  linked: "Verified",
  anonymous: "Guest",
  unclaimed: "Invited",
};

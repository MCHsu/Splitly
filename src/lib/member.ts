import { Prisma } from "@/generated/prisma/client";

export type GroupMemberWithUser = Prisma.GroupMemberGetPayload<{
  include: { user: true };
}>;

export const getMemberDisplayName = (member: GroupMemberWithUser) =>
  member.user?.name ?? member.name;

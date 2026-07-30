import type { Prisma } from "@/generated/prisma/client";

export type GroupMemberWithUser = Prisma.GroupMemberGetPayload<{
  include: { user: true };
}>;

/** Member fields needed on expense payment/share rows in UI. */
export type ExpensePartyMember = Pick<
  GroupMemberWithUser,
  "id" | "name" | "isActive" | "userId"
>;

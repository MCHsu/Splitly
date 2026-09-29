import type { GroupMemberRole, SplitMethod } from "@/generated/prisma/client";
import type { LinkedUser } from "./users";

export type MemberSeed = {
  id: string;
  name: string;
  role: GroupMemberRole;
  linkedUser?: LinkedUser;
};

export type ExpenseShareSeed = {
  memberId: string;
  amountInCents: number;
};

export type ExpenseSeed = {
  description: string;
  amountInCents: number;
  date: Date;
  note?: string;
  category: string;
  splitMethod: SplitMethod;
  paidByMemberId: string;
  shares: ExpenseShareSeed[];
};

export type GroupSeed = {
  id: string;
  name: string;
  description?: string;
  currency: string;
  members: MemberSeed[];
  expenses: ExpenseSeed[];
};

export function equalShares(
  amountInCents: number,
  memberIds: string[],
): ExpenseShareSeed[] {
  const perPerson = Math.floor(amountInCents / memberIds.length);
  const remainder = amountInCents - perPerson * memberIds.length;

  return memberIds.map((memberId, index) => ({
    memberId,
    amountInCents: perPerson + (index === 0 ? remainder : 0),
  }));
}

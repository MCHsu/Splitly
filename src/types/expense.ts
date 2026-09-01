import type { SplitMethod } from "@/generated/prisma/enums";
import type { ExpensePartyMember } from "@/types/member";

export type ExpensePartyLine = {
  amountInCents: number;
  member: ExpensePartyMember;
};

export type ExpenseAllocationInput = {
  amountInCents: number;
  memberId: string;
};

type ExpenseCore = {
  description: string;
  amountInCents: number;
  date: Date;
  category: string;
};

export type ExpenseListItem = ExpenseCore & {
  id: string;
  payments: ExpensePartyLine[];
  shares: ExpensePartyLine[];
};

export type ExpenseDetailData = ExpenseCore & {
  note?: string | null;
  createdAt: Date;
  updatedAt: Date;
  payments: ExpensePartyLine[];
  shares: ExpensePartyLine[];
};

export type ExpenseForForm = ExpenseCore & {
  note?: string | null;
  splitMethod: SplitMethod;
  payments: ExpenseAllocationInput[];
  shares: ExpenseAllocationInput[];
};

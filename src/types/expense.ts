import type { SplitMethod } from "@/generated/prisma/enums";
import type { ExpensePartyMember } from "@/types/member";

export type { SplitMethod };

export type ExpensePaymentWithMember = {
  amountInCents: number;
  member: ExpensePartyMember;
};

export type ExpenseShareWithMember = {
  amountInCents: number;
  member: ExpensePartyMember;
};

export type ExpenseListItem = {
  id: string;
  date: Date;
  description: string;
  amountInCents: number;
  category?: string | null;
  payments?: ExpensePaymentWithMember[];
  shares?: ExpenseShareWithMember[];
};

export type ExpenseDetailData = {
  description: string;
  amountInCents: number;
  date: Date;
  category: string | null;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
  payments: ExpensePaymentWithMember[];
  shares: ExpenseShareWithMember[];
};

export type ExpenseForForm = {
  description: string;
  amountInCents: number;
  date: Date;
  category: string | null;
  note: string | null;
  splitMethod: SplitMethod;
  payments: { amountInCents: number; memberId: string }[];
  shares: { amountInCents: number; memberId: string }[];
};

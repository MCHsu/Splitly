import { cache } from "react";
import prisma from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/queries/auth.query";

export const getExpenseById = cache(async (expenseId: string) => {
  const currentUserId = await getCurrentUserId();
  if (!currentUserId) return null;

  return prisma.expense.findFirst({
    where: {
      id: expenseId,
      deletedAt: null,
      group: {
        members: {
          some: { userId: currentUserId, isActive: true },
        },
      },
    },
    include: {
      group: { select: { id: true, name: true, currency: true } },
      payments: { include: { member: { include: { user: true } } } },
      shares: { include: { member: { include: { user: true } } } },
    },
  });
});

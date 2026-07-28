"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { handleError } from "@/lib/utils";
import { ExpenseFormData, expenseFormSchema } from "@/lib/validations/expense";
import { getCurrentUserId } from "@/app/actions/auth.action";
import { toExpenseWriteData } from "@/lib/expense-form-values";

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

export async function createExpense(
  groupId: string,
  formData: ExpenseFormData,
) {
  const validation = expenseFormSchema.safeParse(formData);

  if (!validation.success) {
    return { success: false, errors: validation.error };
  }

  const currentUserId = await getCurrentUserId();
  if (!currentUserId) {
    throw new Error("User must be authenticated to create an expense");
  }

  const { description, date, category, note, splitMethod } = validation.data;
  const { amountInCents, payments, shares } = toExpenseWriteData(
    validation.data,
  );

  try {
    await prisma.expense.create({
      data: {
        description,
        amountInCents,
        date,
        category: category || null,
        note,
        groupId,
        splitMethod,
        createdById: currentUserId,
        updatedById: currentUserId,
        payments: {
          create: payments.map((p) => ({
            amountInCents: p.amountInCents,
            memberId: p.memberId,
          })),
        },
        shares: {
          create: shares.map((s) => ({
            amountInCents: s.amountInCents,
            memberId: s.memberId,
          })),
        },
      },
    });

    revalidatePath(`/groups/${groupId}`);
    revalidatePath(`/groups/${groupId}/expenses`);
    return { success: true };
  } catch (error) {
    handleError(error);
    return { success: false, error: "Failed to create expense" };
  }
}

export async function updateExpense(
  expenseId: string,
  formData: ExpenseFormData,
) {
  const validation = expenseFormSchema.safeParse(formData);

  if (!validation.success) {
    return { success: false as const, errors: validation.error };
  }

  const currentUserId = await getCurrentUserId();
  if (!currentUserId) {
    throw new Error("User must be authenticated to update an expense");
  }

  const existing = await prisma.expense.findFirst({
    where: {
      id: expenseId,
      deletedAt: null,
      group: {
        members: {
          some: { userId: currentUserId, isActive: true },
        },
      },
    },
    select: { id: true, groupId: true },
  });

  if (!existing) {
    return { success: false as const, error: "Expense not found" };
  }

  const { description, date, category, note, splitMethod } = validation.data;
  const { amountInCents, payments, shares } = toExpenseWriteData(
    validation.data,
  );

  try {
    await prisma.$transaction(async (tx) => {
      await tx.expensePayment.deleteMany({ where: { expenseId } });
      await tx.expenseShare.deleteMany({ where: { expenseId } });

      await tx.expense.update({
        where: { id: expenseId },
        data: {
          description,
          amountInCents,
          date,
          category: category || null,
          note,
          splitMethod,
          updatedById: currentUserId,
          payments: {
            create: payments.map((p) => ({
              amountInCents: p.amountInCents,
              memberId: p.memberId,
            })),
          },
          shares: {
            create: shares.map((s) => ({
              amountInCents: s.amountInCents,
              memberId: s.memberId,
            })),
          },
        },
      });
    });

    const groupId = existing.groupId;
    revalidatePath(`/groups/${groupId}`);
    revalidatePath(`/groups/${groupId}/expenses`);
    revalidatePath(`/groups/${groupId}/expenses/${expenseId}`);
    return { success: true as const };
  } catch (error) {
    handleError(error);
    return { success: false as const, error: "Failed to update expense" };
  }
}

export async function getAllExpensesForGroup(groupId: string) {
  try {
    const expenses = await prisma.expense.findMany({
      where: {
        groupId: groupId,
        deletedAt: null,
      },
      include: {
        payments: {
          include: {
            member: {
              select: {
                id: true,
                name: true,
                userId: true,
              },
            },
          },
        },
        shares: {
          include: {
            member: {
              select: {
                id: true,
                name: true,
                userId: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return { success: true, data: expenses };
  } catch (error) {
    handleError(error);
    return { success: false, error: "Failed to fetch expenses" };
  }
}

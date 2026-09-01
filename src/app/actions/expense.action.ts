"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { handleError } from "@/lib/utils";
import { ExpenseFormData, expenseFormSchema } from "@/lib/validations/expense";
import { getCurrentUserId } from "@/lib/queries/auth.query";
import { toExpenseWriteData } from "@/lib/domain/expense-form-values";

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
        category,
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
  } catch (error) {
    handleError(error);
    return { success: false, error: "Failed to create expense" };
  }

  redirect(`/groups/${groupId}/expenses`);
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
    await prisma.$transaction(async (transaction) => {
      await transaction.expensePayment.deleteMany({ where: { expenseId } });
      await transaction.expenseShare.deleteMany({ where: { expenseId } });

      await transaction.expense.update({
        where: { id: expenseId },
        data: {
          description,
          amountInCents,
          date,
          category,
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
  } catch (error) {
    handleError(error);
    return { success: false as const, error: "Failed to update expense" };
  }

  redirect(`/groups/${existing.groupId}/expenses/${expenseId}`);
}

export async function deleteExpense(expenseId: string) {
  const currentUserId = await getCurrentUserId();
  if (!currentUserId) {
    throw new Error("User must be authenticated to delete an expense");
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

  try {
    await prisma.expense.update({
      where: { id: expenseId },
      data: {
        deletedAt: new Date(),
        updatedById: currentUserId,
      },
    });

    revalidatePath(`/groups/${existing.groupId}`);
    revalidatePath(`/groups/${existing.groupId}/expenses`);
  } catch (error) {
    handleError(error);
    return { success: false as const, error: "Failed to delete expense" };
  }

  redirect(`/groups/${existing.groupId}/expenses`);
}

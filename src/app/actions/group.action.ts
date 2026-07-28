"use server";

import { cache } from "react";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { groupFormSchema, GroupFormData } from "@/lib/validations/group";
import { handleError } from "@/lib/utils";
import { getCurrentUserId, getCurrentUser } from "@/app/actions/auth.action";

type AllGroupsData = Prisma.GroupGetPayload<{
  select: {
    id: true;
    name: true;
    description: true;
    updatedAt: true;
    _count: {
      select: {
        expenses: true;
        members: true;
      };
    };
  };
}>;

export type GroupDetailsData = Prisma.GroupGetPayload<{
  include: {
    members: {
      include: { user: true };
    };
    expenses: {
      include: {
        payments: {
          include: { member: true };
        };
        shares: {
          include: { member: true };
        };
      };
    };
    settlements: true;
  };
}>;

export async function createGroup(formData: GroupFormData) {
  const validation = groupFormSchema.safeParse(formData);

  if (!validation.success) {
    return { success: false, errors: validation.error };
  }

  const { name, description, currency } = validation.data;

  let newGroupId: string | undefined;

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("User must be authenticated to create a group");
  }

  const currentUserId = currentUser.id;
  const currentUserName = currentUser.name;

  try {
    const newGroup = await prisma.group.create({
      data: {
        name,
        description,
        currency,
        createdById: currentUserId,
        updatedById: currentUserId,
        members: {
          create: {
            userId: currentUserId,
            name: currentUserName,
            role: "OWNER",
            isActive: true,
            createdById: currentUserId,
            updatedById: currentUserId,
          },
        },
      },
      select: { id: true },
    });

    newGroupId = newGroup.id;

    revalidatePath("/groups");
  } catch (error) {
    handleError(error);
  }

  if (newGroupId) {
    redirect(`/groups/${newGroupId}/members`);
  }
}

export async function getAllGroups(): Promise<AllGroupsData[]> {
  const currentUserId = await getCurrentUserId();

  try {
    const groups = await prisma.group.findMany({
      where: {
        members: {
          some: {
            userId: currentUserId,
            isActive: true,
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        updatedAt: true,
        _count: {
          select: {
            expenses: true,
            members: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return groups;
  } catch (error) {
    handleError(error);
    return [];
  }
}

export const getGroupById = cache(
  async (groupId: string): Promise<GroupDetailsData | null> => {
    try {
      const currentUserId = await getCurrentUserId();

      const group = await prisma.group.findFirst({
        where: {
          id: groupId,
          members: {
            some: {
              userId: currentUserId,
              isActive: true,
            },
          },
        },
        include: {
          members: {
            include: { user: true },
            orderBy: [{ isActive: "desc" }, { name: "asc" }],
          },
          expenses: {
            orderBy: { date: "desc" },
            take: 20,
            include: {
              payments: {
                include: { member: true },
              },
              shares: {
                include: { member: true },
              },
            },
          },
          settlements: true,
        },
      });
      return group;
    } catch (error) {
      handleError(error);
      return null;
    }
  },
);

export async function updateGroup(groupId: string, formData: GroupFormData) {
  const validation = groupFormSchema.safeParse(formData);

  if (!validation.success) {
    return { success: false as const, errors: validation.error };
  }

  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    throw new Error("User must be authenticated to update a group");
  }

  const { name, description, currency } = validation.data;

  try {
    const membership = await prisma.groupMember.findFirst({
      where: {
        groupId,
        userId: currentUserId,
        isActive: true,
      },
      select: { id: true },
    });

    if (!membership) {
      return { success: false as const, error: "Not a group member" };
    }

    await prisma.group.update({
      where: { id: groupId },
      data: {
        name,
        description,
        currency,
        updatedById: currentUserId,
      },
    });

    revalidatePath("/groups");
    revalidatePath(`/groups/${groupId}`);
    revalidatePath(`/groups/${groupId}/group`);
    revalidatePath(`/groups/${groupId}/expenses`);

    return { success: true as const };
  } catch (error) {
    handleError(error);
    return { success: false as const, error: "Failed to update group" };
  }
}

export async function getGroupStats(groupId: string) {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    return { totalGroupSpend: 0, yourShare: 0 };
  }

  try {
    const expenses = await prisma.expense.findMany({
      where: { groupId },
      select: { amountInCents: true },
    });

    const shares = await prisma.expenseShare.findMany({
      where: {
        expense: { groupId },
        member: { userId: currentUserId, isActive: true },
      },
      select: { amountInCents: true },
    });

    const totalGroupSpend = expenses.reduce(
      (sum, e) => sum + e.amountInCents,
      0,
    );
    const yourShare = shares.reduce((sum, s) => sum + s.amountInCents, 0);

    return { totalGroupSpend, yourShare };
  } catch (error) {
    handleError(error);
    return { totalGroupSpend: 0, yourShare: 0 };
  }
}

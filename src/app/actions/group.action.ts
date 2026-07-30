"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { groupFormSchema, GroupFormData } from "@/lib/validations/group";
import { handleError } from "@/lib/utils";
import { getCurrentUserId, getCurrentUser } from "@/lib/queries/auth.query";

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

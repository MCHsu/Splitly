"use server";

import prisma from "@/lib/prisma";
import { GroupMember } from "@/generated/prisma/client";
import { revalidatePath, refresh } from "next/cache";
import {
  memberFormSchema,
  MemberFormData,
  joinGroupSchema,
  addVirtualMemberSchema,
} from "@/lib/validations/member";
import { handleError } from "@/lib/utils";
import { getCurrentUserId } from "@/lib/queries/auth.query";
import { getMemberLedger } from "@/lib/ledger";

type ActionResult = {
  success: boolean;
  error?: string;
  groupId?: string;
};

async function getActiveMembership(groupId: string, userId: string) {
  return prisma.groupMember.findFirst({
    where: { groupId, userId, isActive: true },
  });
}

async function requireActiveMembership(
  groupId: string,
  userId: string,
): Promise<GroupMember | null> {
  const membership = await getActiveMembership(groupId, userId);
  return membership;
}

export async function joinGroup(
  inviteCode: string,
  memberId: string,
): Promise<ActionResult> {
  const validation = joinGroupSchema.safeParse({ inviteCode, memberId });

  if (!validation.success) {
    return { success: false, error: "Invalid input" };
  }

  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    return { success: false, error: "You must be signed in to join a group" };
  }

  try {
    const group = await prisma.group.findUnique({
      where: { inviteCode: validation.data.inviteCode },
      select: { id: true },
    });

    if (!group) {
      return { success: false, error: "Invalid invite code" };
    }

    const existing = await prisma.groupMember.findFirst({
      where: { groupId: group.id, userId: currentUserId },
    });

    if (existing) {
      if (existing.isActive) {
        return { success: true, groupId: group.id };
      }

      await prisma.groupMember.update({
        where: { id: existing.id },
        data: {
          isActive: true,
          updatedById: currentUserId,
        },
      });

      revalidatePath(`/groups/${group.id}`);
      revalidatePath("/groups");

      return { success: true, groupId: group.id };
    }

    const claimed = await prisma.groupMember.updateMany({
      where: {
        id: validation.data.memberId,
        groupId: group.id,
        userId: null,
        isActive: true,
      },
      data: {
        userId: currentUserId,
        updatedById: currentUserId,
      },
    });

    if (claimed.count === 0) {
      return { success: false, error: "This name is no longer available" };
    }

    revalidatePath(`/groups/${group.id}`);
    revalidatePath("/groups");

    return { success: true, groupId: group.id };
  } catch (error) {
    handleError(error);
    return { success: false, error: "Failed to join group" };
  }
}

export async function addVirtualMember(
  groupId: string,
  name: string,
): Promise<ActionResult> {
  const validation = addVirtualMemberSchema.safeParse({ groupId, name });

  if (!validation.success) {
    return { success: false, error: "Invalid input" };
  }

  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    return { success: false, error: "You must be signed in" };
  }

  const membership = await requireActiveMembership(groupId, currentUserId);

  if (!membership || membership.role !== "OWNER") {
    return { success: false, error: "Only the group owner can add members" };
  }

  try {
    await prisma.groupMember.create({
      data: {
        groupId,
        userId: null,
        name: validation.data.name,
        role: "MEMBER",
        isActive: true,
        createdById: currentUserId,
        updatedById: currentUserId,
      },
    });

    revalidatePath(`/groups/${groupId}`);
    refresh();

    return { success: true, groupId };
  } catch (error) {
    handleError(error);
    return { success: false, error: "Failed to add virtual member" };
  }
}

export async function deleteMember(
  groupId: string,
  memberId: string,
): Promise<ActionResult> {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    return { success: false, error: "You must be signed in" };
  }

  const membership = await requireActiveMembership(groupId, currentUserId);

  if (!membership || membership.role !== "OWNER") {
    return { success: false, error: "Only the group owner can delete members" };
  }

  const target = await prisma.groupMember.findFirst({
    where: { id: memberId, groupId },
  });

  if (!target) {
    return { success: false, error: "Member not found" };
  }

  if (target.role === "OWNER") {
    return { success: false, error: "Cannot delete the group owner" };
  }

  const ledger = await getMemberLedger(memberId);

  if (ledger.expenseRecordCount > 0 || ledger.settlementCount > 0) {
    return {
      success: false,
      error: "Cannot delete member with linked expenses or settlements",
    };
  }

  try {
    await prisma.groupMember.delete({ where: { id: memberId } });

    revalidatePath(`/groups/${groupId}`);
    refresh();

    return { success: true, groupId };
  } catch (error) {
    handleError(error);
    return { success: false, error: "Failed to delete member" };
  }
}

export async function deactivateMember(
  groupId: string,
  memberId: string,
): Promise<ActionResult> {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    return { success: false, error: "You must be signed in" };
  }

  const callerMembership = await requireActiveMembership(
    groupId,
    currentUserId,
  );

  if (!callerMembership || callerMembership.role !== "OWNER") {
    return { success: false, error: "Only the group owner can deactivate members" };
  }

  const target = await prisma.groupMember.findFirst({
    where: { id: memberId, groupId, isActive: true },
  });

  if (!target) {
    return { success: false, error: "Member not found" };
  }

  if (target.role === "OWNER") {
    return { success: false, error: "Cannot deactivate the group owner" };
  }

  const ledger = await getMemberLedger(memberId);

  if (ledger.balanceInCents !== 0) {
    return {
      success: false,
      error: "Member must have a zero balance before deactivation",
    };
  }

  try {
    await prisma.groupMember.update({
      where: { id: memberId },
      data: { isActive: false, updatedById: currentUserId },
    });

    revalidatePath(`/groups/${groupId}`);
    refresh();

    return { success: true, groupId };
  } catch (error) {
    handleError(error);
    return { success: false, error: "Failed to deactivate member" };
  }
}

export async function leaveGroup(groupId: string): Promise<ActionResult> {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    return { success: false, error: "You must be signed in" };
  }

  const membership = await prisma.groupMember.findFirst({
    where: { groupId, userId: currentUserId, isActive: true },
  });

  if (!membership) {
    return { success: false, error: "You are not an active member of this group" };
  }

  if (membership.role === "OWNER") {
    return {
      success: false,
      error: "Group owner cannot leave. Transfer ownership or deactivate the group first.",
    };
  }

  const ledger = await getMemberLedger(membership.id);

  if (ledger.balanceInCents !== 0) {
    return {
      success: false,
      error: "You must have a zero balance before leaving",
    };
  }

  try {
    await prisma.groupMember.update({
      where: { id: membership.id },
      data: { isActive: false, updatedById: currentUserId },
    });

    revalidatePath(`/groups/${groupId}`);
    revalidatePath("/groups");
    refresh();

    return { success: true, groupId };
  } catch (error) {
    handleError(error);
    return { success: false, error: "Failed to leave group" };
  }
}

export async function updateGroupMembers(
  groupId: string,
  formData: MemberFormData,
) {
  const validation = memberFormSchema.safeParse(formData);

  if (!validation.success) {
    return { success: false, errors: validation.error };
  }

  const { members } = validation.data;

  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    throw new Error("User must be authenticated to manage members");
  }

  const membership = await requireActiveMembership(groupId, currentUserId);

  if (!membership) {
    return { success: false, error: "You are not an active member of this group" };
  }

  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      return { success: false, error: "Group not found" };
    }

    const newMembers = members.filter((m) => !m.id);

    if (newMembers.length > 0) {
      await prisma.groupMember.createMany({
        data: newMembers.map((member) => ({
          name: member.name,
          groupId,
          userId: null,
          isActive: true,
          createdById: currentUserId,
          updatedById: currentUserId,
        })),
      });
    }

    revalidatePath(`/groups/${groupId}`);
    refresh();

    return { success: true };
  } catch (error) {
    handleError(error);
    return { success: false, error: "Failed to add members" };
  }
}

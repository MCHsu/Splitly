import type { PrismaClient } from "@/generated/prisma/client";
import type { GroupSeed } from "./types";
import type { SeedUserIds } from "./users";

function getOwnerUserId(group: GroupSeed, userIds: SeedUserIds): string {
  const owner = group.members.find((member) => member.role === "OWNER");
  if (!owner?.linkedUser) {
    throw new Error(
      `Group "${group.name}" is missing an owner with linkedUser.`,
    );
  }

  return userIds[owner.linkedUser];
}

export async function seedGroup(
  prisma: PrismaClient,
  group: GroupSeed,
  userIds: SeedUserIds,
) {
  const ownerUserId = getOwnerUserId(group, userIds);

  await prisma.group.create({
    data: {
      id: group.id,
      name: group.name,
      description: group.description,
      currency: group.currency,
      createdById: ownerUserId,
      updatedById: ownerUserId,
    },
  });

  await prisma.groupMember.createMany({
    data: group.members.map((member) => ({
      id: member.id,
      name: member.name,
      role: member.role,
      groupId: group.id,
      userId: member.linkedUser ? userIds[member.linkedUser] : null,
      createdById: ownerUserId,
      updatedById: ownerUserId,
    })),
  });

  for (const expense of group.expenses) {
    await prisma.expense.create({
      data: {
        description: expense.description,
        amountInCents: expense.amountInCents,
        date: expense.date,
        note: expense.note,
        category: expense.category,
        splitMethod: expense.splitMethod,
        groupId: group.id,
        createdById: ownerUserId,
        updatedById: ownerUserId,
        payments: {
          create: {
            memberId: expense.paidByMemberId,
            amountInCents: expense.amountInCents,
          },
        },
        shares: {
          create: expense.shares.map((share) => ({
            memberId: share.memberId,
            amountInCents: share.amountInCents,
          })),
        },
      },
    });
  }
}

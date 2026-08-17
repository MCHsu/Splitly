import prisma from "@/lib/prisma";
import { handleError } from "@/lib/utils";
import { getCurrentUserId } from "@/lib/queries/auth.query";
import { getGroupLedger } from "@/lib/ledger";

export async function getGroupByInviteCode(inviteCode: string) {
  try {
    const group = await prisma.group.findUnique({
      where: { inviteCode },
      select: { id: true, name: true, inviteCode: true },
    });

    return group;
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function getJoinPageData(inviteCode: string) {
  try {
    const group = await prisma.group.findUnique({
      where: { inviteCode },
      select: { id: true, name: true, inviteCode: true },
    });

    if (!group) {
      return null;
    }

    const currentUserId = await getCurrentUserId();

    if (currentUserId) {
      const existingMembership = await prisma.groupMember.findFirst({
        where: { groupId: group.id, userId: currentUserId, isActive: true },
        select: { id: true },
      });

      if (existingMembership) {
        return {
          group,
          unclaimedMembers: [] as { id: string; name: string }[],
          alreadyMember: true as const,
        };
      }
    }

    const unclaimedMembers = await prisma.groupMember.findMany({
      where: { groupId: group.id, userId: null, isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    return {
      group,
      unclaimedMembers,
      alreadyMember: false as const,
    };
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function getMemberManagementData(groupId: string) {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    return null;
  }

  const callerMembership = await prisma.groupMember.findFirst({
    where: { groupId, userId: currentUserId, isActive: true },
    include: { user: true },
  });

  if (!callerMembership) {
    return null;
  }

  const members = await prisma.groupMember.findMany({
    where: { groupId },
    include: { user: true },
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
  });

  const ledger = await getGroupLedger(groupId);

  const balances = new Map<string, number>();
  const expenseCounts = new Map<string, number>();

  for (const member of members) {
    const row = ledger.get(member.id);
    balances.set(member.id, row?.balanceInCents ?? 0);
    expenseCounts.set(member.id, row?.expenseRecordCount ?? 0);
  }

  return {
    members,
    balances: Object.fromEntries(balances),
    expenseCounts: Object.fromEntries(expenseCounts),
    callerMembership,
    currentUserId,
  };
}

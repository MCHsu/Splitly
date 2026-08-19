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
          isSignedIn: true as const,
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
      isSignedIn: Boolean(currentUserId),
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

  const [members, group] = await Promise.all([
    prisma.groupMember.findMany({
      where: { groupId },
      include: { user: true },
      orderBy: [{ isActive: "desc" }, { name: "asc" }],
    }),
    prisma.group.findUnique({
      where: { id: groupId },
      select: { inviteCode: true },
    }),
  ]);

  if (!group) {
    return null;
  }

  const ledger = await getGroupLedger(groupId);

  const hasFinancialRecords: Record<string, boolean> = {};

  for (const member of members) {
    const row = ledger.get(member.id);
    hasFinancialRecords[member.id] =
      (row?.expenseRecordCount ?? 0) > 0 || (row?.settlementCount ?? 0) > 0;
  }

  return {
    members,
    hasFinancialRecords,
    callerMembership,
    currentUserId,
    inviteCode: group.inviteCode,
  };
}

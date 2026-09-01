import "server-only";

import { cache } from "react";

import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { handleError } from "@/lib/utils";
import { sortGroupMembers } from "@/lib/domain/member";
import { getCurrentUserId } from "@/lib/queries/auth.query";
import { getMemberLedger } from "@/lib/queries/ledger.query";
import type { GroupMemberWithUser } from "@/types/member";
import type { ExpenseListItem } from "@/types/expense";

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

export type GroupSummaryData = {
  id: string;
  name: string;
  currency: string;
};

export type GroupExpensesData = {
  currency: string;
  expenses: ExpenseListItem[];
  members: GroupMemberWithUser[];
};

export type GroupSettingsData = {
  name: string;
  currency: string;
  description: string | null;
  isOwner: boolean;
};

function authorizedGroupWhere(groupId: string, currentUserId: string | null) {
  return {
    id: groupId,
    members: {
      some: {
        userId: currentUserId,
        isActive: true,
      },
    },
  };
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

export const getGroupSummary = cache(
  async (groupId: string): Promise<GroupSummaryData | null> => {
    try {
      const currentUserId = await getCurrentUserId();

      return prisma.group.findFirst({
        where: authorizedGroupWhere(groupId, currentUserId),
        select: {
          id: true,
          name: true,
          currency: true,
        },
      });
    } catch (error) {
      handleError(error);
      return null;
    }
  },
);

export const getGroupMembers = cache(
  async (groupId: string): Promise<GroupMemberWithUser[] | null> => {
    try {
      const currentUserId = await getCurrentUserId();

      const group = await prisma.group.findFirst({
        where: authorizedGroupWhere(groupId, currentUserId),
        select: {
          members: {
            include: { user: true },
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (!group) {
        return null;
      }

      return sortGroupMembers(group.members, currentUserId);
    } catch (error) {
      handleError(error);
      return null;
    }
  },
);

export const getGroupExpenses = cache(
  async (groupId: string): Promise<GroupExpensesData | null> => {
    try {
      const currentUserId = await getCurrentUserId();

      const group = await prisma.group.findFirst({
        where: authorizedGroupWhere(groupId, currentUserId),
        select: {
          currency: true,
          expenses: {
            where: { deletedAt: null },
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
          members: {
            include: { user: true },
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (!group) {
        return null;
      }

      return {
        currency: group.currency,
        expenses: group.expenses,
        members: sortGroupMembers(group.members, currentUserId),
      };
    } catch (error) {
      handleError(error);
      return null;
    }
  },
);

export const getGroupSettings = cache(
  async (groupId: string): Promise<GroupSettingsData | null> => {
    try {
      const currentUserId = await getCurrentUserId();

      const group = await prisma.group.findFirst({
        where: authorizedGroupWhere(groupId, currentUserId),
        select: {
          name: true,
          currency: true,
          description: true,
          members: {
            where: {
              userId: currentUserId,
              isActive: true,
            },
            select: { role: true },
            take: 1,
          },
        },
      });

      if (!group) {
        return null;
      }

      return {
        name: group.name,
        currency: group.currency,
        description: group.description,
        isOwner: group.members[0]?.role === "OWNER",
      };
    } catch (error) {
      handleError(error);
      return null;
    }
  },
);

export const getGroupStats = cache(async (groupId: string) => {
  const currentUserId = await getCurrentUserId();

  try {
    const [expenses, yourBalance] = await Promise.all([
      prisma.expense.aggregate({
        where: { groupId },
        _sum: { amountInCents: true },
      }),
      (async () => {
        if (!currentUserId) return 0;

        const membership = await prisma.groupMember.findFirst({
          where: { groupId, userId: currentUserId, isActive: true },
          select: { id: true },
        });
        if (!membership) return 0;

        const ledger = await getMemberLedger(membership.id);
        return ledger.balanceInCents;
      })(),
    ]);

    return {
      totalGroupSpend: expenses._sum.amountInCents ?? 0,
      yourBalance,
    };
  } catch (error) {
    handleError(error);
    return { totalGroupSpend: 0, yourBalance: 0 };
  }
});

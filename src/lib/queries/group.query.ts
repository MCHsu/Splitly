import "server-only";

import { cache } from "react";

import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { handleError } from "@/lib/utils";
import { sortGroupMembers } from "@/lib/domain/member";
import { getCurrentUserId } from "@/lib/queries/auth.query";
import { getMemberLedger } from "@/lib/queries/ledger.query";

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
            orderBy: { createdAt: "asc" },
          },
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
          settlements: true,
        },
      });

      if (!group) {
        return null;
      }

      return {
        ...group,
        members: sortGroupMembers(group.members, currentUserId),
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

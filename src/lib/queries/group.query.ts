import { cache } from "react";

import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { handleError } from "@/lib/utils";
import { getCurrentUserId } from "@/lib/queries/auth.query";

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

export const getGroupStats = cache(async (groupId: string) => {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    return { totalGroupSpend: 0, yourShare: 0 };
  }

  try {
    const [expenses, shares] = await Promise.all([
      prisma.expense.aggregate({
        where: { groupId },
        _sum: { amountInCents: true },
      }),
      prisma.expenseShare.aggregate({
        where: {
          expense: { groupId },
          member: { userId: currentUserId, isActive: true },
        },
        _sum: { amountInCents: true },
      }),
    ]);

    return {
      totalGroupSpend: expenses._sum.amountInCents ?? 0,
      yourShare: shares._sum.amountInCents ?? 0,
    };
  } catch (error) {
    handleError(error);
    return { totalGroupSpend: 0, yourShare: 0 };
  }
});

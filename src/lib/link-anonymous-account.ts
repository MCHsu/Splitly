import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

type TransactionClient = Prisma.TransactionClient;

async function mergeGuestMemberIntoExisting(
  transaction: TransactionClient,
  guestMemberId: string,
  targetMemberId: string,
) {
  const guestPayments = await transaction.expensePayment.findMany({
    where: { memberId: guestMemberId },
  });

  for (const payment of guestPayments) {
    const existing = await transaction.expensePayment.findUnique({
      where: {
        memberId_expenseId: {
          memberId: targetMemberId,
          expenseId: payment.expenseId,
        },
      },
    });

    if (existing) {
      await transaction.expensePayment.update({
        where: { id: existing.id },
        data: {
          amountInCents: existing.amountInCents + payment.amountInCents,
        },
      });
      await transaction.expensePayment.delete({ where: { id: payment.id } });
    } else {
      await transaction.expensePayment.update({
        where: { id: payment.id },
        data: { memberId: targetMemberId },
      });
    }
  }

  const guestShares = await transaction.expenseShare.findMany({
    where: { memberId: guestMemberId },
  });

  for (const share of guestShares) {
    const existing = await transaction.expenseShare.findUnique({
      where: {
        memberId_expenseId: {
          memberId: targetMemberId,
          expenseId: share.expenseId,
        },
      },
    });

    if (existing) {
      await transaction.expenseShare.update({
        where: { id: existing.id },
        data: {
          amountInCents: existing.amountInCents + share.amountInCents,
        },
      });
      await transaction.expenseShare.delete({ where: { id: share.id } });
    } else {
      await transaction.expenseShare.update({
        where: { id: share.id },
        data: { memberId: targetMemberId },
      });
    }
  }

  const settlements = await transaction.settlement.findMany({
    where: {
      OR: [{ fromMemberId: guestMemberId }, { toMemberId: guestMemberId }],
    },
  });

  for (const settlement of settlements) {
    const newFrom =
      settlement.fromMemberId === guestMemberId
        ? targetMemberId
        : settlement.fromMemberId;
    const newTo =
      settlement.toMemberId === guestMemberId
        ? targetMemberId
        : settlement.toMemberId;

    if (newFrom === newTo) {
      await transaction.settlement.delete({ where: { id: settlement.id } });
    } else {
      await transaction.settlement.update({
        where: { id: settlement.id },
        data: {
          fromMemberId: newFrom,
          toMemberId: newTo,
        },
      });
    }
  }
}

export async function transferAnonymousMemberships(
  anonymousUserId: string,
  newUserId: string,
): Promise<void> {
  await prisma.$transaction(async (transaction) => {
    const guestMemberships = await transaction.groupMember.findMany({
      where: { userId: anonymousUserId },
    });

    for (const guestMembership of guestMemberships) {
      const existingMembership = await transaction.groupMember.findFirst({
        where: {
          groupId: guestMembership.groupId,
          userId: newUserId,
        },
      });

      if (!existingMembership) {
        await transaction.groupMember.update({
          where: { id: guestMembership.id },
          data: {
            userId: newUserId,
            updatedById: newUserId,
          },
        });
        continue;
      }

      await mergeGuestMemberIntoExisting(
        transaction,
        guestMembership.id,
        existingMembership.id,
      );

      await transaction.groupMember.update({
        where: { id: existingMembership.id },
        data: {
          isActive: guestMembership.isActive || existingMembership.isActive,
          role:
            guestMembership.role === "OWNER" ||
            existingMembership.role === "OWNER"
              ? "OWNER"
              : "MEMBER",
          updatedById: newUserId,
        },
      });

      await transaction.groupMember.delete({
        where: { id: guestMembership.id },
      });
    }
  });
}

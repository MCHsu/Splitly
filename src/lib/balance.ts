import prisma from "@/lib/prisma";

/**
 * Member balance in cents.
 * balance = paid - owedShare + settlementsSent - settlementsReceived
 * Positive = others owe this member; negative = this member owes others.
 */
export async function getMemberBalance(memberId: string): Promise<number> {
  const [payments, shares, settlementsFrom, settlementsTo] = await Promise.all([
    prisma.expensePayment.aggregate({
      where: { memberId },
      _sum: { amountInCents: true },
    }),
    prisma.expenseShare.aggregate({
      where: { memberId },
      _sum: { amountInCents: true },
    }),
    prisma.settlement.aggregate({
      where: { fromMemberId: memberId },
      _sum: { amountInCents: true },
    }),
    prisma.settlement.aggregate({
      where: { toMemberId: memberId },
      _sum: { amountInCents: true },
    }),
  ]);

  const paid = payments._sum.amountInCents ?? 0;
  const owed = shares._sum.amountInCents ?? 0;
  const sent = settlementsFrom._sum.amountInCents ?? 0;
  const received = settlementsTo._sum.amountInCents ?? 0;

  return paid - owed + sent - received;
}

/** Count of expense payment + share records linked to this member. */
export async function getMemberExpenseCount(memberId: string): Promise<number> {
  const [paymentCount, shareCount] = await Promise.all([
    prisma.expensePayment.count({ where: { memberId } }),
    prisma.expenseShare.count({ where: { memberId } }),
  ]);

  return paymentCount + shareCount;
}

/** Count of settlement records referencing this member. */
export async function getMemberSettlementCount(
  memberId: string,
): Promise<number> {
  return prisma.settlement.count({
    where: {
      OR: [{ fromMemberId: memberId }, { toMemberId: memberId }],
    },
  });
}

export async function getMemberBalancesForGroup(
  groupId: string,
): Promise<Map<string, number>> {
  const members = await prisma.groupMember.findMany({
    where: { groupId },
    select: { id: true },
  });

  const balances = new Map<string, number>();

  await Promise.all(
    members.map(async (member) => {
      balances.set(member.id, await getMemberBalance(member.id));
    }),
  );

  return balances;
}

export async function getMemberExpenseCountsForGroup(
  groupId: string,
): Promise<Map<string, number>> {
  const members = await prisma.groupMember.findMany({
    where: { groupId },
    select: { id: true },
  });

  const counts = new Map<string, number>();

  await Promise.all(
    members.map(async (member) => {
      counts.set(member.id, await getMemberExpenseCount(member.id));
    }),
  );

  return counts;
}

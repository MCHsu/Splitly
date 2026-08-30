import prisma from "@/lib/prisma";

export type MemberLedger = {
  balanceInCents: number; // paid - owed + sent - received
  expenseRecordCount: number;
  settlementCount: number;
};

type SumCountRow = {
  memberId: string;
  sumInCents: number;
  count: number;
};

const emptyLedger = (): MemberLedger => ({
  balanceInCents: 0,
  expenseRecordCount: 0,
  settlementCount: 0,
});

/** Pure merge of four groupBy result sets into a per-member ledger. */
export function mergeLedgerRows(
  payments: SumCountRow[],
  shares: SumCountRow[],
  settlementsFrom: SumCountRow[],
  settlementsTo: SumCountRow[],
): Map<string, MemberLedger> {
  const ledger = new Map<string, MemberLedger>();

  function entry(memberId: string): MemberLedger {
    let row = ledger.get(memberId);
    if (!row) {
      row = emptyLedger();
      ledger.set(memberId, row);
    }
    return row;
  }

  for (const row of payments) {
    const member = entry(row.memberId);
    member.balanceInCents += row.sumInCents;
    member.expenseRecordCount += row.count;
  }

  for (const row of shares) {
    const member = entry(row.memberId);
    member.balanceInCents -= row.sumInCents;
    member.expenseRecordCount += row.count;
  }

  for (const row of settlementsFrom) {
    const member = entry(row.memberId);
    member.balanceInCents += row.sumInCents;
    member.settlementCount += row.count;
  }

  for (const row of settlementsTo) {
    const member = entry(row.memberId);
    member.balanceInCents -= row.sumInCents;
    member.settlementCount += row.count;
  }

  return ledger;
}

function toSumCountRows(
  rows: {
    memberId?: string;
    fromMemberId?: string;
    toMemberId?: string;
    _sum: { amountInCents: number | null };
    _count: number;
  }[],
  key: "memberId" | "fromMemberId" | "toMemberId",
): SumCountRow[] {
  return rows.map((row) => ({
    memberId: row[key] as string,
    sumInCents: row._sum.amountInCents ?? 0,
    count: row._count,
  }));
}

/** 4 groupBy queries — independent of member count. */
export async function getGroupLedger(
  groupId: string,
): Promise<Map<string, MemberLedger>> {
  const [payments, shares, settlementsFrom, settlementsTo] = await Promise.all([
    prisma.expensePayment.groupBy({
      by: ["memberId"],
      where: { expense: { groupId } },
      _sum: { amountInCents: true },
      _count: true,
    }),
    prisma.expenseShare.groupBy({
      by: ["memberId"],
      where: { expense: { groupId } },
      _sum: { amountInCents: true },
      _count: true,
    }),
    prisma.settlement.groupBy({
      by: ["fromMemberId"],
      where: { groupId },
      _sum: { amountInCents: true },
      _count: true,
    }),
    prisma.settlement.groupBy({
      by: ["toMemberId"],
      where: { groupId },
      _sum: { amountInCents: true },
      _count: true,
    }),
  ]);

  return mergeLedgerRows(
    toSumCountRows(payments, "memberId"),
    toSumCountRows(shares, "memberId"),
    toSumCountRows(settlementsFrom, "fromMemberId"),
    toSumCountRows(settlementsTo, "toMemberId"),
  );
}

/** Single-member guard for delete / deactivate / leave. */
export async function getMemberLedger(
  memberId: string,
): Promise<MemberLedger> {
  const [payments, shares, settlementsFrom, settlementsTo] = await Promise.all([
    prisma.expensePayment.aggregate({
      where: { memberId },
      _sum: { amountInCents: true },
      _count: true,
    }),
    prisma.expenseShare.aggregate({
      where: { memberId },
      _sum: { amountInCents: true },
      _count: true,
    }),
    prisma.settlement.aggregate({
      where: { fromMemberId: memberId },
      _sum: { amountInCents: true },
      _count: true,
    }),
    prisma.settlement.aggregate({
      where: { toMemberId: memberId },
      _sum: { amountInCents: true },
      _count: true,
    }),
  ]);

  const paid = payments._sum.amountInCents ?? 0;
  const owed = shares._sum.amountInCents ?? 0;
  const sent = settlementsFrom._sum.amountInCents ?? 0;
  const received = settlementsTo._sum.amountInCents ?? 0;

  return {
    balanceInCents: paid - owed + sent - received,
    expenseRecordCount: payments._count + shares._count,
    settlementCount: settlementsFrom._count + settlementsTo._count,
  };
}

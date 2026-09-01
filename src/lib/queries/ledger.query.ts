import "server-only";

import prisma from "@/lib/prisma";
import {
  mergeLedgerRows,
  type MemberLedger,
} from "@/lib/domain/ledger";

type SumCountRow = {
  memberId: string;
  sumInCents: number;
  count: number;
};

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

export type { MemberLedger };

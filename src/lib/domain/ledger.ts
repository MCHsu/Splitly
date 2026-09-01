export type MemberLedger = {
  balanceInCents: number; // paid - owed + sent - received
  expenseRecordCount: number;
  settlementCount: number;
};

export type LedgerSumRow = {
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
  payments: LedgerSumRow[],
  shares: LedgerSumRow[],
  settlementsFrom: LedgerSumRow[],
  settlementsTo: LedgerSumRow[],
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

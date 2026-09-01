export type MinTransfer = {
  fromMemberId: string;
  toMemberId: string;
  amountInCents: number;
};

/**
 * Greedy min-transfers to settle net balances.
 * Debtors (balance < 0) pay creditors (balance > 0).
 * ≈ max(#debtors, #creditors) transfers.
 */
export function computeMinTransfers(
  balances: Map<string, number> | ReadonlyMap<string, number>,
): MinTransfer[] {
  const debtors: { memberId: string; amount: number }[] = [];
  const creditors: { memberId: string; amount: number }[] = [];

  for (const [memberId, balance] of balances) {
    if (balance < 0) {
      debtors.push({ memberId, amount: -balance });
    } else if (balance > 0) {
      creditors.push({ memberId, amount: balance });
    }
  }

  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transfers: MinTransfer[] = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(debtor.amount, creditor.amount);

    if (amount > 0) {
      transfers.push({
        fromMemberId: debtor.memberId,
        toMemberId: creditor.memberId,
        amountInCents: amount,
      });
    }

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (debtor.amount === 0) i += 1;
    if (creditor.amount === 0) j += 1;
  }

  return transfers;
}

import { fromCents, toCents } from "@/lib/money";
import { distributeEvenly } from "@/lib/split-calculator";
import type {
  AllocationData,
  ExpenseFormData,
} from "@/lib/validations/expense";
import type { ExpenseForForm } from "@/types/expense";

type MemberRef = { id: string };

export type ExpenseWriteData = {
  amountInCents: number;
  payments: { memberId: string; amountInCents: number }[];
  shares: { memberId: string; amountInCents: number }[];
};

/**
 * True when stored cents match what an even split would produce
 * (leftover cents spread +1 each across the first selected rows).
 * Compare as a cents multiset — DB row order may not match form field order.
 */
function matchesEqualSplit(
  amountInCents: number,
  selected: { amountInCents: number }[],
): boolean {
  if (selected.length === 0) return false;

  const expected = distributeEvenly(amountInCents, selected.length).sort(
    (a, b) => a - b,
  );
  const actual = selected
    .map((row) => row.amountInCents)
    .sort((a, b) => a - b);

  return (
    expected.length === actual.length &&
    expected.every((cents, index) => cents === actual[index])
  );
}

function toAllocationRows(
  memberIds: string[],
  records: { memberId: string; amountInCents: number }[],
  isManual: boolean,
): AllocationData[] {
  const byMember = new Map(
    records.map((row) => [row.memberId, row.amountInCents]),
  );

  return memberIds.map((memberId) => {
    const cents = byMember.get(memberId);
    const isSelected = cents != null;

    return {
      memberId,
      amount: isSelected ? fromCents(cents) : 0,
      isSelected,
      isManual: isSelected ? isManual : false,
    };
  });
}

export function toExpenseFormValues(
  expense: ExpenseForForm,
  members: MemberRef[],
): ExpenseFormData {
  const memberIds = [
    ...new Set([
      ...members.map((m) => m.id),
      ...expense.payments.map((p) => p.memberId),
      ...expense.shares.map((s) => s.memberId),
    ]),
  ];

  const sharesAreEqual = matchesEqualSplit(
    expense.amountInCents,
    expense.shares,
  );
  const paymentsAreEqual = matchesEqualSplit(
    expense.amountInCents,
    expense.payments,
  );

  return {
    description: expense.description,
    amount: fromCents(expense.amountInCents),
    date: expense.date,
    category: expense.category ?? undefined,
    note: expense.note ?? undefined,
    splitMethod: expense.splitMethod,
    paidBy: toAllocationRows(memberIds, expense.payments, !paymentsAreEqual),
    allocations: toAllocationRows(memberIds, expense.shares, !sharesAreEqual),
  };
}

export function toExpenseWriteData(data: ExpenseFormData): ExpenseWriteData {
  return {
    amountInCents: toCents(data.amount),
    payments: data.paidBy
      .filter((row) => row.isSelected)
      .map((row) => ({
        memberId: row.memberId,
        amountInCents: toCents(row.amount),
      })),
    shares: data.allocations
      .filter((row) => row.isSelected)
      .map((row) => ({
        memberId: row.memberId,
        amountInCents: toCents(row.amount),
      })),
  };
}

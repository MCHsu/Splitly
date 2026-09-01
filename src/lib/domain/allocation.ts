import { distributeEvenly } from "@/lib/domain/split-calculator";
import { fromCents, toCents } from "@/lib/money";
import type { AllocationData } from "@/lib/validations/expense";

const clearAmount = (row: AllocationData): AllocationData =>
  row.amount === 0 && !row.isManual
    ? row
    : { ...row, amount: 0, isManual: false };

export const sumManualCents = (rows: readonly AllocationData[]) =>
  rows.reduce((total, row) => (row.isManual ? total + toCents(row.amount) : total), 0);

/** Non-manual selected rows split the remaining budget; manual rows stay untouched. */
export function redistributeEqually(
  rows: readonly AllocationData[],
  expenseTotal: number,
): AllocationData[] {
  if (expenseTotal <= 0) {
    return rows.map(clearAmount);
  }

  const manualTotalCents = sumManualCents(rows);
  const budgetCents = toCents(expenseTotal) - manualTotalCents;

  const selectedIndices = rows
    .map((row, index) => (row.isSelected && !row.isManual ? index : -1))
    .filter((index) => index !== -1);

  const numberOfPeople = selectedIndices.length;

  if (numberOfPeople === 0 || budgetCents <= 0) {
    return rows.map((row) => (row.isManual ? row : clearAmount(row)));
  }

  const amountsInCents = distributeEvenly(budgetCents, numberOfPeople);

  return rows.map((row, index) => {
    if (row.isManual) return row;

    const selectedOrder = selectedIndices.indexOf(index);

    if (selectedOrder === -1) {
      return clearAmount(row);
    }

    return { ...row, amount: fromCents(amountsInCents[selectedOrder]) };
  });
}

/** Single-payer mode: one member gets the full amount, everyone else is cleared. */
export function assignAllToOne(
  rows: readonly AllocationData[],
  memberId: string,
  total: number,
): AllocationData[] {
  return rows.map((row) => ({
    ...row,
    isSelected: row.memberId === memberId,
    isManual: false,
    amount: row.memberId === memberId ? total : 0,
  }));
}

/** Toggle selection and clear that row's amount and manual flag. */
export function toggleRow(
  rows: readonly AllocationData[],
  index: number,
  isSelected: boolean,
): AllocationData[] {
  return rows.map((row, rowIndex) =>
    rowIndex === index
      ? { ...row, isSelected, amount: 0, isManual: false }
      : row,
  );
}

/** Manual input: `null` clears the row back to automatic distribution. */
export function setRowAmount(
  rows: readonly AllocationData[],
  index: number,
  amount: number | null,
): AllocationData[] {
  const isManual = amount !== null;

  return rows.map((row, rowIndex) =>
    rowIndex === index ? { ...row, isManual, amount: amount ?? 0 } : row,
  );
}

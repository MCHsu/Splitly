"use client";

import { useEffect, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import {
  redistributeEqually,
  setRowAmount,
  sumManualCents,
  toggleRow,
} from "@/lib/allocation";
import { fromCents, sumSelectedCents } from "@/lib/money";
import type { AllocationData } from "@/lib/validations/expense";

export function useAllocationField(name: string, total: number) {
  const { control, getValues, setValue } = useFormContext();

  const rows = useWatch({
    control,
    name,
  }) as AllocationData[] | undefined;

  const applyRows = (next: AllocationData[]) => {
    const current = (getValues(name) as AllocationData[] | undefined) ?? [];

    next.forEach((row, index) => {
      const previous = current[index];
      if (!previous) return;

      if (previous.isSelected !== row.isSelected) {
        setValue(`${name}.${index}.isSelected`, row.isSelected);
      }

      if (previous.isManual !== row.isManual) {
        setValue(`${name}.${index}.isManual`, row.isManual);
      }

      if (previous.amount !== row.amount) {
        setValue(`${name}.${index}.amount`, row.amount);
      }
    });
  };

  const toggle = (index: number, isSelected: boolean) => {
    applyRows(toggleRow(rows ?? [], index, isSelected));
  };

  const setAmount = (index: number, amount: number | null) => {
    applyRows(setRowAmount(rows ?? [], index, amount));
  };

  const manualTotal = useMemo(
    () => fromCents(sumManualCents(rows ?? [])),
    [rows],
  );

  const selectionKey = useMemo(
    () => (rows ?? []).map((row) => (row.isSelected ? "1" : "0")).join(""),
    [rows],
  );

  const selectedTotal = useMemo(
    () => fromCents(sumSelectedCents(rows)),
    [rows],
  );

  useEffect(() => {
    applyRows(redistributeEqually(getValues(name) ?? [], total));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mirrors [remainingBudget, selectedKey]
  }, [total, manualTotal, selectionKey]);

  return {
    rows: rows ?? [],
    toggle,
    setAmount,
    selectedTotal,
  };
}

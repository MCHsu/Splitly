'use client";';

import { useState } from "react";
import { useFormContext, useController } from "react-hook-form";
import { TabbedFormSection } from "@/components/shared/form/tabbed-form-section";
import AllocationList from "@/components/expense-form/allocation-list";

type SplitMethod = "EQUAL" | "PERCENTAGE" | "SHARES" | "EXACT";

const splitMethods: { value: SplitMethod; label: string }[] = [
  { value: "EQUAL", label: "Equal" },
  { value: "PERCENTAGE", label: "Percentage" },
  { value: "SHARES", label: "Shares" },
  { value: "EXACT", label: "Exact" },
] as const;

interface SplitSectionProps<T extends FieldValues> {
  name: Path<T>;
  currentAmount: number;
}

export function SplitSection<T extends FieldValues>({
  name,
  currentAmount,
}: SplitSectionProps<T>) {
  const { control, setValue, getValues } = useFormContext();
  const [mode, setMode] = useState("EQUAL");

  return (
    <TabbedFormSection
      label="Split Method"
      value={mode}
      onValueChange={(val) => {
        setMode(val);
      }}
      options={splitMethods.map((method) => ({
        value: method.value,
        label: method.label,
      }))}
    >
      <div className="p-4 border border-dashed rounded-lg bg-gray-50 text-center text-sm text-gray-500">
        <AllocationList
          splitMethod={mode}
          showBalancedAmounts={true}
          mount={currentAmount}
        />
      </div>
    </TabbedFormSection>
  );
}

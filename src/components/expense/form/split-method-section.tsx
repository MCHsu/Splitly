"use client";

import { useFormContext, useWatch } from "react-hook-form";

import { TabbedFieldGroup } from "@/components/shared/form/tabbed-field-group";
import { AllocationEditor } from "@/components/expense/form/allocation-editor";
import type { ExpenseFormData } from "@/lib/validations/expense";

const splitMethods: {
  value: ExpenseFormData["splitMethod"];
  label: string;
}[] = [
  { value: "EXACT", label: "Exact" },
  { value: "SHARES", label: "Shares" },
] as const;

interface SplitMethodSectionProps {
  name: string;
  total: number;
  currency?: string;
}

export function SplitMethodSection({
  name,
  total,
  currency,
}: SplitMethodSectionProps) {
  const { control, setValue } = useFormContext<ExpenseFormData>();
  const mode = useWatch({ control, name: "splitMethod" }) ?? "EXACT";

  const handleModeChange = (value: string) => {
    setValue("splitMethod", value as ExpenseFormData["splitMethod"], {
      shouldValidate: true,
    });
  };

  return (
    <TabbedFieldGroup
      label="Split Method"
      value={mode}
      options={splitMethods}
      onValueChange={handleModeChange}
    >
      {() => (
        <AllocationEditor
          name={name}
          total={total}
          label="Total split"
          currency={currency}
        />
      )}
    </TabbedFieldGroup>
  );
}

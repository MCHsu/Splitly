"use client";

import { AmountProgress } from "@/components/shared/amount-progress";
import { Separator } from "@/components/ui/separator";
import { useMembers } from "@/providers/member-provider";

import { AllocationRow } from "./allocation-row";
import { useAllocationField } from "./use-allocation-field";

interface AllocationEditorProps {
  name: string;
  total: number;
  label: string;
  currency?: string;
}

export function AllocationEditor({
  name,
  total,
  label,
  currency,
}: AllocationEditorProps) {
  const { members } = useMembers();
  const { rows, toggle, setAmount, selectedTotal } = useAllocationField(
    name,
    total,
  );

  return (
    <div className="w-full space-y-6 rounded-xl border bg-muted p-4 md:p-6 lg:p-10">
      {rows.map((row, index) => {
        const memberData = members.find((member) => member.id === row.memberId);

        if (!memberData) return null;

        return (
          <AllocationRow
            key={row.memberId}
            member={memberData}
            amountFieldName={`${name}.${index}.amount`}
            isSelected={row.isSelected}
            isManual={row.isManual}
            currency={currency}
            onToggle={(isSelected) => toggle(index, isSelected)}
            onAmountChange={(amount) => setAmount(index, amount)}
          />
        );
      })}

      <Separator />

      <AmountProgress
        label={label}
        target={total}
        current={selectedTotal}
        currencyCode={currency}
      />
    </div>
  );
}

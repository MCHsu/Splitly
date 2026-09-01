"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { TabbedFieldGroup } from "@/components/shared/form/tabbed-field-group";
import { SelectField } from "@/components/shared/form/select-field";
import { AllocationEditor } from "@/components/expense/form/allocation-editor";
import { UserAvatar } from "@/components/shared/user-avatar";
import { assignAllToOne } from "@/lib/domain/allocation";
import type { AllocationData } from "@/lib/validations/expense";
import { useMembers } from "@/providers/member-provider";

const paidByModes = [
  { value: "single", label: "Single" },
  { value: "multiple", label: "Multiple" },
] as const;

type PaidByMode = (typeof paidByModes)[number]["value"];

interface PaidBySectionProps {
  name: string;
  total: number;
  currency?: string;
}

export function PaidBySection({ name, total, currency }: PaidBySectionProps) {
  const { getValues, setValue } = useFormContext();
  const { members } = useMembers();

  const readPayers = (): AllocationData[] => getValues(name) ?? [];

  const [paidByMode, setPaidByMode] = useState<PaidByMode>(() =>
    readPayers().filter((payer) => payer?.isSelected).length > 1
      ? "multiple"
      : "single",
  );

  const memberOptions = members.map((member) => {
    const displayName = member.name;

    return {
      value: member.id,
      label: (
        <>
          <UserAvatar name={displayName} size="sm" />
          {displayName}
        </>
      ),
    };
  });

  useEffect(() => {
    if (paidByMode !== "single") return;

    const payers = readPayers();
    const payer = payers.find((row) => row.isSelected) ?? payers[0];

    if (!payer) return;

    setValue(name, assignAllToOne(payers, payer.memberId, total), {
      shouldValidate: true,
    });
  }, [paidByMode, total, name, setValue]);

  return (
    <TabbedFieldGroup
      label="Paid By"
      value={paidByMode}
      onValueChange={(value) => setPaidByMode(value as PaidByMode)}
      options={paidByModes}
    >
      {(activeValue) =>
        activeValue === "single" ? (
          <SelectField
            name={name}
            placeholder="Select Payer"
            options={memberOptions}
            toFormValue={(memberId) =>
              assignAllToOne(readPayers(), memberId, total)
            }
            toUIValue={(payers: AllocationData[] | undefined) =>
              payers?.find((payer) => payer.isSelected)?.memberId ?? ""
            }
          />
        ) : (
          <AllocationEditor
            name={name}
            total={total}
            label="Total paid"
            currency={currency}
          />
        )
      }
    </TabbedFieldGroup>
  );
}

"use client";

import { useRef } from "react";
import { useFormContext } from "react-hook-form";

import { AmountField } from "@/components/shared/form/amount-field";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { getMemberDisplayName, type GroupMemberWithUser } from "@/lib/member";
import { cn } from "@/lib/utils";

interface AllocationRowProps {
  member: GroupMemberWithUser;
  amountFieldName: string;
  isSelected: boolean;
  isManual: boolean;
  currency?: string;
  onToggle: (isSelected: boolean) => void;
  onAmountChange: (amount: number | null) => void;
}

export function AllocationRow({
  member,
  amountFieldName,
  isSelected,
  isManual,
  currency,
  onToggle,
  onAmountChange,
}: AllocationRowProps) {
  const { getValues } = useFormContext();
  const valueOnFocus = useRef<string | number | null>(null);
  const displayName = getMemberDisplayName(member);

  return (
    <div className="flex items-center gap-4">
      <Checkbox
        checked={isSelected}
        className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
        onCheckedChange={(checked) => onToggle(checked === true)}
      />

      <div className="flex w-50 items-center gap-3">
        <div className="flex flex-row items-center gap-2">
          <UserAvatar name={displayName} size="sm" />
          <span className="text-sm font-semibold text-gray-900">
            {displayName}
          </span>
        </div>
      </div>

      <AmountField
        name={amountFieldName}
        className={cn(isManual ? "text-blue-600" : "text-gray-500")}
        placeholder="-"
        disabled={!isSelected}
        currencyCode={currency}
        handleOnFocus={() => {
          valueOnFocus.current = getValues(amountFieldName);
        }}
        handleOnBlur={() => {
          const rawValue = getValues(amountFieldName);
          if (rawValue === valueOnFocus.current) return;

          const numericValue =
            rawValue === "" ? null : Number.parseFloat(String(rawValue));

          onAmountChange(numericValue);
        }}
      />
    </div>
  );
}

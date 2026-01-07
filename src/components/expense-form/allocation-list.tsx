"use client";

import { useState, useEffect } from "react";
import {
  Controller,
  FieldValues,
  useFieldArray,
  useFormContext,
  useController,
  UseFormSetValue,
} from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { DollarSign, Percent } from "lucide-react";
import { calculateSplit, SplitMethod } from "@/lib/split-calculator";

interface UserData {
  memberId: string;
  name: string;
  subText: string;
  avatarUrl: string;
  amount: number;
  percentage: number;
  count: number;
  total: number;
  isChecked: boolean;
}

const initialUsers: UserData[] = [
  {
    memberId: "1",
    name: "You",
    subText: "John Doe",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    amount: 37.5,
    percentage: 25.0,
    count: 1,
    total: 0.0,
    isChecked: true,
  },
  {
    memberId: "2",
    name: "Sarah Smith",
    subText: "sarah@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    amount: 37.5,
    percentage: 25.0,
    count: 1,
    total: -37.5,
    isChecked: false,
  },
  {
    memberId: "3",
    name: "Mike Johnson",
    subText: "mike.j@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    amount: 37.5,
    percentage: 25.0,
    count: 1,
    total: -37.5,
    isChecked: true,
  },
];

interface AllocationListProps {
  showBalancedAmounts?: boolean;
  splitMethod?: SplitMethod;
  amount: number;
}

export default function AllocationList({
  showBalancedAmounts = false,
  splitMethod,
  amount,
}: AllocationListProps) {
  const { control, setValue } = useFormContext();
  const [users, setUsers] = useState(initialUsers);

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "paidBy",
  });

  const showDollarSignIcon =
    splitMethod === "EQUAL" || splitMethod === "EXACT" || !showBalancedAmounts;
  const showPercentageIcon = splitMethod === "PERCENTAGE";

  const calculateEqualSplit = (currentFields: any[], amount: number) => {
    const numberOfPeople = currentFields.length;
    if (numberOfPeople === 0) return [];

    const { amounts, remainder } = calculateSplit(
      "EQUAL",
      amount,
      Array(numberOfPeople).fill(1)
    );

    return currentFields.map((field, index) => ({
      ...field,
      amount: index === 0 ? amounts[index] + remainder : amounts[index],
    }));
  };

  const handleToggle = (
    memberId: string,
    fieldIndex: number,
    isChecked: boolean
  ) => {
    isChecked ? append({ memberId }) : remove(fieldIndex);
  };

  useEffect(() => {
    const updatedFields = calculateEqualSplit(fields, amount);
    replace(updatedFields);
  }, [fields.length, amount]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {users.map((user) => {
        const fieldIndex = fields.findIndex(
          (f) => f.memberId === user.memberId
        );
        const field = fields.find((f) => f.memberId === user.memberId);
        const isSelected = fieldIndex !== -1;
        const fieldName = `paidBy.${fieldIndex}.amount`;

        return (
          <div key={user.memberId} className="flex items-center gap-4">
            {/* 1. Checkbox */}
            <Checkbox
              checked={isSelected}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              onCheckedChange={(checked) =>
                handleToggle(user.memberId, fieldIndex, checked === true)
              }
            />

            {/* 2. Avatar & Info */}
            <div className="flex items-center gap-3 w-[200px]">
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-gray-900">
                  {user.name}
                </span>
                {/* <span className="text-xs text-muted-foreground">
                {user.subText}
              </span> */}
              </div>
            </div>

            {/* 3. Amount Input (With $ Prefix) */}
            {/* <div className="flex-1 max-w-[140px]"> */}
            <InputGroup className="max-w-[140px]">
              {field ? (
                <Controller
                  control={control}
                  name={fieldName}
                  render={({ field, fieldState }) => (
                    <InputGroupInput
                      {...field}
                      placeholder="-"
                      type="number"
                      min="0"
                      disabled={!isSelected}
                      onChange={(e) => {
                        field.onChange(e);
                        console.log("field:", field);
                        console.log("fieldState:", fieldState);
                      }}
                    />
                  )}
                />
              ) : (
                <InputGroupInput
                  placeholder="-"
                  type="number"
                  min="0"
                  disabled={true}
                />
              )}

              {showDollarSignIcon && (
                <InputGroupAddon>
                  <DollarSign />
                </InputGroupAddon>
              )}
              {showPercentageIcon && (
                <InputGroupAddon align="inline-end">
                  <Percent />
                </InputGroupAddon>
              )}
            </InputGroup>
            {/* </div> */}

            {/* 6. Total Label */}
            {showBalancedAmounts && (
              <div
                className={cn(
                  "w-[100px] text-right font-bold text-sm",
                  user.total >= 0 ? "text-green-500" : "text-red-500"
                )}
              >
                {user.total >= 0
                  ? `$${user.total.toFixed(2)}`
                  : `-$${Math.abs(user.total).toFixed(2)}`}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

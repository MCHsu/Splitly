"use client";

import { useState } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { InputField } from "@/components/shared/form/input-field";
import { DateField } from "@/components/shared/form/date-field";
import { TextareaField } from "@/components/shared/form/textarea-field";
import { PaidBySection } from "@/components/expense-form/paid-by-section";
import { SplitSection } from "@/components/expense-form/split-section";

const SplitMethodSchema = z.enum(["EQUAL", "PERCENTAGE", "SHARES", "EXACT"]);

const PaymentSchema = z.object({
  memberId: z.string().min(1, "Member ID is required"),
  amount: z.coerce.number().min(0, "Payment amount cannot be negative"),
});

const AllocationSchema = z.object({
  memberId: z.string().min(1, "Member ID is required"),
  amount: z.coerce.number().min(0, "Value cannot be negative"),
});

const expenseFormSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.coerce
    .number()
    .min(0.01, "Amount must be greater than 0")
    .max(10000000, "Amount exceeds the maximum limit"),
  date: z.date(),
  paidByMode: z.enum(["single", "multiple"]).default("single"),
  paidBy: z.array(PaymentSchema).min(1, "At least one payer is required"),
  allocations: z
    .array(AllocationSchema)
    .min(1, "At least one member must be selected"),
  note: z.string().optional(),
});

type expenseForm = z.infer<typeof expenseFormSchema>;

interface ExpenseFormProps {
  mode?: "add" | "edit";
  defaultValues?: Partial<expenseForm>;
  onSubmit?: (data: expenseForm) => void;
  onCancel?: () => void;
}

export function ExpenseForm({
  mode = "add",
  defaultValues,
  onSubmit: onSubmitProp,
  onCancel,
}: ExpenseFormProps) {
  const methods = useForm<expenseForm>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: defaultValues || {
      description: "",
      amount: 0,
      date: new Date(),
      paidByMode: "single",
      paidBy: [{ memberId: "", amount: 0 }],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
  } = methods;

  const actionText = mode === "edit" ? "Update" : "Submit";

  const onSubmit: SubmitHandler<expenseForm> = (data) => {
    if (onSubmitProp) {
      onSubmitProp(data);
    }
    console.log(data);
  };

  const [syncedAmount, setSyncedAmount] = useState(defaultValues?.amount || 0);

  const handleSyncAmount = () => {
    const currentPaidByMode = getValues("paidByMode");
    const currentAmount = +getValues("amount") || 0;

    setSyncedAmount(currentAmount);

    if (currentPaidByMode === "single") {
      const currentPayerId = getValues("paidBy")?.[0]?.memberId || "me";

      setValue(
        "paidBy",
        [{ memberId: currentPayerId, amount: currentAmount }],
        { shouldValidate: true }
      );
    }
  };

  return (
    <div className="w-full max-w-md h-full">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 justify-between">
            <FieldGroup>
              <FieldSet>
                <FieldLegend>
                  {mode === "edit" ? "Edit Expense" : "Payment Method"}
                </FieldLegend>
                <FieldDescription>
                  All transactions are secure and encrypted
                </FieldDescription>

                <InputField
                  name="description"
                  label="Expense Description"
                  placeholder="e.g., Dinner at Joe's"
                />
                <InputField
                  name="amount"
                  label="Amount"
                  placeholder="$"
                  handleOnBlur={handleSyncAmount}
                />
                <DateField name="date" />
                <TextareaField
                  name="note"
                  label="Note"
                  placeholder="Type your notes here."
                />
              </FieldSet>
            </FieldGroup>

            <FieldSeparator />

            <FieldGroup>
              <PaidBySection name="paidBy" currentAmount={syncedAmount} />
              <SplitSection name="allocations" currentAmount={syncedAmount} />
            </FieldGroup>

            <div className="w-full flex gap-4 justify-center">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Spinner />}
                {actionText}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export function AddExpenseForm() {
  return <ExpenseForm mode="add" />;
}

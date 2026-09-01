"use client";

import { useMemo, useState } from "react";
import {
  useForm,
  SubmitHandler,
  useWatch,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SectionContainer } from "@/components/shared/section-container";
import { FieldGroup } from "@/components/ui/field";
import { FormLayout } from "@/components/shared/form/form-layout";
import { InputField } from "@/components/shared/form/input-field";
import { AmountField } from "@/components/shared/form/amount-field";
import { DateField } from "@/components/shared/form/date-field";
import { TextareaField } from "@/components/shared/form/textarea-field";
import { CategoryField } from "@/components/shared/form/category-field";
import { PaidBySection } from "@/components/expense/form/paid-by-section";
import { SplitMethodSection } from "@/components/expense/form/split-method-section";
import { isExpenseFormUnchanged } from "@/lib/domain/expense-form-values";
import { expenseFormSchema, ExpenseFormData } from "@/lib/validations/expense";

import { useMembers } from "@/providers/member-provider";
import { useUser } from "@/providers/user-provider";

interface ExpenseFormProps {
  currency: string;
  mode?: "add" | "edit";
  defaultValues?: ExpenseFormData;
  onSubmit: (data: ExpenseFormData) => Promise<unknown>;
  onCancel?: () => void;
  cancelHref?: string;
}

export function ExpenseForm({
  currency,
  mode = "add",
  defaultValues,
  onSubmit: onSubmitProp,
  onCancel,
  cancelHref,
}: ExpenseFormProps) {
  const { members } = useMembers();
  const { user } = useUser();

  const currentUser =
    members.find((member) => member.userId === user?.id) ?? members[0];

  // Every member gets a row in both lists; `isSelected` decides who is actually involved.
  const initialValues = useMemo<ExpenseFormData>(() => {
    const rows = members.map((member) => ({
      memberId: member.id,
      amount: 0,
      isSelected: true,
      isManual: false,
    }));

    return {
      description: "",
      amount: 0,
      date: new Date(),
      category: "food-drink",
      splitMethod: "EXACT",
      paidBy: rows.map((row) => ({
        ...row,
        isSelected: row.memberId === currentUser?.id,
      })),
      allocations: rows,
    };
  }, [members, currentUser?.id]);

  const baselineValues = defaultValues ?? initialValues;

  const methods = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema) as Resolver<ExpenseFormData>,
    defaultValues: baselineValues,
  });

  const {
    control,
    formState: { isSubmitting },
    getValues,
  } = methods;

  const values = useWatch({ control }) as ExpenseFormData;
  const isSubmitDisabled =
    mode === "edit" && isExpenseFormUnchanged(values, baselineValues);

  const actionText = mode === "edit" ? "Update" : "Create";
  const onSubmit: SubmitHandler<ExpenseFormData> = async (data) => {
    await onSubmitProp(data);
  };

  const [syncedAmount, setSyncedAmount] = useState(defaultValues?.amount || 0);

  const handleSyncAmount = () => {
    const currentAmount = +getValues("amount") || 0;
    setSyncedAmount(currentAmount);
  };

  return (
    <SectionContainer>
      <FormLayout methods={methods} onSubmit={onSubmit}>
        <FormLayout.Section>
          <div className="flex flex-col gap-4 md:flex-row md:gap-6 lg:gap-10">
            <InputField
              name="description"
              label="Description"
              placeholder="e.g., Dinner at Joe's"
            />
            <CategoryField name="category" label="Category" />
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:gap-6 lg:gap-10">
            <AmountField
              name="amount"
              label="Amount"
              placeholder="-"
              currencyCode={currency}
              handleOnBlur={handleSyncAmount}
            />
            <DateField name="date" />
          </div>

          <FieldGroup>
            <PaidBySection
              name="paidBy"
              total={syncedAmount}
              currency={currency}
            />
            <SplitMethodSection
              name="allocations"
              total={syncedAmount}
              currency={currency}
            />
          </FieldGroup>

          <TextareaField
            name="note"
            label="Note (Optional)"
            placeholder="Add any extra details..."
          />
        </FormLayout.Section>

        <FormLayout.Actions
          onCancel={onCancel}
          cancelHref={cancelHref}
          submitText={actionText}
          isSubmitting={isSubmitting}
          isSubmitDisabled={isSubmitDisabled}
        />
      </FormLayout>
    </SectionContainer>
  );
}

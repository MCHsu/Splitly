"use client";

import { useMemo, useState } from "react";
import { useForm, SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FieldGroup } from "@/components/ui/field";
import { FormLayout } from "@/components/shared/form/form-layout";
import { InputField } from "@/components/shared/form/input-field";
import { AmountField } from "@/components/shared/form/amount-field";
import { DateField } from "@/components/shared/form/date-field";
import { TextareaField } from "@/components/shared/form/textarea-field";
import { SectionContainer } from "@/components/shared/section-container";
import { CategoryField } from "@/components/shared/form/category-field";
import { PaidBySection } from "@/components/expense-form/paid-by-section";
import { SplitMethodSection } from "@/components/expense-form/split-method-section";
import { expenseFormSchema, ExpenseFormData } from "@/lib/validations/expense";
import { createExpense } from "@/app/actions/expense.action";
import { useGroup } from "@/providers/group-provider";
import { useMembers } from "@/providers/member-provider";
import { useUser } from "@/providers/user-provider";

interface ExpenseFormProps {
  groupId?: string;
  mode?: "add" | "edit";
  defaultValues?: ExpenseFormData;
  onSubmit?: (data: ExpenseFormData) => void | Promise<void>;
  onCancel?: () => void;
  cancelHref?: string;
}

export function ExpenseForm({
  groupId,
  mode = "add",
  defaultValues,
  onSubmit: onSubmitProp,
  onCancel,
  cancelHref,
}: ExpenseFormProps) {
  const { activeMembers } = useMembers();
  const { currency } = useGroup();
  const { user } = useUser();

  const currentUser =
    activeMembers.find((member) => member.userId === user?.id) ??
    activeMembers[0];

  // Every member gets a row in both lists; `isSelected` decides who is actually involved.
  const initialValues = useMemo<ExpenseFormData>(() => {
    const rows = activeMembers.map((member) => ({
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
  }, [activeMembers, currentUser?.id]);

  const methods = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema) as Resolver<ExpenseFormData>,
    defaultValues: defaultValues ?? initialValues,
  });

  const {
    formState: { isSubmitting },
    getValues,
  } = methods;

  const actionText = mode === "edit" ? "Update" : "Submit";

  const onSubmit: SubmitHandler<ExpenseFormData> = async (data) => {
    if (onSubmitProp) {
      await onSubmitProp(data);
      return;
    }
    if (groupId) {
      const result = await createExpense(groupId, data);
      if (result.success) {
        onCancel?.();
      } else {
        console.error("Failed to create expense", result.error);
      }
    }
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
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-10">
            <InputField
              name="description"
              label="Description"
              placeholder="e.g., Dinner at Joe's"
            />
            <CategoryField name="category" label="Category" />
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-10">
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
            label="Note"
            placeholder="Add any extra details..."
          />
        </FormLayout.Section>

        <FormLayout.Actions
          className="w-full"
          onCancel={onCancel}
          cancelHref={cancelHref}
          submitText={actionText}
          isSubmitting={isSubmitting}
        />
      </FormLayout>
    </SectionContainer>
  );
}

export function AddExpenseForm() {
  return <ExpenseForm mode="add" />;
}

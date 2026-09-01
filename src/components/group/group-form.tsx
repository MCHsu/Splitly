"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { groupFormSchema, GroupFormData } from "@/lib/validations/group";
import { InputField } from "@/components/shared/form/input-field";
import { SelectField } from "@/components/shared/form/select-field";
import { TextareaField } from "@/components/shared/form/textarea-field";
import { FormLayout } from "@/components/shared/form/form-layout";
import { SectionContainer } from "@/components/shared/section-container";
import type { CurrencyItem } from "@/types/currency";

interface GroupFormProps {
  mode?: "add" | "edit";
  defaultValues?: Partial<GroupFormData>;
  currencies: CurrencyItem[];
  onSubmit: (data: GroupFormData) => Promise<unknown>;
  onCancel?: () => void;
}

export function GroupForm({
  mode = "add",
  defaultValues,
  currencies,
  onSubmit: onSubmitProp,
  onCancel,
}: GroupFormProps) {
  const methods = useForm<GroupFormData>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: defaultValues || {
      name: "",
      currency: "",
      description: "",
    },
  });

  const {
    reset,
    formState: { isSubmitting, isDirty },
  } = methods;

  const actionText = mode === "edit" ? "Update" : "Create";
  const isSubmitDisabled = mode === "edit" && !isDirty;

  const onSubmit: SubmitHandler<GroupFormData> = async (data) => {
    await onSubmitProp(data);
    reset(data);
  };

  return (
    <SectionContainer>
      <FormLayout methods={methods} onSubmit={onSubmit}>
        <FormLayout.Section>
          <div className="flex flex-col gap-4 md:flex-row md:gap-6 lg:gap-10">
            <InputField
              name="name"
              label="Group Name"
              placeholder="e.g. Summer Trip 2025"
            />
            <SelectField
              name="currency"
              label="Settlement Currency"
              disabled={mode === "edit"}
              options={currencies.map((c) => ({
                value: c.code,
                label: `${c.code} (${c.symbol})`,
              }))}
            />
          </div>

          <TextareaField
            name="description"
            label="Description (Optional)"
            placeholder="What is this group for?"
          />
        </FormLayout.Section>

        <FormLayout.Actions
          onCancel={onCancel}
          submitText={actionText}
          isSubmitting={isSubmitting}
          isSubmitDisabled={isSubmitDisabled}
        />
      </FormLayout>
    </SectionContainer>
  );
}

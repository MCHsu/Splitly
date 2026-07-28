"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { groupFormSchema, GroupFormData } from "@/lib/validations/group";
import { InputField } from "@/components/shared/form/input-field";
import { SelectField } from "@/components/shared/form/select-field";
import { TextareaField } from "@/components/shared/form/textarea-field";
import { FormLayout } from "@/components/shared/form/form-layout";
import { SectionContainer } from "@/components/shared/section-container";
import { createGroup } from "@/app/actions/group.action";
import type { CurrencyItem } from "@/app/api/currencies/route";

interface GroupFormProps {
  mode?: "add" | "edit";
  defaultValues?: Partial<GroupFormData>;
  onSubmit?: (data: GroupFormData) => void | Promise<unknown>;
  onCancel?: () => void;
}

export function GroupForm({
  mode = "add",
  defaultValues,
  onSubmit: onSubmitProp,
  onCancel,
}: GroupFormProps) {
  const [currencies, setCurrencies] = useState<CurrencyItem[]>([]);

  useEffect(() => {
    fetch("/api/currencies")
      .then((r) => r.json())
      .then((data: CurrencyItem[]) => setCurrencies(data))
      .catch(() => {});
  }, []);

  const methods = useForm<GroupFormData>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: defaultValues || {
      name: "",
      description: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = methods;

  const actionText = mode === "edit" ? "Update" : "Create";

  const onSubmit: SubmitHandler<GroupFormData> = async (data) => {
    if (onSubmitProp) {
      await onSubmitProp(data);
      return;
    }

    await createGroup(data);
  };

  return (
    <SectionContainer>
      <FormLayout methods={methods} onSubmit={onSubmit}>
        <FormLayout.Section>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-10">
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
            label="Description"
            placeholder="What is this group for?"
          />
        </FormLayout.Section>

        <FormLayout.Actions
          onCancel={onCancel}
          submitText={actionText}
          isSubmitting={isSubmitting}
        />
      </FormLayout>
    </SectionContainer>
  );
}

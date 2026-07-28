"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { Trash2, UserRoundPlus, CirclePlus } from "lucide-react";
import { UserAvatar } from "@/components/shared/user-avatar";
import { useState } from "react";

import { FieldGroup } from "@/components/ui/field";
import { InputField } from "@/components/shared/form/input-field";
import { FormLayout } from "@/components/shared/form/form-layout";
import {
  SectionContainer,
  SectionContainerItem,
} from "@/components/shared/section-container";
import { Button } from "@/components/ui/button";
import { memberFormSchema, MemberFormData } from "@/lib/validations/member";

interface MemberFormProps {
  defaultValues?: Partial<MemberFormData>;
  onSubmit?: (data: MemberFormData) => void;
  onCancel?: () => void;
}

type MemberItem = MemberFormData["members"][number];

export function MemberForm({
  defaultValues,
  onSubmit: onSubmitProp,
  onCancel,
}: Readonly<MemberFormProps>) {
  const methods = useForm<MemberFormData>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: defaultValues || {
      members: [{ name: "mmm" }, { name: "ssss" }],
    },
  });

  const {
    control,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const toggleDelete = (field: MemberItem) => {
    if (!field?.groupId) {
      const index = fields.findIndex((f) => f.id === field.id);
      if (index !== -1) {
        remove(index);
      }
      return;
    }
    const id = field.id!;

    setDeletedIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  };

  const onSubmit: SubmitHandler<MemberFormData> = (data) => {
    const filtered = {
      ...data,
      members: data.members.filter((m, idx) => {
        const field = fields[idx];
        return !deletedIds.includes(field.id);
      }),
    };
    if (onSubmitProp) {
      onSubmitProp(filtered);
    } else {
      console.log(filtered);
    }
  };

  console.log("@@@@@@", fields);

  return (
    <SectionContainer>
      <FormLayout methods={methods} onSubmit={onSubmit}>
        <FormLayout.Header
          title="Members"
          description="Manage members in this group."
        />
        <FormLayout.Section>
          <FieldGroup className="gap-0 divide-y">
            {fields.map((field, index) => {
              const isDeleted = deletedIds.includes(field.id);

              return (
                <SectionContainerItem
                  key={field.id}
                  className="flex items-center gap-2 px-0"
                >
                  <UserAvatar name={field.name} size="w-10 h-10" />

                  <InputField
                    name={`members[${index}].name`}
                    disabled={
                      (!!`${field.name}` && !!field?.groupId) || isDeleted
                    }
                    placeholder={`${field.name}` || "xxx"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => toggleDelete(field)}
                    disabled={isSubmitting}
                  >
                    {isDeleted ? <UserRoundPlus /> : <Trash2 />}
                  </Button>
                </SectionContainerItem>
              );
            })}
          </FieldGroup>
        </FormLayout.Section>

        <Button
          type="button"
          className="my-8 w-full"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => append({ name: "" })}
        >
          <CirclePlus />
          Add Member
        </Button>

        <FormLayout.Actions
          onCancel={onCancel}
          submitText="Save"
          isSubmitting={isSubmitting}
        />
      </FormLayout>
    </SectionContainer>
  );
}

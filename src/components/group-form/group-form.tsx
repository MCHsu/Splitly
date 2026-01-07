"use client";

import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { InputField } from "@/components/shared/form/input-field";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const groupFormSchema = z.object({
  name: z.string().min(1, "Group Name is required"),
  description: z.string().optional(),
});

type groupForm = z.infer<typeof groupFormSchema>;

interface GroupFormProps {
  mode?: "add" | "edit";
  defaultValues?: Partial<groupForm>;
  onSubmit?: (data: groupForm) => void;
  onCancel?: () => void;
}

export function GroupForm({
  mode = "add",
  defaultValues,
  onSubmit: onSubmitProp,
  onCancel,
}: GroupFormProps) {
  const methods = useForm<groupForm>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: defaultValues || {
      name: "",
      description: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const actionText = mode === "edit" ? "Update Group" : "Create Group";

  const onSubmit: SubmitHandler<groupForm> = (data) => {
    if (onSubmitProp) {
      onSubmitProp(data);
    } else {
      console.log(data);
    }
  };

  return (
    <div className="w-full max-w-md">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>
                {mode === "edit" ? "Edit Group" : "Create New Group"}
              </FieldLegend>
              <FieldDescription>
                All transactions are secure and encrypted
              </FieldDescription>

              <InputField
                name="name"
                label="Group Name"
                placeholder="e.g. Summer Trip 2025"
              />
              <InputField
                name="description"
                label="Description"
                placeholder="What is this group for?"
              />
            </FieldSet>
          </FieldGroup>

          <div className="mt-6 flex justify-center gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner />}
              {actionText}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export function AddGroupForm() {
  return <GroupForm mode="add" />;
}

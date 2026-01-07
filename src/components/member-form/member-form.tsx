"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  FormProvider,
} from "react-hook-form";
import * as z from "zod";
import { XIcon } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { InputField } from "@/components/shared/form/input-field";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const memberFormSchema = z.object({
  members: z
    .array(z.object({ name: z.string() }))
    .min(1, "At least one member must be added"),
});

type memberForm = z.infer<typeof memberFormSchema>;

interface MemberFormProps {
  mode?: "add" | "edit";
  defaultValues?: Partial<memberForm>;
  onSubmit?: (data: memberForm) => void;
  onCancel?: () => void;
}

export function MemberForm({
  mode = "add",
  defaultValues,
  onSubmit: onSubmitProp,
  onCancel,
}: MemberFormProps) {
  const methods = useForm<memberForm>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: defaultValues || {
      members: [{ name: "" }],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const actionText = mode === "edit" ? "Update" : "Save";

  const onSubmit: SubmitHandler<memberForm> = (data) => {
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
                {mode === "edit" ? "Edit Group Member" : "Add Group Member"}
              </FieldLegend>

              <FieldGroup>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <InputField
                      name={`members.${index}.name`}
                      label="Member Name"
                      placeholder="xxx"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => remove(index)}
                      disabled={isSubmitting}
                      aria-label={`Remove member ${index + 1}`}
                    >
                      <XIcon />
                    </Button>
                  </div>
                ))}
              </FieldGroup>
            </FieldSet>
          </FieldGroup>

          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => append({ name: "" })}
          >
            Add Member
          </Button>
          <FieldSeparator />

          <div className="flex justify-center gap-4">
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

export function AddMemberForm() {
  return <MemberForm mode="add" />;
}

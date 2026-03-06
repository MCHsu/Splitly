"use client";

import {
  FieldValues,
  Path,
  useFormContext,
  useController,
  ControllerRenderProps,
} from "react-hook-form";

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";

interface ControlledFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  description?: string;
  children: (
    fieldProps: ControllerRenderProps<T, Path<T>> & { id: string },
  ) => React.ReactNode;
}

export const ControlledField = <T extends FieldValues>({
  name,
  label,
  description,
  children,
}: ControlledFieldProps<T>) => {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control });

  return (
    <Field data-invalid={fieldState.invalid}>
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}

      {children({ ...field, id: name })}

      {description && <FieldDescription>{description}</FieldDescription>}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
};

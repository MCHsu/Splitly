"use client";

import {
  FieldValues,
  Path,
  useFormContext,
  useController,
} from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface InputFieldProps<T extends FieldValues> {
  key?: string;
  name: Path<T>;
  label: string;
  placeholder?: string;
  description?: string;
  type?: string;
  disabled?: boolean;
  handleOnBlur?: () => void;
}
export const InputField = <T extends FieldValues>({
  name,
  label,
  placeholder,
  description,
  type = "text",
  disabled,
  handleOnBlur = () => {},
}: InputFieldProps<T>) => {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control });

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input
        {...field}
        id={name}
        aria-invalid={fieldState.invalid}
        placeholder={placeholder}
        autoComplete="username"
        type={type}
        disabled={disabled}
        onBlur={() => {
          field.onBlur();
          handleOnBlur();
        }}
      />
      <FieldDescription>{description}</FieldDescription>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
};

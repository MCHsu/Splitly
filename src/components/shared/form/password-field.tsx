"use client";

import { useState } from "react";
import { ControlledField } from "@/components/shared/form/controlled-field";
import { BaseInput } from "@/components/shared/form/base-input";
import { InputGroupButton } from "@/components/ui/input-group";
import { Eye, EyeOff } from "lucide-react";
import { FieldValues, Path } from "react-hook-form";

interface PasswordFieldProps<T extends FieldValues> extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "name" | "label"
> {
  name: Path<T>;
  label?: string;
  description?: string;
}

export function PasswordField<T extends FieldValues>({
  name,
  label,
  description,
  ...props
}: PasswordFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  const showPasswordBtn = (
    <InputGroupButton
      aria-label={showPassword ? "Hide password" : "Show password"}
      title={showPassword ? "Hide password" : "Show password"}
      type="button"
      size="sm"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <EyeOff /> : <Eye />}
    </InputGroupButton>
  );

  return (
    <ControlledField name={name} label={label} description={description}>
      {(field) => (
        <BaseInput
          {...field}
          {...props}
          type={showPassword ? "text" : "password"}
          suffix={showPasswordBtn}
        />
      )}
    </ControlledField>
  );
}

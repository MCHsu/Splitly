"use client";

import React from "react";
import { FieldValues, Path } from "react-hook-form";

import { ControlledField } from "@/components/shared/form/controlled-field";
import { BaseInput } from "@/components/shared/form//base-input";

interface InputFieldProps<T extends FieldValues> extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "name" | "label" | "type"
> {
  name: Path<T>;
  label?: string;
  description?: string;
  type?: string;
  className?: string;
  handleOnBlur?: () => void;
  handleOnFocus?: () => void;
}

export const InputField = <T extends FieldValues>({
  name,
  label,
  description,
  type = "text",
  className,
  handleOnBlur = () => {},
  handleOnFocus = () => {},
  ...props
}: InputFieldProps<T>) => {
  return (
    <ControlledField name={name} label={label} description={description}>
      {(field) => (
        <BaseInput
          {...field}
          {...props}
          type={type}
          onFocus={() => {
            handleOnFocus();
          }}
          onBlur={() => {
            field.onBlur();
            handleOnBlur();
          }}
        />
      )}
    </ControlledField>
  );
};

"use client";

import { FieldValues, Path } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ControlledField } from "@/components/shared/form/controlled-field";

interface SelectOption<T = string> {
  value: T;
  label: React.ReactNode;
}

interface SelectFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  options: SelectOption[];
  toFormValue?: (value: string) => Record<string, any> | Record<string, any>[];
  toUIValue?: (value: any) => string;
}

export function SelectField<T extends FieldValues>({
  name,
  label,
  description,
  placeholder = "Select...",
  disabled,
  options,
  toFormValue,
  toUIValue,
}: SelectFieldProps<T>) {
  return (
    <ControlledField name={name} label={label} description={description}>
      {({ value, onChange }) => {
        const derivedValue = toUIValue ? toUIValue(value) : value;

        const selectedValue =
          derivedValue !== undefined && derivedValue !== null
            ? String(derivedValue)
            : "";

        return (
          <Select
            value={selectedValue}
            onValueChange={(newValue) => {
              const formattedValue = toFormValue
                ? toFormValue(newValue)
                : newValue;
              onChange(formattedValue);
            }}
            disabled={disabled}
          >
            <SelectTrigger className="h-10 min-h-10">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }}
    </ControlledField>
  );
}

"use client";

import React from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

interface BaseInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "prefix" | "suffix"
> {
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const BaseInput = ({
  prefix,
  suffix,
  className,
  ...props
}: BaseInputProps) => {
  return (
    <InputGroup className="h-10">
      <InputGroupInput className={cn(className)} {...props} />

      {prefix && (
        <InputGroupAddon align="inline-start">{prefix}</InputGroupAddon>
      )}

      {suffix && <InputGroupAddon align="inline-end">{suffix}</InputGroupAddon>}
    </InputGroup>
  );
};

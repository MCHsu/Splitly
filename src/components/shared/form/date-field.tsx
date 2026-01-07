"use client";

import { useState } from "react";
import {
  useController,
  useFormContext,
  FieldValues,
  Path,
} from "react-hook-form";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

interface DateFieldProps<T extends FieldValues> {
  name: Path<T>;
}

export const DateField = <T extends FieldValues>({
  name,
}: DateFieldProps<T>) => {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control });

  const [open, setOpen] = useState<boolean>(false);

  return (
    <Field className="flex flex-col gap-3">
      <FieldLabel htmlFor="date-picker" className="px-1">
        Date
      </FieldLabel>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker"
            className="w-32 justify-between font-normal"
          >
            {field.value ? field.value.toLocaleDateString() : "Select date"}
            <CalendarIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={field.value}
            captionLayout="dropdown"
            onSelect={(selectedDate) => {
              field.onChange(selectedDate);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
};

"use client";

import { useState } from "react";
import { FieldValues, Path } from "react-hook-form";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ControlledField } from "@/components/shared/form/controlled-field";

interface DateFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
}

export const DateField = <T extends FieldValues>({
  name,
  label = "Date",
}: DateFieldProps<T>) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <ControlledField name={name} label={label}>
      {({ value, onChange }) => (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger className="h-10" asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
            >
              {value ? value.toLocaleDateString() : "Select date"}
              <CalendarIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              captionLayout="dropdown"
              onSelect={(selectedDate) => {
                onChange(selectedDate);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      )}
    </ControlledField>
  );
};

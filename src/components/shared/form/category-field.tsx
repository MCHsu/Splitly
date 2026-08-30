"use client";

import { useState } from "react";
import { FieldValues, Path } from "react-hook-form";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ControlledField } from "@/components/shared/form/controlled-field";
import {
  EXPENSE_CATEGORIES,
  getExpenseCategory,
} from "@/lib/constants/expense-categories";
import { cn } from "@/lib/utils";

const DEFAULT_CATEGORY = "food-drink";

interface CategoryFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
}

export function CategoryField<T extends FieldValues>({
  name,
  label = "Category",
}: CategoryFieldProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <ControlledField name={name} label={label}>
      {({ value, onChange }) => {
        const resolvedValue =
          typeof value === "string" && value ? value : DEFAULT_CATEGORY;
        const selected =
          getExpenseCategory(resolvedValue) ?? EXPENSE_CATEGORIES[0];
        const SelectedIcon = selected.icon;

        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="select"
                size="select"
                id="category-picker"
                className="w-full justify-between text-sm font-normal"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-lg",
                      selected.color.bg,
                    )}
                  >
                    <SelectedIcon
                      className={cn("size-4", selected.color.icon)}
                    />
                  </span>
                  <span className="truncate">{selected.label}</span>
                </span>
                <ChevronDown className="size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[(--radix-popover-trigger-width)] p-2"
              align="start"
            >
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                {EXPENSE_CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  const isActive = resolvedValue === category.value;

                  return (
                    <button
                      key={category.value}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => {
                        onChange(category.value);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex flex-row items-center gap-2 rounded-lg px-2 py-2.5 text-center text-xs transition-colors hover:bg-muted",
                        isActive && "bg-muted ring-1 ring-ring/40",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-8 items-center justify-center rounded-lg",
                          category.color.bg,
                        )}
                      >
                        <Icon className={cn("size-4", category.color.icon)} />
                      </span>
                      <span className="leading-tight">{category.label}</span>
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        );
      }}
    </ControlledField>
  );
}

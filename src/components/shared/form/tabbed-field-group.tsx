import { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabbedFieldGroupProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: ReadonlyArray<{ value: string; label: string }>;
  children: (activeValue: string) => ReactNode;
}

export function TabbedFieldGroup({
  label,
  value,
  onValueChange,
  options,
  children,
}: TabbedFieldGroupProps) {
  return (
    <div className="flex flex-col gap-3">
      <Label className="text-sm font-medium">{label}</Label>

      <Tabs value={value} onValueChange={onValueChange}>
        <TabsList className="w-full">
          {options.map((option) => (
            <TabsTrigger
              key={option.value}
              value={option.value}
              className="rounded-lg text-sm data-[state=active]:shadow-sm"
            >
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={value} className="mt-2 animate-in fade-in-50">
          {children(value)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

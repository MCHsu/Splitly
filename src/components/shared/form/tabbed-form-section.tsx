import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface TabOption {
  value: string;
  label: string;
  content?: ReactNode;
}

interface TabbedFormSectionProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: TabOption[];
  className?: string;
  children?: ReactNode;
}

export function TabbedFormSection({
  label,
  value,
  onValueChange,
  options,
  className,
  children,
}: Readonly<TabbedFormSectionProps>) {
  const gridColsClass = options.length === 2 ? "grid-cols-2" : "grid-cols-4";

  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-base font-medium text-gray-700">{label}</Label>

      <Tabs value={value} onValueChange={onValueChange} className="w-full">
        <TabsList className={cn("grid w-full h-11", gridColsClass)}>
          {options.map((opt) => (
            <TabsTrigger
              key={opt.value}
              value={opt.value}
              className="text-xs sm:text-sm"
            >
              {opt.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {children ? (
          <div className="mt-4 animate-in fade-in-50">{children}</div>
        ) : (
          options.map((opt) => (
            <TabsContent
              key={opt.value}
              value={opt.value}
              className="mt-4 animate-in fade-in-50"
            >
              {opt.content}
            </TabsContent>
          ))
        )}
      </Tabs>
    </div>
  );
}

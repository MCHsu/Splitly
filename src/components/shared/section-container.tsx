import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

interface SectionContainerProps extends ComponentProps<"div"> {}

export function SectionContainer({ className, ...props }: SectionContainerProps) {
  return (
    <div
      data-slot="section-container"
      className={cn(
        "w-full overflow-hidden rounded-xl border bg-card p-4 md:p-6 lg:p-10",
        className,
      )}
      {...props}
    />
  );
}

interface SectionContainerItemProps extends ComponentProps<"div"> {}

export function SectionContainerItem({
  className,
  ...props
}: SectionContainerItemProps) {
  return (
    <div
      data-slot="section-container-item"
      className={cn("p-4", className)}
      {...props}
    />
  );
}

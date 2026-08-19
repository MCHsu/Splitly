import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

interface SectionContainerProps extends ComponentProps<"div"> {}

export function SectionContainer({
  className,
  ...props
}: SectionContainerProps) {
  return (
    <div
      data-slot="section-container"
      className={cn(
        "w-full overflow-hidden rounded-2xl border bg-card px-4 py-6 sm:rounded-3xl sm:p-6 lg:p-10",
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
      // className={cn("p-4", className)}
      // className={cn("px-4 py-4 md:px-6 lg:px-10", className)}
      className={cn("py-4", className)}
      {...props}
    />
  );
}

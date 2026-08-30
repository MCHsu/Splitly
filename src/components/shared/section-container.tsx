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
        "w-full overflow-hidden rounded-2xl border bg-card px-4 py-6 sm:rounded-[20px] sm:p-6 lg:p-10",
        className,
      )}
      {...props}
    />
  );
}

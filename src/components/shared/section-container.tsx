import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

function SectionContainer({ className, ...props }: ComponentProps<"div">) {
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

function SectionContainerItem({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="section-container-item"
      className={cn("px-4 py-4", className)}
      {...props}
    />
  );
}

export { SectionContainer, SectionContainerItem };

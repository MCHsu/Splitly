import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function PageContainer({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 py-6 sm:px-8 md:max-w-2xl md:py-10 lg:max-w-3xl lg:py-16 xl:max-w-5xl",
        className,
      )}
      {...props}
    />
  );
}

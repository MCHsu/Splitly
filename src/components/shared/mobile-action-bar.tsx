import type { ReactNode } from "react";

interface MobileActionBarProps {
  children: ReactNode;
}

export function MobileActionBar({ children }: MobileActionBarProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 border-t bg-background p-5 md:hidden">
      <div className="pointer-events-auto mx-auto flex w-full max-w-lg justify-center gap-2">
        {children}
      </div>
    </div>
  );
}

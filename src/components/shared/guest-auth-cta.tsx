"use client";

import { useRouter } from "next/navigation";
import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";

export function GuestAuthCta() {
  const router = useRouter();

  return (
    <div className="m-2 rounded-xl border bg-muted/50 p-4">
      <div className="flex gap-2">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
        <div className="min-w-0 space-y-1">
          <p className="text-sm leading-snug font-semibold">
            You're in guest mode
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Data stays on this device. Sign in to sync across devices and keep
            it from being lost.
          </p>
        </div>
      </div>
      <Button
        type="button"
        className="mt-3 w-full"
        onClick={() => router.push("/auth")}
      >
        Sign in / Sign up
      </Button>
    </div>
  );
}

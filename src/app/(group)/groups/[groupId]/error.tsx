"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

interface GroupErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GroupError({ error, reset }: GroupErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        Couldn&apos;t load this group
      </h1>
      <p className="text-sm text-muted-foreground">
        Something went wrong while loading the group. You can try again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}

"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/page-container";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="text-sm text-muted-foreground">
          An unexpected error occurred. You can try again.
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </PageContainer>
  );
}

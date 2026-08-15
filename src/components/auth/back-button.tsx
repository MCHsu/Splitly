"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="mb-4 text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft />
      Back
    </Button>
  );
}

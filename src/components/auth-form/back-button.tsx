"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  readonly onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="mb-4 text-gray-500 hover:text-gray-700"
    >
      <ArrowLeft />
      Back
    </Button>
  );
}

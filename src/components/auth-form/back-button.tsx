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
      className=" text-gray-500 hover:text-gray-700 mb-4"
    >
      <ArrowLeft />
      Back
    </Button>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  onClick?: () => void;
  className?: string;
}

export function BackButton({ onClick, className }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-lg"
      onClick={onClick ?? (() => router.back())}
      className={cn("text-muted-foreground hover:text-foreground", className)}
    >
      <ArrowLeft className="size-5" />
    </Button>
  );
}

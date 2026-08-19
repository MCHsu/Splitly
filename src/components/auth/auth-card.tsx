"use client";

import type { ReactNode } from "react";

import { BackButton } from "@/components/shared/back-button";
import { LogoIcon } from "@/components/shared/logo-icon";
import { SectionContainer } from "@/components/shared/section-container";
import { StatusMessage } from "@/components/shared/status-message";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  error?: string | null;
  onBack?: () => void;
  children: ReactNode;
}

export function AuthCard({
  title,
  subtitle,
  error,
  onBack,
  children,
}: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-6">
      <div className="w-full max-w-md">
        <SectionContainer className="flex flex-col gap-10 py-10">
          <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
            <div className="flex flex-col items-center gap-4">
              {onBack && (
                <div className="flex w-full justify-start">
                  <BackButton onClick={onBack} />
                </div>
              )}
              <LogoIcon />
            </div>

            <div className="flex flex-col gap-1 text-center">
              <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground md:text-base">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {error && <StatusMessage tone="error">{error}</StatusMessage>}
            {children}
          </div>
        </SectionContainer>
      </div>
    </div>
  );
}

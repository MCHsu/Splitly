"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface JoinIdentityStepProps {
  onContinueWithEmail: () => void;
  onContinueAsGuest: () => void;
  isGuestLoading?: boolean;
}

export function JoinIdentityStep({
  onContinueWithEmail,
  onContinueAsGuest,
  isGuestLoading = false,
}: JoinIdentityStepProps) {
  return (
    <div className="flex flex-col gap-3">
      <Button
        type="button"
        size="lg"
        className="w-full font-medium"
        onClick={onContinueWithEmail}
        disabled={isGuestLoading}
      >
        Continue with email
      </Button>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full font-medium"
        onClick={onContinueAsGuest}
        disabled={isGuestLoading}
      >
        {isGuestLoading && <Spinner />}
        Continue as guest
      </Button>
    </div>
  );
}

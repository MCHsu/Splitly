"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { joinGroup } from "@/app/actions/member.action";
import { AuthCard } from "@/components/auth/auth-card";
import { EmailAuthSteps } from "@/components/auth/email-auth-steps";
import { JoinIdentityStep } from "@/components/join/join-identity-step";
import {
  JoinMemberStep,
  type UnclaimedMember,
} from "@/components/join/join-member-step";
import { authClient } from "@/lib/auth-client";
import { type StepHeading, useEmailAuth } from "@/hooks/use-email-auth";

type JoinStep = "identity" | "auth" | "claim";

interface JoinGroupFormProps {
  inviteCode: string;
  groupName: string;
  unclaimedMembers: UnclaimedMember[];
  isSignedIn: boolean;
}

function getJoinHeading(step: JoinStep, groupName: string): StepHeading | null {
  if (step === "identity") {
    return {
      title: `Join ${groupName}`,
      subtitle: "Continue with email, or join as a guest",
    };
  }

  if (step === "claim") {
    return {
      title: "Who are you?",
      subtitle: "Pick the name the group already added for you",
    };
  }

  return null;
}

export function JoinGroupForm({
  inviteCode,
  groupName,
  unclaimedMembers,
  isSignedIn,
}: JoinGroupFormProps) {
  const router = useRouter();

  const [step, setStep] = useState<JoinStep>(isSignedIn ? "claim" : "identity");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const auth = useEmailAuth({
    onAuthenticated: () => setStep("claim"),
  });
  const { error, setError } = auth;

  const handleContinueWithEmail = () => {
    setError(null);
    setStep("auth");
  };

  const handleContinueAsGuest = async () => {
    setError(null);
    setIsGuestLoading(true);

    try {
      await authClient.signIn.anonymous();
      setStep("claim");
    } catch {
      setError("Failed to start guest session. Please try again.");
    } finally {
      setIsGuestLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!selectedMemberId) return;

    setError(null);
    setIsJoining(true);

    try {
      const result = await joinGroup(inviteCode, selectedMemberId);

      if (result.success && result.groupId) {
        router.push(`/groups/${result.groupId}`);
        router.refresh();
      } else {
        setError(result.error ?? "Failed to join group");
        setSelectedMemberId(null);
        router.refresh();
      }
    } catch {
      setError("Failed to join group");
    } finally {
      setIsJoining(false);
    }
  };

  const handleBack = () => {
    setError(null);

    if (auth.step !== "email") {
      auth.backToEmailStep();
      return;
    }

    auth.resetFlow();
    setStep("identity");
  };

  const heading = getJoinHeading(step, groupName) ?? auth.heading;

  return (
    <AuthCard
      title={heading.title}
      subtitle={heading.subtitle}
      error={error}
      onBack={step === "auth" ? handleBack : undefined}
    >
      {step === "identity" && (
        <JoinIdentityStep
          onContinueWithEmail={handleContinueWithEmail}
          onContinueAsGuest={handleContinueAsGuest}
          isGuestLoading={isGuestLoading}
        />
      )}

      {step === "auth" && <EmailAuthSteps auth={auth} />}

      {step === "claim" && (
        <JoinMemberStep
          members={unclaimedMembers}
          selectedMemberId={selectedMemberId}
          onSelect={setSelectedMemberId}
          onSubmit={handleClaim}
          isSubmitting={isJoining}
        />
      )}
    </AuthCard>
  );
}

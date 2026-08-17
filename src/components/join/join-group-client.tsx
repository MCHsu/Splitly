"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { checkEmailExists } from "@/app/actions/auth.action";
import { joinGroup } from "@/app/actions/member.action";
import { BackButton } from "@/components/auth/back-button";
import { EmailStep } from "@/components/auth/email-step";
import { PasswordStep } from "@/components/auth/password-step";
import { RegisterStep } from "@/components/auth/register-step";
import { JoinIdentityStep } from "@/components/join/join-identity-step";
import {
  JoinMemberStep,
  type UnclaimedMember,
} from "@/components/join/join-member-step";
import { LogoIcon } from "@/components/shared/logo-icon";
import { SectionContainer } from "@/components/shared/section-container";
import { StatusMessage } from "@/components/shared/status-message";
import { Spinner } from "@/components/ui/spinner";
import { authClient, signIn, signUp } from "@/lib/auth-client";
import {
  emailStepSchema,
  signInFormSchema,
  signUpFormSchema,
  EmailStepData,
  SignInFormData,
  SignUpFormData,
} from "@/lib/validations/auth";

type JoinStep = "identity" | "email" | "signin" | "signup" | "claim";

interface JoinGroupClientProps {
  inviteCode: string;
  groupName: string;
  unclaimedMembers: UnclaimedMember[];
}

export function JoinGroupClient({
  inviteCode,
  groupName,
  unclaimedMembers,
}: JoinGroupClientProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [step, setStep] = useState<JoinStep>("identity");
  const [error, setError] = useState<string | null>(null);
  const [emailValue, setEmailValue] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const emailMethods = useForm<EmailStepData>({
    resolver: zodResolver(emailStepSchema),
    defaultValues: { email: "" },
  });

  const signInMethods = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpMethods = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (isPending || hasInitialized) return;

    if (session) {
      setStep("claim");
    }

    setHasInitialized(true);
  }, [isPending, session, hasInitialized]);

  const handleEmailSubmit: SubmitHandler<EmailStepData> = async (data) => {
    setError(null);
    setIsChecking(true);

    try {
      const exists = await checkEmailExists(data.email);
      setEmailValue(data.email);

      if (exists) {
        signInMethods.setValue("email", data.email);
        setStep("signin");
      } else {
        signUpMethods.setValue("email", data.email);
        setStep("signup");
      }
    } catch {
      setError("Failed to check email. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleSignIn: SubmitHandler<SignInFormData> = async (data) => {
    setError(null);

    try {
      const { error: signInError } = await signIn.email(data);
      if (signInError) {
        setError(signInError.message as string);
      } else {
        setStep("claim");
      }
    } catch {
      setError("An unexpected error occurred");
    }
  };

  const handleSignUp: SubmitHandler<SignUpFormData> = async (data) => {
    setError(null);

    try {
      const { error: signUpError } = await signUp.email(data);
      if (signUpError) {
        setError(signUpError.message as string);
      } else {
        setStep("claim");
      }
    } catch {
      setError("An unexpected error occurred");
    }
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
    setIsSubmitting(true);

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
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setError(null);

    if (step === "signin" || step === "signup") {
      setStep("email");
      emailMethods.setValue("email", emailValue);
      signInMethods.reset({ email: "", password: "" });
      signUpMethods.reset({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      return;
    }

    if (step === "email") {
      setStep("identity");
      emailMethods.reset({ email: "" });
      setEmailValue("");
    }
  };

  const showBack = step === "email" || step === "signin" || step === "signup";

  const title =
    step === "identity"
      ? `Join ${groupName}`
      : step === "email"
        ? "Welcome to Splitly"
        : step === "signin"
          ? "Welcome back"
          : step === "signup"
            ? "Create your account"
            : "Who are you?";

  const subtitle =
    step === "identity"
      ? "Continue with email, or join as a guest"
      : step === "email"
        ? "Enter your email to continue"
        : step === "signin" || step === "signup"
          ? emailValue
          : "Pick the name the group already added for you";

  if (isPending || !hasInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted px-4">
        <div className="w-full max-w-md">
          <SectionContainer>
            <div className="flex justify-center py-12">
              <Spinner className="size-8" />
            </div>
          </SectionContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md">
        <SectionContainer>
          <div className="mb-5 flex flex-col items-center justify-between">
            <div className="flex w-full justify-start">
              {showBack && <BackButton onClick={handleBack} />}
            </div>

            <div className="shrink-0">
              <LogoIcon />
            </div>
          </div>

          <div className="mb-10 text-center">
            <h1 className="mb-1 text-2xl font-semibold text-foreground">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>

          {error && (
            <StatusMessage tone="error" className="mb-4">
              {error}
            </StatusMessage>
          )}

          {step === "identity" && (
            <JoinIdentityStep
              onContinueWithEmail={() => {
                setError(null);
                setStep("email");
              }}
              onContinueAsGuest={handleContinueAsGuest}
              isGuestLoading={isGuestLoading}
            />
          )}

          {step === "email" && (
            <EmailStep
              methods={emailMethods}
              isChecking={isChecking}
              onSubmit={handleEmailSubmit}
            />
          )}

          {step === "signin" && (
            <PasswordStep methods={signInMethods} onSubmit={handleSignIn} />
          )}

          {step === "signup" && (
            <RegisterStep methods={signUpMethods} onSubmit={handleSignUp} />
          )}

          {step === "claim" && (
            <JoinMemberStep
              members={unclaimedMembers}
              selectedMemberId={selectedMemberId}
              onSelect={setSelectedMemberId}
              onSubmit={handleClaim}
              isSubmitting={isSubmitting}
            />
          )}
        </SectionContainer>
      </div>
    </div>
  );
}

"use client";

import type { EmailAuthFlow } from "@/hooks/use-email-auth";

import { EmailStep } from "@/components/auth/email-step";
import { PasswordStep } from "@/components/auth/password-step";
import { RegisterStep } from "@/components/auth/register-step";

interface EmailAuthStepsProps {
  auth: EmailAuthFlow;
}

export function EmailAuthSteps({ auth }: EmailAuthStepsProps) {
  if (auth.step === "email") {
    return (
      <EmailStep
        methods={auth.emailMethods}
        isChecking={auth.isCheckingEmail}
        onSubmit={auth.submitEmail}
      />
    );
  }

  if (auth.step === "signin") {
    return (
      <PasswordStep methods={auth.signInMethods} onSubmit={auth.submitSignIn} />
    );
  }

  return <RegisterStep methods={auth.signUpMethods} onSubmit={auth.submitSignUp} />;
}

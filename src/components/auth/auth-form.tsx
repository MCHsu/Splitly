"use client";

import { useRouter } from "next/navigation";

import { AuthCard } from "@/components/auth/auth-card";
import { EmailAuthSteps } from "@/components/auth/email-auth-steps";
import { useEmailAuth } from "@/hooks/use-email-auth";

export function AuthForm() {
  const router = useRouter();

  const auth = useEmailAuth({
    onAuthenticated: () => {
      router.push("/groups");
      router.refresh();
    },
  });

  return (
    <AuthCard
      title={auth.heading.title}
      subtitle={auth.heading.subtitle}
      error={auth.error}
      onBack={auth.step === "email" ? undefined : auth.backToEmailStep}
    >
      <EmailAuthSteps auth={auth} />
    </AuthCard>
  );
}

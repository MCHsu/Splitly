"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Logo } from "@/components/shared/logo";
import { BackButton } from "@/components/auth-form/back-button";
import { EmailStep } from "@/components/auth-form/email-step";
import { PasswordStep } from "@/components/auth-form/password-step";
import { RegisterStep } from "@/components/auth-form/register-step";
import { SectionContainer } from "@/components/shared/section-container";
import {
  emailStepSchema,
  signInFormSchema,
  signUpFormSchema,
  EmailStepData,
  SignInFormData,
  SignUpFormData,
} from "@/lib/validations/auth";
import { authClient, signIn, signUp } from "@/lib/auth-client";
import { checkEmailExists } from "@/app/actions/auth.action";

type AuthStep = "email" | "signin" | "signup";

export function AuthForm() {
  const [step, setStep] = useState<AuthStep>("email");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [emailValue, setEmailValue] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const router = useRouter();

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
      const { error } = await signIn.email(data);
      if (error) {
        setError(error.message as string);
      } else {
        router.push("/groups");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
    }
  };

  const handleSignUp: SubmitHandler<SignUpFormData> = async (data) => {
    setError(null);

    try {
      const { error } = await signUp.email(data);
      if (error) {
        setError(error.message as string);
      } else {
        router.push("/groups");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
    }
  };

  const handleBack = () => {
    setStep("email");
    setError(null);
    setSuccessMessage(null);
    emailMethods.setValue("email", emailValue);

    // Reset signInMethods and signUpMethods to clear previous inputs
    signInMethods.reset({ email: "", password: "" });
    signUpMethods.reset({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const title =
    step === "email"
      ? "Welcome to Splitly"
      : step === "signin"
        ? "Welcome back"
        : "Create your account";

  const subtitle =
    step === "email" ? "Enter your email to continue" : emailValue;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <SectionContainer>
          <div className="flex flex-col items-center justify-between mb-6">
            <div className="w-full flex justify-start">
              {/* {step !== "email" && <BackButton onClick={handleBack} />} */}
              <BackButton onClick={handleBack} />
            </div>

            <div className="shrink-0">
              <Logo />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              {title}
            </h1>
            <p className="text-gray-600 text-sm">{subtitle}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
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
        </SectionContainer>
      </div>
    </div>
  );
}

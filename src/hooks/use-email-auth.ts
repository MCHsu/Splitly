"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";

import { checkEmailExists } from "@/app/actions/auth.action";
import { signIn, signUp } from "@/lib/auth-client";
import {
  type EmailStepData,
  emailStepSchema,
  type SignInFormData,
  signInFormSchema,
  type SignUpFormData,
  signUpFormSchema,
} from "@/lib/validations/auth";

export type EmailAuthStep = "email" | "signin" | "signup";
export type StepHeading = { title: string; subtitle?: string };

const STEP_HEADINGS: Record<EmailAuthStep, StepHeading> = {
  email: { title: "Welcome to Splitly", subtitle: "Enter your email to continue" },
  signin: { title: "Welcome back" },
  signup: { title: "Create your account" },
};

interface UseEmailAuthOptions {
  onAuthenticated: () => void;
}

export function useEmailAuth({ onAuthenticated }: UseEmailAuthOptions) {
  const [step, setStep] = useState<EmailAuthStep>("email");
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

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

  const submitEmail: SubmitHandler<EmailStepData> = async (data) => {
    setError(null);
    setIsCheckingEmail(true);

    try {
      const exists = await checkEmailExists(data.email);
      setEmail(data.email);

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
      setIsCheckingEmail(false);
    }
  };

  const submitSignIn: SubmitHandler<SignInFormData> = async (data) => {
    setError(null);

    try {
      const { error: signInError } = await signIn.email(data);
      if (signInError) {
        setError(signInError.message as string);
        return;
      }

      onAuthenticated();
    } catch {
      setError("An unexpected error occurred");
    }
  };

  const submitSignUp: SubmitHandler<SignUpFormData> = async (data) => {
    setError(null);

    try {
      const { error: signUpError } = await signUp.email(data);
      if (signUpError) {
        setError(signUpError.message as string);
        return;
      }

      onAuthenticated();
    } catch {
      setError("An unexpected error occurred");
    }
  };

  const backToEmailStep = () => {
    setStep("email");
    setError(null);
    emailMethods.setValue("email", email);

    signInMethods.reset({ email: "", password: "" });
    signUpMethods.reset({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const resetFlow = () => {
    setStep("email");
    setError(null);
    setEmail("");
    emailMethods.reset({ email: "" });
    signInMethods.reset({ email: "", password: "" });
    signUpMethods.reset({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return {
    step,
    email,
    isCheckingEmail,
    error,
    setError,
    emailMethods,
    signInMethods,
    signUpMethods,
    submitEmail,
    submitSignIn,
    submitSignUp,
    backToEmailStep,
    resetFlow,
    heading: {
      title: STEP_HEADINGS[step].title,
      subtitle: STEP_HEADINGS[step].subtitle ?? email,
    },
  };
}

export type EmailAuthFlow = ReturnType<typeof useEmailAuth>;

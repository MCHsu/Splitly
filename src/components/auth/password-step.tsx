"use client";

import { FormProvider, SubmitHandler, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { SignInFormData } from "@/lib/validations/auth";
import { PasswordField } from "@/components/shared/form/password-field";

interface PasswordStepProps {
  methods: UseFormReturn<SignInFormData>;
  onSubmit: SubmitHandler<SignInFormData>;
}

export function PasswordStep({ methods, onSubmit }: PasswordStepProps) {
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="mb-2">
          <PasswordField
            name="password"
            label="Password"
            placeholder="Enter your password"
          />
        </div>
        <div className="mb-4 text-right"></div>

        <Button
          type="submit"
          disabled={methods.formState.isSubmitting}
          size="lg"
          className="w-full font-medium"
        >
          {methods.formState.isSubmitting && <Spinner />}
          SIGN IN
        </Button>
      </form>
    </FormProvider>
  );
}

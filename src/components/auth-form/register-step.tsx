"use client";

import { FormProvider, SubmitHandler, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/shared/form/input-field";
import { Spinner } from "@/components/ui/spinner";
import { SignUpFormData } from "@/lib/validations/auth";
import { PasswordField } from "@/components/shared/form/password-field";

interface RegisterStepProps {
  readonly methods: UseFormReturn<SignUpFormData>;
  readonly onSubmit: SubmitHandler<SignUpFormData>;
}

export function RegisterStep({ methods, onSubmit }: RegisterStepProps) {
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="mb-6 flex flex-col gap-4">
          <InputField
            name="name"
            label="Name"
            type="text"
            placeholder="Your name"
          />
          <PasswordField
            name="password"
            label="Password"
            placeholder="At least 8 characters"
          />
          <PasswordField
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Re-enter your password"
          />
        </div>

        <Button
          type="submit"
          disabled={methods.formState.isSubmitting}
          className="h-11 w-full bg-blue-600 font-medium text-white hover:bg-blue-700"
        >
          {methods.formState.isSubmitting && <Spinner />}
          CREATE ACCOUNT
        </Button>
      </form>
    </FormProvider>
  );
}

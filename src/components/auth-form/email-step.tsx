"use client";

import { FormProvider, SubmitHandler, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/shared/form/input-field";
import { Spinner } from "@/components/ui/spinner";
import { EmailStepData } from "@/lib/validations/auth";

interface EmailStepProps {
  readonly methods: UseFormReturn<EmailStepData>;
  readonly isChecking: boolean;
  readonly onSubmit: SubmitHandler<EmailStepData>;
}

export function EmailStep({ methods, isChecking, onSubmit }: EmailStepProps) {
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="mb-6">
          <InputField
            name="email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
          />
        </div>

        <Button
          type="submit"
          disabled={isChecking}
          className="h-11 w-full bg-blue-600 font-medium text-white hover:bg-blue-700"
        >
          {isChecking && <Spinner />}
          CONTINUE
        </Button>
      </form>
    </FormProvider>
  );
}

"use client";

import { FormProvider, SubmitHandler, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/shared/form/input-field";
import { Spinner } from "@/components/ui/spinner";
import { EmailStepData } from "@/lib/validations/auth";

interface EmailStepProps {
  methods: UseFormReturn<EmailStepData>;
  isChecking: boolean;
  onSubmit: SubmitHandler<EmailStepData>;
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
          size="lg"
          className="w-full font-medium"
        >
          {isChecking && <Spinner />}
          CONTINUE
        </Button>
      </form>
    </FormProvider>
  );
}

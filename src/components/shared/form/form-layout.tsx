"use client";

import { ReactNode } from "react";
import {
  FormProvider,
  UseFormReturn,
  FieldValues,
  SubmitHandler,
} from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { FieldGroup, FieldSet } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface FormLayoutProps<T extends FieldValues> {
  methods: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  className?: string;
  children: ReactNode;
}

interface FormLayoutHeaderProps {
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
}

interface FormLayoutSectionProps {
  children: ReactNode;
  className?: string;
}

interface FormLayoutActionsProps {
  onCancel?: () => void;
  cancelHref?: string;
  submitText: string;
  isSubmitting?: boolean;
  isSubmitDisabled?: boolean;
  cancelText?: string;
  className?: string;
}

function FormLayoutRoot<T extends FieldValues>({
  methods,
  onSubmit,
  className,
  children,
}: FormLayoutProps<T>) {
  const { handleSubmit } = methods;

  return (
    <div className={cn("w-full", className)}>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={cn("flex flex-col gap-8 lg:gap-10", className)}
        >
          {children}
        </form>
      </FormProvider>
    </div>
  );
}

function FormLayoutHeader({
  title,
  description,
  className,
}: FormLayoutHeaderProps) {
  const router = useRouter();

  return (
    <div className={className}>
      {title && <h2 className="mb-2 text-3xl font-bold">{title}</h2>}

      {description && (
        <p className="mb-8 text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

function FormLayoutSection({ children, className }: FormLayoutSectionProps) {
  return (
    <FieldGroup className={className}>
      <FieldSet>{children}</FieldSet>
    </FieldGroup>
  );
}

function FormLayoutActions({
  onCancel,
  cancelHref,
  submitText,
  isSubmitting,
  isSubmitDisabled,
  cancelText = "Cancel",
  className,
}: FormLayoutActionsProps) {
  const sharedButtonClasses = "flex-1 md:flex-none md:w-32 lg:w-40";

  const renderCancelButton = () => {
    if (cancelHref) {
      return (
        <Button
          type="button"
          variant="outline"
          asChild
          className={sharedButtonClasses}
        >
          <Link href={cancelHref}>{cancelText}</Link>
        </Button>
      );
    }

    if (onCancel) {
      return (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className={sharedButtonClasses}
        >
          {cancelText}
        </Button>
      );
    }

    return null;
  };

  return (
    <div className={cn("flex justify-end gap-4 md:gap-6", className)}>
      {renderCancelButton()}

      <Button
        type="submit"
        disabled={isSubmitting || isSubmitDisabled}
        className={sharedButtonClasses}
      >
        {isSubmitting && <Spinner />}
        {submitText}
      </Button>
    </div>
  );
}

export const FormLayout = Object.assign(FormLayoutRoot, {
  Header: FormLayoutHeader,
  Section: FormLayoutSection,
  Actions: FormLayoutActions,
});

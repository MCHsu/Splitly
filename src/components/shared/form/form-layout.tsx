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
import { ArrowLeft } from "lucide-react";

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
          className={cn("flex flex-col gap-6 lg:gap-10", className)}
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
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {title && <h2 className="text-3xl font-bold mb-2">{title}</h2>}

      {description && <p className="text-gray-600 mb-8">{description}</p>}
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
  cancelText = "Cancel",
  className,
}: FormLayoutActionsProps) {
  return (
    <div className={cn("flex justify-end gap-6", className)}>
      {cancelHref ? (
        <Button
          type="button"
          variant="outline"
          asChild
          className="w-28 md:w-32 lg:w-40"
        >
          <Link href={cancelHref}>{cancelText}</Link>
        </Button>
      ) : onCancel ? (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-28 md:w-32 lg:w-40"
        >
          {cancelText}
        </Button>
      ) : null}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-28 md:w-32 lg:w-40"
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

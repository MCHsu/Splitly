import {
  FieldValues,
  Path,
  useFormContext,
  useController,
} from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

interface TextareaFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  handleOnBlur?: () => void;
}

export const TextareaField = <T extends FieldValues>({
  name,
  label,
  placeholder,
  description,
  disabled,
  handleOnBlur = () => {},
}: TextareaFieldProps<T>) => {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control });

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Textarea
        {...field}
        id={name}
        aria-invalid={fieldState.invalid}
        placeholder={placeholder}
        disabled={disabled}
        onBlur={() => {
          field.onBlur();
          handleOnBlur();
        }}
      />
      <FieldDescription>{description}</FieldDescription>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
};

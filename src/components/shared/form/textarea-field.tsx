import { FieldValues, Path } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { ControlledField } from "@/components/shared/form/controlled-field";

interface TextareaFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
}

export function TextareaField<T extends FieldValues>({
  name,
  label,
  description,
  ...props
}: TextareaFieldProps<T>) {
  return (
    <ControlledField name={name} label={label} description={description}>
      {(field) => <Textarea {...field} {...props} />}
    </ControlledField>
  );
}

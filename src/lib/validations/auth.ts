import { z } from "zod";

export const signInFormSchema = z.object({
  email: z.string().email({ error: "Please enter a valid email." }).trim(),
  password: z.string().min(1, "Password is required"),
});

export const signUpFormSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Name must be at least 2 characters long." })
    .trim(),
  email: z
    .string()
    .min(1, "Email is required")
    .email({ error: "Please enter a valid email." })
    .trim(),
  password: z
    .string()
    .min(8, { error: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { error: "Contain at least one letter." })
    .regex(/[0-9]/, { error: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      error: "Contain at least one special character.",
    })
    .trim(),
});

export type SignInFormData = z.infer<typeof signInFormSchema>;
export type SignUpFormData = z.infer<typeof signUpFormSchema>;

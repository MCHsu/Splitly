import * as z from "zod";

export const SplitMethodSchema = z.enum(["SHARES", "EXACT"]);

export const PaymentSchema = z.object({
  memberId: z.string().min(1, "Member ID is required"),
  amount: z.coerce.number().min(0, "Payment amount cannot be negative"),
});

export const AllocationSchema = z.object({
  memberId: z.string().min(1, "Member ID is required"),
  amount: z.coerce.number().min(0, "Value cannot be negative"),
});

export const expenseFormSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.coerce
    .number()
    .min(0.01, "Amount must be greater than 0")
    .max(10000000, "Amount exceeds the maximum limit"),
  date: z.date(),
  paidByMode: z.enum(["single", "multiple"]).default("single"),
  paidBy: z.array(PaymentSchema).min(1, "At least one payer is required"),
  allocations: z
    .array(AllocationSchema)
    .min(1, "At least one member must be selected"),
  note: z.string().optional(),
});

export type ExpenseFormData = z.infer<typeof expenseFormSchema>;

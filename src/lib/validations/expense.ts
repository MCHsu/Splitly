import * as z from "zod";

import { SplitMethod } from "@/generated/prisma/enums";
import { isTwoDecimalPlaces, sumSelectedCents, toCents } from "@/lib/money";

export const SplitMethodSchema = z.nativeEnum(SplitMethod);

export const AllocationSchema = z.object({
  memberId: z.string(),
  // The amount inputs hand back strings so the user can type "10." mid-edit.
  amount: z.coerce
    .number()
    .min(0, "Value cannot be negative")
    .refine(
      isTwoDecimalPlaces,
      "Amount can only have up to two decimal places",
    ),
  isSelected: z.boolean(),
  isManual: z.boolean(),
});

export const expenseFormSchema = z
  .object({
    description: z.string().min(1, "Description is required"),
    amount: z.coerce
      .number()
      .min(0.01, "Amount must be greater than 0")
      .max(10000000, "Amount exceeds the maximum limit")
      .refine(
        isTwoDecimalPlaces,
        "Amount can only have up to two decimal places",
      ),
    date: z.date(),
    category: z.string().optional(),
    splitMethod: SplitMethodSchema,
    paidBy: z.array(AllocationSchema).min(1, "At least one payer is required"),
    allocations: z
      .array(AllocationSchema)
      .min(1, "At least one member must be selected"),
    note: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const targetCents = toCents(data.amount);

    const balances = [
      {
        path: "paidBy" as const,
        rows: data.paidBy,
        emptyMessage: "Select at least one payer",
        unbalancedMessage: "Payers must add up to the expense amount",
      },
      {
        path: "allocations" as const,
        rows: data.allocations,
        emptyMessage: "Select at least one member to split with",
        unbalancedMessage: "The split must add up to the expense amount",
      },
    ];

    for (const { path, rows, emptyMessage, unbalancedMessage } of balances) {
      if (!rows.some((row) => row.isSelected)) {
        ctx.addIssue({ code: "custom", path: [path], message: emptyMessage });
      } else if (sumSelectedCents(rows) !== targetCents) {
        ctx.addIssue({
          code: "custom",
          path: [path],
          message: unbalancedMessage,
        });
      }
    }
  });

export type AllocationData = z.infer<typeof AllocationSchema>;

export type ExpenseFormData = z.infer<typeof expenseFormSchema>;

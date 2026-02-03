import * as z from "zod";

export const memberFormSchema = z.object({
  members: z
    .array(
      z.object({
        name: z.string(),
        id: z.string().optional(),
        groupId: z.string().optional(),
        userId: z.string().optional(),
        user: z.object({}).optional(),
      }),
    )
    .min(1, "At least one member must be added"),
});

export type MemberFormData = z.infer<typeof memberFormSchema>;

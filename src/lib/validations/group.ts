import * as z from "zod";

export const groupFormSchema = z.object({
  name: z.string().min(1, "Group Name is required"),
  description: z.string().optional(),
  currency: z.string().min(1, "Currency is required"),
});

export type GroupFormData = z.infer<typeof groupFormSchema>;

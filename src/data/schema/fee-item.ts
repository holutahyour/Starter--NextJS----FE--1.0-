import { z } from "zod";

export const feeItemSchema = z.object({
  feeName: z.string().min(1, { message: "Fee name is required" }),
  accountNumber: z.string().min(1, { message: "Account number is required" }),
  feeCategoryCode: z.string().min(1, { message: "Fee category code is required" }),
  description: z.string().optional(),
});

export type FeeItemValues = z.infer<typeof feeItemSchema>;
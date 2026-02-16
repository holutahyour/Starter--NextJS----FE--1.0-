import { z } from "zod"

export const miscellaneousFeeSchema = z.object({
  code: z.string().optional(), // assuming backend can generate it
  feeCategoryCode: z.string().min(1, "Fee category is required"),
  miscellaneousFeeName: z.string().min(1, "Name is required"),
  studentType: z.number().int().min(0, "Student type is required"),
  amount: z.number().min(1, "Amount must be greater than 0"),
  revenueAccount: z.string().min(1, "Revenue account is required"),
})

export type MiscellaneousFeeValues = z.infer<typeof miscellaneousFeeSchema>

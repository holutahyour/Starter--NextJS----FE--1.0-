import { z } from "zod"


export const erpSettingSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  baseUrl: z.string().min(2, {
    message: "base url must be at least 2 characters.",
  }),

  description: z.string(),
});

export type ErpSettingsValues = z.infer<typeof erpSettingSchema>
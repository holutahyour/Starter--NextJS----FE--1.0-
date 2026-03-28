import { z } from "zod";

export const createItemRequestSchema = z.object({
  itemId: z.string().optional(),
  itemName: z.string().min(2, { message: "Item Name must be at least 2 characters." }),
  quantity: z
    .number({ invalid_type_error: "Quantity is required." })
    .positive({ message: "Quantity must be greater than 0." })
    .int({ message: "Quantity must be an integer." }),
  purpose: z.string().min(3, { message: "Purpose is required." }),
  departmentId: z.string().min(1, { message: "Department is required." }),
});

export type CreateItemRequestValues = z.infer<typeof createItemRequestSchema>;

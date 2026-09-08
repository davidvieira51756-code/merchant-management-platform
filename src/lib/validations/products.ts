import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),

  description: z
    .string()
    .trim()
    .optional(),

  price: z.coerce
    .number()
    .min(0, "Price cannot be negative"),

  available: z.boolean(),
});

export type ProductFormInput = z.input<typeof productSchema>;
export type ProductFormValues = z.output<typeof productSchema>;
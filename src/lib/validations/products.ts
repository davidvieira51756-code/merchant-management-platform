import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),

  description: z
    .string()
    .trim()
    .optional(),

  price: z.preprocess(
    (value) => {
      if ((typeof value === "string" && value.trim() === "") || value === null || value === undefined) {
        return undefined;
      }

      return Number(value);
    },
    z
      .number({
        error: "Price is required",
      })
      .min(0, "Price cannot be negative")
      .max(99999999.99, "Price cannot exceed 99999999.99")
      .multipleOf(0.01, "Price must have at most 2 decimal places")
  ),

  available: z.boolean(),
});

export type ProductFormInput = z.input<typeof productSchema>;
export type ProductFormValues = z.output<typeof productSchema>;

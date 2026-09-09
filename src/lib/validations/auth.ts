import { z } from "zod";

export const authSchema = z
  .object({
    mode: z.enum(["login", "signup"]),
    fullName: z.string().trim().optional(),
    email: z.string().trim().email("Enter a valid email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .superRefine((data, ctx) => {
    if (data.mode === "signup" && !data.fullName) {
      ctx.addIssue({
        code: "custom",
        path: ["fullName"],
        message: "Full name is required",
      });
    }
  });

export type AuthFormValues = z.infer<typeof authSchema>;
import { z } from "zod";

export const authSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("login"),
    email: z.string().trim().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),

  z.object({
    mode: z.literal("signup"),
    fullName: z.string().trim().min(1, "Full name is required"),
    email: z.string().trim().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
]);

export type AuthFormValues = z.infer<typeof authSchema>;
import { z } from "zod";

export const storeSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  street: z.string().trim().min(1, "Street is required"),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  zipCode: z.string().trim().min(1, "Zip code is required"),
  phone: z.string().trim().min(1, "Phone number is required"),
  timezone: z.string().trim().min(1, "Timezone is required"),
});

export type StoreFormValues = z.infer<typeof storeSchema>;
import { z } from "zod";

export const orderSchema = z.object({
  model: z.enum(["black-dragon", "white-dragon"], {
    error: "Please select a model.",
  }),
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  phone: z
    .string()
    .min(9, "Please enter a valid phone number.")
    .regex(/^[0-9+\s\-()]+$/, "Invalid phone number format."),
  email: z.string().email("Invalid email address.").optional().or(z.literal("")),
  city: z.string().min(2, "City is required."),
  address: z.string().min(5, "Please enter your full address."),
  notes: z.string().optional(),
});

export type OrderSchema = z.infer<typeof orderSchema>;

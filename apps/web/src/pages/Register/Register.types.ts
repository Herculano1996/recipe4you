import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email("Enter a valid email address"),
    username: z
      .string()
      .min(3, "At least 3 characters")
      .max(50, "Max 50 characters")
      .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers and _ only"),
    displayName: z.string().max(100, "Max 100 characters").optional(),
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterForm = z.infer<typeof registerSchema>;

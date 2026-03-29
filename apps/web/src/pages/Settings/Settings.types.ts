import { z } from "zod";

export const settingsSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be at most 50 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, underscore"),
  displayName: z
    .string()
    .max(100, "Display name must be at most 100 characters")
    .optional(),
  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
  avatarUrl: z.string().optional(),
});

export type SettingsForm = z.infer<typeof settingsSchema>;

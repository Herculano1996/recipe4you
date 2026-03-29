import { z } from "zod";

export const collectionSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(150, "Name must be at most 150 characters"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),
  isPublic: z.boolean().optional(),
});

export type CollectionForm = z.infer<typeof collectionSchema>;

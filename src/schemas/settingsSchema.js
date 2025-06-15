import { z } from "zod";

export const settingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  defaultSessionDuration: z
    .number()
    .min(5, "Session duration must be at least 5 minutes")
    .max(1440, "Session duration cannot exceed 1440 minutes (24 hours)")
    .int("Session duration must be a whole number"),
});

export const settingsFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  defaultSessionDuration: z
    .string()
    .min(1, "Session duration cannot be empty")
    .refine((val) => !isNaN(parseInt(val)), "Please enter a valid number")
    .refine((val) => {
      const num = parseInt(val);
      return num >= 5;
    }, "Session duration must be at least 5 minutes")
    .refine((val) => {
      const num = parseInt(val);
      return num <= 1440;
    }, "Session duration cannot exceed 1440 minutes (24 hours)"),
});

export const validateSettings = (data) => {
  return settingsSchema.safeParse(data);
};

export const validateSettingsForm = (data) => {
  return settingsFormSchema.safeParse(data);
};

import { z } from "zod";

export const skillSettingsSchema = z.object({
  defaultSessionDuration: z
    .number()
    .min(5, "Session duration must be at least 5 minutes")
    .max(1440, "Session duration cannot exceed 1440 minutes (24 hours)")
    .int("Session duration must be a whole number"),
  targetHours: z
    .number()
    .min(1, "Target hours must be at least 1 hour")
    .max(10000, "Target hours cannot exceed 10,000 hours")
    .int("Target hours must be a whole number"),
});

export const skillSettingsFormSchema = z.object({
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
  targetHours: z
    .string()
    .min(1, "Target hours cannot be empty")
    .refine((val) => !isNaN(parseInt(val)), "Please enter a valid number")
    .refine((val) => {
      const num = parseInt(val);
      return num >= 1;
    }, "Target hours must be at least 1 hour")
    .refine((val) => {
      const num = parseInt(val);
      return num <= 10000;
    }, "Target hours cannot exceed 10,000 hours"),
});

export const validateSkillSettings = (data) => {
  return skillSettingsSchema.safeParse(data);
};

export const validateSkillSettingsForm = (data) => {
  return skillSettingsFormSchema.safeParse(data);
};

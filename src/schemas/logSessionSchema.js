import { z } from "zod";

export const logSessionSchema = z.object({
  skillId: z.string().min(1, "Please select a skill").trim(),
  duration: z
    .string()
    .min(1, "Duration is required")
    .refine((val) => !isNaN(parseInt(val)), "Please enter a valid number")
    .refine((val) => {
      const num = parseInt(val);
      return num >= 1;
    }, "Duration must be at least 1 minute")
    .refine((val) => {
      const num = parseInt(val);
      return num <= 1440;
    }, "Duration cannot exceed 1440 minutes (24 hours)")
    .refine((val) => {
      const num = parseInt(val);
      return Number.isInteger(num);
    }, "Duration must be a whole number"),
  date: z
    .string()
    .min(1, "Date is required")
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, "Please enter a valid date")
    .refine((val) => {
      const date = new Date(val);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return date <= today;
    }, "Date cannot be in the future"),
  notes: z
    .string()
    .max(1000, "Notes cannot exceed 1000 characters")
    .optional()
    .default(""),
});

export const validateLogSession = (data) => {
  return logSessionSchema.safeParse(data);
};

export const validateLogSessionField = (field, value) => {
  try {
    const partialSchema = logSessionSchema.pick({ [field]: true });
    partialSchema.parse({ [field]: value });
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error.errors[0]?.message || "Invalid value",
    };
  }
};

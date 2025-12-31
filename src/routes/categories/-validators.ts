import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  description: z.string()
    .max(200, { message: "Description cannot exceed 200 characters" })
    .optional()
    .or(z.literal("")),
  monthlyBudget: z.string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Please enter a valid positive number",
    }),
  color: z.string().nonempty({ message: "Please select a color" }),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
import { z } from "zod";

export const expenseFormSchema = z.object({
  amount: z.string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Please enter a valid positive amount",
    }),
  category: z.string().nonempty({ message: "Please select a category" }),
  date: z.date().nonoptional({ message: "Please select a date" }),
  note: z.string()
    .max(500, { message: "Note cannot exceed 500 characters" })
    .optional()
    .default(""),
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;
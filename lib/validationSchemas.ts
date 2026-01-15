import { z } from "zod";

export const transactionFormSchema = z.object({
  amount: z
    .string()
    .min(1, {
      message: "Amount is required",
    })
    .refine((val) => !isNaN(Number(val)), {
      message: "Amount must be a number",
    }),
  date: z.string().min(1, "Date is required"),
  payee: z.string().min(1, "Payee is required"),
  accountId: z.string().min(1, "Account is required"),
  categoryId: z.string().optional(),
  notes: z.string().optional(),
});

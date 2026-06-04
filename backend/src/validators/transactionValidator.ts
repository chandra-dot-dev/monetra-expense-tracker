import { z } from "zod";

export const transactionSchema = z.object({
  description: z.string().trim().min(1, "Description is required"),
  amount: z.number().positive("Amount must be greater than zero"),
  category: z.string().trim().min(1, "Category is required"),
  date: z.string().datetime({ message: "Invalid date format (must be ISO string)" }).or(z.date()).optional(),
  type: z.enum(["income", "expense"], { message: "Type must be either income or expense" }).optional(),
});

import { z } from 'zod';

export const TransactionSchema = z.object({
  id: z.string().optional(),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  description: z.string().min(1, 'Description is required').max(200, 'Description must be less than 200 characters'),
  date: z.date(),
  type: z.enum(['income', 'expense']),
  category: z.string().optional(), 
  categoryId: z.string().optional(), 
});

export type Transaction = z.infer<typeof TransactionSchema>;

export const TransactionFormSchema = z.object({
  amount: z.string().min(1, 'Amount is required').transform((val) => parseFloat(val)),
  description: z.string().min(1, 'Description is required').max(200),
  date: z.date(),
  type: z.enum(['income', 'expense']),
  category: z.string().optional(),
});

export type TransactionForm = z.infer<typeof TransactionFormSchema>;

export const BudgetSchema = z.object({
  id: z.string().optional(),
  categoryId: z.string(),
  amount: z.number().min(0, 'Budget amount must be positive'),
  month: z.number().min(1).max(12),
  year: z.number().min(2020),
});

export type Budget = z.infer<typeof BudgetSchema>;

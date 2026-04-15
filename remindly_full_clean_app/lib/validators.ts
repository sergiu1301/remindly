import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2).max(100),
  language: z.enum(['en', 'ro']).optional()
});

export const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20),
  password: z.string().min(8)
});

export const reminderSchema = z.object({
  title: z.string().min(2).max(120),
  category: z.string().min(1).max(80),
  description: z.string().max(500).optional().or(z.literal('')),
  dueDate: z.string().min(1),
  notifyBefore: z.coerce.number().min(0).max(365)
});

export const profileSchema = z.object({
  fullName: z.string().min(2).max(100),
  phoneNumber: z.string().max(40).optional().or(z.literal('')),
  language: z.enum(['en', 'ro'])
});

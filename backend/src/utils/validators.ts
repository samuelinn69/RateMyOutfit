import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password too long'),
  displayName: z.string().max(50).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const outfitUploadSchema = z.object({
  title: z.string().max(100).optional(),
  isPublic: z.boolean().optional().default(true),
  isAnonymous: z.boolean().optional().default(false),
  roastMode: z.boolean().optional().default(false),
});

export const feedQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  sort: z.enum(['latest', 'trending', 'top']).default('latest'),
});

export const commentSchema = z.object({
  content: z.string().min(1).max(500),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type OutfitUploadInput = z.infer<typeof outfitUploadSchema>;
export type FeedQueryInput = z.infer<typeof feedQuerySchema>;

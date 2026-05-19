import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { AppError } from '../middleware/errorHandler';
import prisma from '../lib/prisma';
import { z } from 'zod';

const updateProfileSchema = z.object({
  displayName: z.string().max(50).optional(),
  bio: z.string().max(200).optional(),
});

export async function getProfile(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        bio: true,
        totalOutfits: true,
        avgScore: true,
        badges: true,
        createdAt: true,
        _count: { select: { outfits: true } },
      },
    });

    if (!user) throw new AppError(404, 'User not found');

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, 'Authentication required');

    const input = updateProfileSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: input,
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        bio: true,
        badges: true,
        totalOutfits: true,
        avgScore: true,
      },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function getMe(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, 'Authentication required');

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatar: true,
        bio: true,
        totalOutfits: true,
        avgScore: true,
        badges: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) throw new AppError(404, 'User not found');

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

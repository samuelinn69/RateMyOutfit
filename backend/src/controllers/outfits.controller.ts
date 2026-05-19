import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { outfitUploadSchema } from '../utils/validators';
import { uploadToCloudinary } from '../lib/cloudinary';
import { analyzeOutfit } from '../services/ai.service';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import sharp from 'sharp';

export async function uploadOutfit(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, 'Authentication required');
    if (!req.file) throw new AppError(400, 'No image file provided');

    const input = outfitUploadSchema.parse({
      ...req.body,
      isPublic: req.body.isPublic !== 'false',
      isAnonymous: req.body.isAnonymous === 'true',
      roastMode: req.body.roastMode === 'true',
    });

    // Compress image
    const compressed = await sharp(req.file.buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Upload to Cloudinary
    const { url, thumbnailUrl } = await uploadToCloudinary(compressed);

    // AI Analysis
    const analysis = await analyzeOutfit(url, input.roastMode);

    // Save to DB
    const outfit = await prisma.outfit.create({
      data: {
        userId: req.user.userId,
        imageUrl: url,
        thumbnailUrl,
        title: input.title,
        isPublic: input.isPublic,
        isAnonymous: input.isAnonymous,
        ...analysis,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    });

    // Update user stats
    const userOutfits = await prisma.outfit.aggregate({
      where: { userId: req.user.userId },
      _avg: { scoreOverall: true },
      _count: true,
    });

    await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        totalOutfits: userOutfits._count,
        avgScore: userOutfits._avg.scoreOverall ?? 0,
      },
    });

    await awardBadges(req.user.userId);

    res.status(201).json({ success: true, data: outfit });
  } catch (error) {
    next(error);
  }
}

export async function getOutfit(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const outfit = await prisma.outfit.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
        _count: { select: { likes: true, comments: true } },
      },
    });

    if (!outfit) throw new AppError(404, 'Outfit not found');
    if (!outfit.isPublic && outfit.userId !== req.user?.userId) {
      throw new AppError(403, 'This outfit is private');
    }

    // Record view
    await prisma.view.create({
      data: {
        outfitId: id,
        userId: req.user?.userId,
        ipAddress: req.ip,
      },
    });

    await prisma.outfit.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    const liked = req.user
      ? !!(await prisma.like.findUnique({
          where: { userId_outfitId: { userId: req.user.userId, outfitId: id } },
        }))
      : false;

    res.json({ success: true, data: { ...outfit, liked } });
  } catch (error) {
    next(error);
  }
}

export async function getUserOutfits(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { username } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 12, 50);
    const skip = (page - 1) * limit;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) throw new AppError(404, 'User not found');

    const isOwner = req.user?.userId === user.id;
    const where = { userId: user.id, ...(isOwner ? {} : { isPublic: true }) };

    const [outfits, total] = await Promise.all([
      prisma.outfit.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, username: true, displayName: true, avatar: true } },
          _count: { select: { likes: true, comments: true } },
        },
      }),
      prisma.outfit.count({ where }),
    ]);

    res.json({
      success: true,
      data: outfits,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function likeOutfit(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, 'Authentication required');
    const { id } = req.params;

    const outfit = await prisma.outfit.findUnique({ where: { id } });
    if (!outfit) throw new AppError(404, 'Outfit not found');

    const existing = await prisma.like.findUnique({
      where: { userId_outfitId: { userId: req.user.userId, outfitId: id } },
    });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      await prisma.outfit.update({ where: { id }, data: { likeCount: { decrement: 1 } } });
      res.json({ success: true, data: { liked: false } });
    } else {
      await prisma.like.create({ data: { userId: req.user.userId, outfitId: id } });
      await prisma.outfit.update({ where: { id }, data: { likeCount: { increment: 1 } } });
      res.json({ success: true, data: { liked: true } });
    }
  } catch (error) {
    next(error);
  }
}

export async function deleteOutfit(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, 'Authentication required');
    const { id } = req.params;

    const outfit = await prisma.outfit.findUnique({ where: { id } });
    if (!outfit) throw new AppError(404, 'Outfit not found');
    if (outfit.userId !== req.user.userId) throw new AppError(403, 'Forbidden');

    await prisma.outfit.delete({ where: { id } });
    res.json({ success: true, message: 'Outfit deleted' });
  } catch (error) {
    next(error);
  }
}

async function awardBadges(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { totalOutfits: true, avgScore: true, badges: true },
  });
  if (!user) return;

  const newBadges = new Set(user.badges);

  if (user.totalOutfits >= 1) newBadges.add('first_fit');
  if (user.totalOutfits >= 5) newBadges.add('style_explorer');
  if (user.totalOutfits >= 10) newBadges.add('fashion_regular');
  if (user.totalOutfits >= 25) newBadges.add('outfit_veteran');
  if (user.avgScore >= 8) newBadges.add('style_icon');
  if (user.avgScore >= 9) newBadges.add('fashion_god');

  if (newBadges.size !== user.badges.length) {
    await prisma.user.update({
      where: { id: userId },
      data: { badges: Array.from(newBadges) },
    });
  }
}

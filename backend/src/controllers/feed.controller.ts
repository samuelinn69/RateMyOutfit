import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { feedQuerySchema } from '../utils/validators';
import prisma from '../lib/prisma';

export async function getFeed(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = feedQuerySchema.parse(req.query);
    const { page, limit, sort } = query;
    const skip = (page - 1) * limit;

    const orderBy =
      sort === 'trending'
        ? { trendingScore: 'desc' as const }
        : sort === 'top'
          ? { scoreOverall: 'desc' as const }
          : { createdAt: 'desc' as const };

    const [outfits, total] = await Promise.all([
      prisma.outfit.findMany({
        where: { isPublic: true },
        orderBy,
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, username: true, displayName: true, avatar: true },
          },
          _count: { select: { likes: true, comments: true } },
        },
      }),
      prisma.outfit.count({ where: { isPublic: true } }),
    ]);

    // Attach liked status if user is authenticated
    const outfitsWithLike = await Promise.all(
      outfits.map(async (outfit) => {
        const liked = req.user
          ? !!(await prisma.like.findUnique({
              where: {
                userId_outfitId: { userId: req.user!.userId, outfitId: outfit.id },
              },
            }))
          : false;
        return { ...outfit, liked };
      })
    );

    res.json({
      success: true,
      data: outfitsWithLike,
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

export async function getTrending(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const limit = Math.min(Number(req.query.limit) || 6, 20);

    const outfits = await prisma.outfit.findMany({
      where: { isPublic: true, isTrending: true },
      orderBy: { trendingScore: 'desc' },
      take: limit,
      include: {
        user: { select: { id: true, username: true, displayName: true, avatar: true } },
        _count: { select: { likes: true } },
      },
    });

    res.json({ success: true, data: outfits });
  } catch (error) {
    next(error);
  }
}

export async function getLeaderboard(
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const users = await prisma.user.findMany({
      where: { totalOutfits: { gt: 0 } },
      orderBy: { avgScore: 'desc' },
      take: 10,
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        avgScore: true,
        totalOutfits: true,
        badges: true,
      },
    });

    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}

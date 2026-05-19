import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiry,
} from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import { RegisterInput, LoginInput } from '../utils/validators';

export async function registerUser(input: RegisterInput) {
  const existingEmail = await prisma.user.findUnique({ where: { email: input.email } });
  if (existingEmail) throw new AppError(409, 'Email already in use');

  const existingUsername = await prisma.user.findUnique({ where: { username: input.username } });
  if (existingUsername) throw new AppError(409, 'Username already taken');

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      username: input.username.toLowerCase(),
      passwordHash,
      displayName: input.displayName || input.username,
    },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      avatar: true,
      createdAt: true,
    },
  });

  const tokenPayload = { userId: user.id, email: user.email, username: user.username };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  return { user, accessToken, refreshToken };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      avatar: true,
      passwordHash: true,
      badges: true,
      totalOutfits: true,
      avgScore: true,
    },
  });

  if (!user) throw new AppError(401, 'Invalid email or password');

  const isValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!isValid) throw new AppError(401, 'Invalid email or password');

  const tokenPayload = { userId: user.id, email: user.email, username: user.username };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  const { passwordHash: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, accessToken, refreshToken };
}

export async function refreshAccessToken(token: string) {
  const stored = await prisma.refreshToken.findUnique({ where: { token } });
  if (!stored || stored.expiresAt < new Date()) {
    throw new AppError(401, 'Invalid or expired refresh token');
  }

  const payload = verifyRefreshToken(token);
  const accessToken = generateAccessToken({
    userId: payload.userId,
    email: payload.email,
    username: payload.username,
  });

  return { accessToken };
}

export async function logoutUser(refreshToken: string) {
  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
}

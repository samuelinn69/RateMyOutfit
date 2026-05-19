import { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema, refreshTokenSchema } from '../utils/validators';
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from '../services/auth.service';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = registerSchema.parse(req.body);
    const result = await registerUser(input);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = loginSchema.parse(req.body);
    const result = await loginUser(input);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = refreshTokenSchema.parse(req.body);
    const result = await refreshAccessToken(refreshToken);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = refreshTokenSchema.parse(req.body);
    await logoutUser(refreshToken);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
}

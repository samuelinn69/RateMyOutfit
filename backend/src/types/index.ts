import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthPayload extends JwtPayload {
  userId: string;
  email: string;
  username: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export interface AIAnalysisResult {
  scoreOverall: number;
  scoreColors: number;
  scoreFit: number;
  scoreAesthetics: number;
  scoreOriginality: number;
  attractivenessScore: number;
  vibe: string;
  style: string;
  description: string;
  whatWorks: string[];
  whatDoesntWork: string[];
  improvements: string[];
  colorPalette: string[];
  accessorySuggestions: string[];
  hairstyleSuggestions: string[];
  socialTips: string[];
  roast: string;
  firstImpression: string;
  confidenceBoost: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

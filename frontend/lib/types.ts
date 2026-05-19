export interface User {
  id: string;
  email?: string;
  username: string;
  displayName: string | null;
  avatar: string | null;
  bio: string | null;
  totalOutfits: number;
  avgScore: number;
  badges: string[];
  isVerified?: boolean;
  createdAt?: string;
}

export interface Outfit {
  id: string;
  userId: string;
  imageUrl: string;
  thumbnailUrl: string | null;
  title: string | null;
  isPublic: boolean;
  isAnonymous: boolean;

  scoreOverall: number;
  scoreColors: number;
  scoreFit: number;
  scoreAesthetics: number;
  scoreOriginality: number;
  attractivenessScore: number;

  vibe: string;
  style: string | null;
  description: string;
  whatWorks: string[];
  whatDoesntWork: string[];
  improvements: string[];
  colorPalette: string[];
  accessorySuggestions: string[];
  hairstyleSuggestions: string[];
  socialTips: string[];
  roast: string | null;
  firstImpression: string | null;
  confidenceBoost: string | null;

  viewCount: number;
  likeCount: number;
  shareCount: number;
  isFeatured: boolean;
  isTrending: boolean;

  liked?: boolean;
  createdAt: string;
  updatedAt: string;

  user?: {
    id: string;
    username: string;
    displayName: string | null;
    avatar: string | null;
  };
  _count?: {
    likes: number;
    comments: number;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

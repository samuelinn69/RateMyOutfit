import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function scoreColor(score: number): string {
  if (score >= 8) return '#22c55e';
  if (score >= 6) return '#a855f7';
  if (score >= 4) return '#f97316';
  return '#ef4444';
}

export function scoreLabel(score: number): string {
  if (score >= 9) return 'Iconic';
  if (score >= 8) return 'Fire';
  if (score >= 7) return 'Solid';
  if (score >= 6) return 'Decent';
  if (score >= 5) return 'Meh';
  if (score >= 4) return 'Needs Work';
  return 'Yikes';
}

export function scoreEmoji(score: number): string {
  if (score >= 9) return '👑';
  if (score >= 8) return '🔥';
  if (score >= 7) return '✨';
  if (score >= 6) return '💫';
  if (score >= 5) return '😐';
  if (score >= 4) return '😬';
  return '💀';
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function timeAgo(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return d.toLocaleDateString();
}

export const BADGE_META: Record<string, { emoji: string; label: string; color: string }> = {
  first_fit: { emoji: '🎯', label: 'First Fit', color: '#a855f7' },
  style_explorer: { emoji: '🗺️', label: 'Style Explorer', color: '#3b82f6' },
  fashion_regular: { emoji: '📸', label: 'Fashion Regular', color: '#22c55e' },
  outfit_veteran: { emoji: '🏆', label: 'Outfit Veteran', color: '#f59e0b' },
  style_icon: { emoji: '⭐', label: 'Style Icon', color: '#ec4899' },
  fashion_god: { emoji: '👑', label: 'Fashion God', color: '#f97316' },
};

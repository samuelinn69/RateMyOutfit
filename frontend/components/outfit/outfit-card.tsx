'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Eye } from 'lucide-react';
import { Outfit } from '@/lib/types';
import { scoreColor, formatNumber, timeAgo } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface OutfitCardProps {
  outfit: Outfit;
  showUser?: boolean;
}

export function OutfitCard({ outfit, showUser = true }: OutfitCardProps) {
  return (
    <Link href={`/outfit/${outfit.id}`}>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="glass rounded-2xl overflow-hidden group cursor-pointer"
      >
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={outfit.thumbnailUrl || outfit.imageUrl}
            alt={outfit.title || 'Outfit'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Score badge */}
          <div className="absolute top-2 left-2">
            <div
              className="rounded-xl px-2.5 py-1 text-center"
              style={{
                background: `${scoreColor(outfit.scoreOverall)}20`,
                border: `1px solid ${scoreColor(outfit.scoreOverall)}40`,
              }}
            >
              <span className="text-sm font-black" style={{ color: scoreColor(outfit.scoreOverall) }}>
                {outfit.scoreOverall.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Vibe */}
          <div className="absolute bottom-2 left-2 right-2">
            <div className="glass rounded-lg px-2 py-1">
              <span className="text-white/80 text-xs font-medium">{outfit.vibe}</span>
            </div>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-between p-3">
            <div className="flex items-center gap-2 text-white/80 text-xs">
              <Eye className="w-3 h-3" />
              {formatNumber(outfit.viewCount)}
            </div>
            <div className="flex items-center gap-1 text-white/80 text-xs">
              <Heart className="w-3 h-3" />
              {formatNumber(outfit.likeCount)}
            </div>
          </div>
        </div>

        {/* Footer */}
        {showUser && outfit.user && !outfit.isAnonymous && (
          <div className="p-3 flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={outfit.user.avatar || undefined} />
              <AvatarFallback className="text-xs">
                {(outfit.user.displayName || outfit.user.username).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-white/50 text-xs truncate">@{outfit.user.username}</span>
            <span className="text-white/20 text-xs ml-auto shrink-0">
              {timeAgo(outfit.createdAt)}
            </span>
          </div>
        )}
      </motion.div>
    </Link>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  Share2,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Lightbulb,
  Sparkles,
  Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { outfitsApi } from '@/lib/api';
import { Outfit } from '@/lib/types';
import { scoreColor, scoreLabel, scoreEmoji, formatNumber, timeAgo } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

export default function OutfitPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    outfitsApi
      .get(id)
      .then((res) => {
        setOutfit(res.data.data);
        setLiked(res.data.data.liked || false);
        setLikeCount(res.data.data.likeCount || 0);
      })
      .catch(() => router.push('/feed'))
      .finally(() => setLoading(false));
  }, [id, router]);

  async function handleLike() {
    if (!user) return toast.error('Sign in to like outfits');
    try {
      const { data } = await outfitsApi.like(id);
      setLiked(data.data.liked);
      setLikeCount((c) => c + (data.data.liked ? 1 : -1));
    } catch {
      toast.error('Failed to like');
    }
  }

  function handleShare() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => toast.success('Link copied!'));
  }

  if (loading || !outfit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  const scoreCategories = [
    { label: 'Colors', value: outfit.scoreColors },
    { label: 'Fit', value: outfit.scoreFit },
    { label: 'Aesthetics', value: outfit.scoreAesthetics },
    { label: 'Originality', value: outfit.scoreOriginality },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-6 text-white/40">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Image + basic info */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-4">
            <Image
              src={outfit.imageUrl}
              alt={outfit.title || 'Outfit'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Score overlay */}
            <div className="absolute top-4 left-4">
              <div
                className="glass rounded-2xl px-4 py-2 text-center"
                style={{ borderColor: `${scoreColor(outfit.scoreOverall)}40` }}
              >
                <div
                  className="text-3xl font-black leading-none"
                  style={{ color: scoreColor(outfit.scoreOverall) }}
                >
                  {outfit.scoreOverall.toFixed(1)}
                </div>
                <div className="text-white/50 text-xs">{scoreLabel(outfit.scoreOverall)}</div>
              </div>
            </div>

            {/* Vibe badge */}
            <div className="absolute top-4 right-4">
              <div className="glass rounded-xl px-3 py-1.5">
                <span className="text-white text-sm font-semibold">{outfit.vibe}</span>
              </div>
            </div>
          </div>

          {/* Author */}
          {outfit.user && !outfit.isAnonymous && (
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-9 h-9">
                <AvatarImage src={outfit.user.avatar || undefined} />
                <AvatarFallback>
                  {(outfit.user.displayName || outfit.user.username).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <Link
                  href={`/profile/${outfit.user.username}`}
                  className="text-white font-semibold text-sm hover:text-purple-400 transition-colors"
                >
                  {outfit.user.displayName || outfit.user.username}
                </Link>
                <div className="text-white/30 text-xs">@{outfit.user.username} · {timeAgo(outfit.createdAt)}</div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className={`flex-1 gap-2 ${liked ? 'text-pink-400 border-pink-500/30 bg-pink-500/10' : ''}`}
              onClick={handleLike}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              {formatNumber(likeCount)}
            </Button>
            <Button variant="outline" className="flex-1 gap-2" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </motion.div>

        {/* Right: Analysis */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {/* Score breakdown */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Score Breakdown
            </h3>
            <div className="space-y-3">
              {scoreCategories.map((cat) => (
                <div key={cat.label} className="flex items-center gap-3">
                  <span className="text-white/40 text-sm w-24">{cat.label}</span>
                  <Progress
                    value={(cat.value / 10) * 100}
                    className="flex-1"
                    color={scoreColor(cat.value)}
                  />
                  <span className="text-white font-bold text-sm w-8 text-right">
                    {cat.value.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <div>
                <div className="text-white/40 text-xs mb-1">Attractiveness boost</div>
                <div className="text-pink-400 font-black text-xl">+{outfit.attractivenessScore}%</div>
              </div>
              <div className="text-4xl">{scoreEmoji(outfit.scoreOverall)}</div>
            </div>
          </div>

          {/* First impression */}
          {outfit.firstImpression && (
            <div className="glass rounded-2xl p-5">
              <p className="text-white/40 text-xs mb-2">First impression</p>
              <p className="text-white font-semibold italic text-lg">"{outfit.firstImpression}"</p>
            </div>
          )}

          {/* Description */}
          <div className="glass rounded-2xl p-5">
            <p className="text-white/60 leading-relaxed text-sm">{outfit.description}</p>
          </div>

          {/* What works */}
          {outfit.whatWorks?.length > 0 && (
            <div className="glass rounded-2xl p-5">
              <h3 className="text-green-400 font-bold mb-3 flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4" />
                What&apos;s working
              </h3>
              <ul className="space-y-2">
                {outfit.whatWorks.map((item, i) => (
                  <li key={i} className="text-white/60 text-sm flex items-start gap-2">
                    <span className="text-green-400/50 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* What doesn't work */}
          {outfit.whatDoesntWork?.length > 0 && (
            <div className="glass rounded-2xl p-5">
              <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2 text-sm">
                <XCircle className="w-4 h-4" />
                Needs improvement
              </h3>
              <ul className="space-y-2">
                {outfit.whatDoesntWork.map((item, i) => (
                  <li key={i} className="text-white/60 text-sm flex items-start gap-2">
                    <span className="text-red-400/50 mt-0.5">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvements */}
          {outfit.improvements?.length > 0 && (
            <div className="glass rounded-2xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2 text-sm">
                <Lightbulb className="w-4 h-4" />
                Style tips
              </h3>
              <ul className="space-y-2">
                {outfit.improvements.map((tip, i) => (
                  <li key={i} className="text-white/60 text-sm flex items-start gap-2">
                    <span className="text-yellow-400/50 shrink-0">→</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Color palette */}
          {outfit.colorPalette?.length > 0 && (
            <div className="glass rounded-2xl p-5">
              <h3 className="text-white font-bold mb-3 text-sm">Complementary colors</h3>
              <div className="flex gap-2 flex-wrap">
                {outfit.colorPalette.map((color, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-xl border border-white/10 cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                    onClick={() => {
                      navigator.clipboard.writeText(color);
                      toast.success(`Copied ${color}`);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Accessories */}
          {outfit.accessorySuggestions?.length > 0 && (
            <div className="glass rounded-2xl p-5">
              <h3 className="text-white font-bold mb-3 text-sm">Accessory suggestions</h3>
              <div className="flex flex-wrap gap-2">
                {outfit.accessorySuggestions.map((item, i) => (
                  <span key={i} className="glass rounded-lg px-3 py-1.5 text-white/60 text-xs">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social tips */}
          {outfit.socialTips?.length > 0 && (
            <div className="glass rounded-2xl p-5">
              <h3 className="text-pink-400 font-bold mb-3 text-sm">Social tips 💘</h3>
              <ul className="space-y-2">
                {outfit.socialTips.map((tip, i) => (
                  <li key={i} className="text-white/60 text-sm">{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Roast */}
          {outfit.roast && (
            <div className="glass rounded-2xl p-5 border border-orange-500/20 bg-orange-500/5">
              <h3 className="text-orange-400 font-bold mb-3 flex items-center gap-2 text-sm">
                <Flame className="w-4 h-4" />
                Roast
              </h3>
              <p className="text-white/70 text-sm italic">"{outfit.roast}"</p>
            </div>
          )}

          {/* Confidence boost */}
          {outfit.confidenceBoost && (
            <div className="glass rounded-2xl p-5 border border-purple-500/20 bg-purple-500/5">
              <p className="text-purple-300 text-sm">{outfit.confidenceBoost}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

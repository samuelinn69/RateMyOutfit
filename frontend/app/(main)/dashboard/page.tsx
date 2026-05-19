'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Upload, Zap, Star, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OutfitCard } from '@/components/outfit/outfit-card';
import { useAuthStore } from '@/store/auth.store';
import { outfitsApi } from '@/lib/api';
import { Outfit } from '@/lib/types';
import { BADGE_META } from '@/lib/utils';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.username) return;
    outfitsApi
      .getUserOutfits(user.username, { limit: 6 })
      .then((res) => setOutfits(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.username]);

  const greetings = ['Hey', "What's up", 'Hola', 'Sup'];
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-black text-white mb-2">
          {greeting}, {user?.displayName || user?.username}. 👋
        </h1>
        <p className="text-white/40">
          Ready to see how your fits score today?
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
      >
        {[
          {
            icon: Star,
            label: 'Avg Score',
            value: user?.avgScore ? user.avgScore.toFixed(1) : '—',
            color: 'text-yellow-400',
            bg: 'bg-yellow-400/10',
          },
          {
            icon: Upload,
            label: 'Outfits Rated',
            value: user?.totalOutfits || 0,
            color: 'text-purple-400',
            bg: 'bg-purple-400/10',
          },
          {
            icon: TrendingUp,
            label: 'Badges',
            value: user?.badges?.length || 0,
            color: 'text-green-400',
            bg: 'bg-green-400/10',
          },
          {
            icon: Zap,
            label: 'Streak',
            value: '🔥 Active',
            color: 'text-orange-400',
            bg: 'bg-orange-400/10',
          },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-2xl p-5">
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
            <div className="text-white/40 text-xs">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Badges */}
      {user?.badges && user.badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-10"
        >
          <h2 className="text-lg font-bold text-white mb-4">Your badges</h2>
          <div className="flex flex-wrap gap-3">
            {user.badges.map((badge) => {
              const meta = BADGE_META[badge];
              if (!meta) return null;
              return (
                <div
                  key={badge}
                  className="glass rounded-xl px-4 py-2 flex items-center gap-2"
                  title={meta.label}
                >
                  <span className="text-lg">{meta.emoji}</span>
                  <span className="text-white/70 text-sm font-semibold">{meta.label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Upload CTA */}
      {(!user?.totalOutfits || user.totalOutfits === 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-3xl p-10 text-center mb-10 gradient-border"
        >
          <div className="text-6xl mb-4">📸</div>
          <h2 className="text-2xl font-black text-white mb-3">Rate your first fit</h2>
          <p className="text-white/40 mb-6 max-w-sm mx-auto">
            Upload a photo and get a full AI fashion analysis in seconds.
          </p>
          <Button size="lg" variant="glow" asChild>
            <Link href="/upload">
              <Upload className="w-4 h-4" />
              Upload your fit
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      )}

      {/* Recent outfits */}
      {outfits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Your recent fits</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/profile/${user?.username}`} className="text-purple-400">
                See all <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass rounded-2xl h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {outfits.map((outfit) => (
                <OutfitCard key={outfit.id} outfit={outfit} />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

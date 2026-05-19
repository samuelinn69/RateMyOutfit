'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, Upload, Award } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { OutfitCard } from '@/components/outfit/outfit-card';
import { usersApi, outfitsApi } from '@/lib/api';
import { User, Outfit } from '@/lib/types';
import { BADGE_META } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const currentUser = useAuthStore((s) => s.user);
  const [profile, setProfile] = useState<User | null>(null);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      usersApi.getProfile(username),
      outfitsApi.getUserOutfits(username, { limit: 12 }),
    ])
      .then(([profileRes, outfitsRes]) => {
        setProfile(profileRes.data.data);
        setOutfits(outfitsRes.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👻</div>
          <p className="text-white/40">User not found</p>
        </div>
      </div>
    );
  }

  const isOwner = currentUser?.username === username;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10"
      >
        <div className="relative">
          <Avatar className="w-24 h-24 ring-4 ring-purple-500/20">
            <AvatarImage src={profile.avatar || undefined} />
            <AvatarFallback className="text-3xl">
              {(profile.displayName || profile.username).charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {profile.avgScore >= 8 && (
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-sm">
              👑
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-black text-white">
            {profile.displayName || profile.username}
            {profile.isVerified && <span className="ml-2 text-blue-400 text-lg">✓</span>}
          </h1>
          <p className="text-white/40 text-sm">@{profile.username}</p>
          {profile.bio && <p className="text-white/60 text-sm mt-2 max-w-sm">{profile.bio}</p>}

          {/* Stats */}
          <div className="flex gap-6 mt-4">
            <div>
              <div className="text-white font-black text-lg">{profile.totalOutfits}</div>
              <div className="text-white/30 text-xs">Outfits</div>
            </div>
            <div>
              <div className="text-yellow-400 font-black text-lg">
                {profile.avgScore ? profile.avgScore.toFixed(1) : '—'}
              </div>
              <div className="text-white/30 text-xs">Avg score</div>
            </div>
            <div>
              <div className="text-purple-400 font-black text-lg">{profile.badges?.length || 0}</div>
              <div className="text-white/30 text-xs">Badges</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Badges */}
      {profile.badges?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-white/40 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
            <Award className="w-3.5 h-3.5" />
            Badges
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.badges.map((badge) => {
              const meta = BADGE_META[badge];
              if (!meta) return null;
              return (
                <div key={badge} className="glass rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                  <span>{meta.emoji}</span>
                  <span className="text-white/60 text-xs">{meta.label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Outfits grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <h2 className="text-white font-bold mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4 text-purple-400" />
          {isOwner ? 'Your fits' : `${profile.displayName || profile.username}'s fits`}
        </h2>

        {outfits.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-white/40">
              {isOwner ? "You haven't rated any outfits yet" : 'No public outfits yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {outfits.map((outfit) => (
              <OutfitCard key={outfit.id} outfit={outfit} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

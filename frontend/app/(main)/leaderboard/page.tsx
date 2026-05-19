'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Trophy, Crown, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { feedApi } from '@/lib/api';
import { User } from '@/lib/types';
import { BADGE_META } from '@/lib/utils';
import { useT } from '@/hooks/use-t';

export default function LeaderboardPage() {
  const T = useT();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    feedApi
      .getLeaderboard()
      .then((res) => setUsers(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h1 className="text-3xl font-black text-white">{T.leaderboard.title}</h1>
        </div>
        <p className="text-white/40">{T.leaderboard.sub}</p>
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="glass rounded-2xl h-16 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="glass rounded-3xl overflow-hidden">
          {users.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/profile/${user.username}`}
                className="flex items-center gap-4 p-4 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors last:border-0"
              >
                <div className="w-8 text-center shrink-0">
                  {i === 0 ? (
                    <Crown className="w-5 h-5 text-yellow-400 mx-auto" />
                  ) : i === 1 ? (
                    <span className="text-white/50 font-bold">2</span>
                  ) : i === 2 ? (
                    <span className="text-white/40 font-bold">3</span>
                  ) : (
                    <span className="text-white/20 font-bold text-sm">#{i + 1}</span>
                  )}
                </div>

                <Avatar
                  className={`w-10 h-10 ${
                    i === 0 ? 'ring-2 ring-yellow-400/50' : i === 1 ? 'ring-2 ring-gray-400/30' : i === 2 ? 'ring-2 ring-orange-500/30' : ''
                  }`}
                >
                  <AvatarImage src={user.avatar || undefined} />
                  <AvatarFallback>
                    {(user.displayName || user.username).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm truncate">
                    {user.displayName || user.username}
                  </div>
                  <div className="text-white/30 text-xs">@{user.username}</div>
                </div>

                <div className="flex gap-1">
                  {user.badges?.slice(0, 2).map((b) => (
                    <span key={b} title={BADGE_META[b]?.label} className="text-sm">
                      {BADGE_META[b]?.emoji}
                    </span>
                  ))}
                </div>

                <div className="text-right shrink-0">
                  <div className="text-yellow-400 font-black">
                    {user.avgScore?.toFixed(1) || '—'}
                  </div>
                  <div className="text-white/30 text-xs">{user.totalOutfits} {T.leaderboard.fits}</div>
                </div>
              </Link>
            </motion.div>
          ))}

          {users.length === 0 && (
            <div className="p-12 text-center">
              <Star className="w-8 h-8 text-white/20 mx-auto mb-3" />
              <p className="text-white/30">{T.leaderboard.empty}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Trophy, Crown } from 'lucide-react';

const topUsers = [
  { rank: 1, name: 'sofia.vibes', score: 9.4, outfits: 42, badge: '👑' },
  { rank: 2, name: 'alex.fits', score: 9.1, outfits: 38, badge: '🔥' },
  { rank: 3, name: 'mia.style', score: 8.9, outfits: 51, badge: '✨' },
  { rank: 4, name: 'chris.looks', score: 8.7, outfits: 29, badge: '💎' },
  { rank: 5, name: 'luna.drip', score: 8.5, outfits: 67, badge: '⭐' },
];

export function LandingLeaderboard() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-purple-400 font-semibold text-sm uppercase tracking-widest mb-4">
            Leaderboard
          </p>
          <h2 className="text-5xl font-black text-white mb-4">
            Who&apos;s got the best
            <br />
            fit game?
          </h2>
          <p className="text-white/50">Top-rated style icons this week.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl overflow-hidden"
        >
          <div className="p-4 border-b border-white/5 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-white font-semibold text-sm">Style Leaderboard</span>
            <span className="ml-auto text-white/30 text-xs">This week</span>
          </div>

          {topUsers.map((user, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-4 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors last:border-0"
            >
              <div className="w-8 text-center">
                {user.rank === 1 ? (
                  <Crown className="w-5 h-5 text-yellow-400 mx-auto" />
                ) : (
                  <span className="text-white/30 font-bold text-sm">#{user.rank}</span>
                )}
              </div>

              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-lg">
                {user.badge}
              </div>

              <div className="flex-1">
                <div className="text-white font-semibold text-sm">@{user.name}</div>
                <div className="text-white/30 text-xs">{user.outfits} outfits rated</div>
              </div>

              <div className="text-right">
                <div className="text-yellow-400 font-black text-lg">{user.score}</div>
                <div className="text-white/30 text-xs">avg score</div>
              </div>
            </motion.div>
          ))}

          <div className="p-4 text-center">
            <p className="text-white/30 text-sm">
              Could be you. <span className="text-purple-400 cursor-pointer hover:underline">Start rating →</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

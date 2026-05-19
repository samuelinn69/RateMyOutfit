'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const floatingCards = [
  { score: 9.2, vibe: 'Old Money', emoji: '👑', top: '20%', left: '5%', delay: 0 },
  { score: 7.8, vibe: 'Streetwear', emoji: '🔥', top: '60%', left: '3%', delay: 0.3 },
  { score: 8.5, vibe: 'Y2K Revival', emoji: '✨', top: '15%', right: '4%', delay: 0.6 },
  { score: 6.4, vibe: 'Casual Chic', emoji: '💫', top: '65%', right: '2%', delay: 0.2 },
];

export function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-600/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-orange-600/8 rounded-full blur-[80px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Floating score cards */}
      {floatingCards.map((card, i) => (
        <motion.div
          key={i}
          className="absolute hidden lg:block glass rounded-2xl p-3 min-w-[140px]"
          style={{
            top: card.top,
            left: 'left' in card ? card.left : undefined,
            right: 'right' in card ? card.right : undefined,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
          transition={{
            opacity: { delay: card.delay + 1, duration: 0.5 },
            scale: { delay: card.delay + 1, duration: 0.5 },
            y: { delay: card.delay + 1, duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">{card.emoji}</span>
            <div>
              <div className="text-white font-bold text-lg leading-none">{card.score}</div>
              <div className="text-white/50 text-xs">{card.vibe}</div>
            </div>
          </div>
        </motion.div>
      ))}

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 border border-purple-500/20"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-sm text-purple-300 font-medium">Powered by GPT-4o Vision</span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400">Live</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-6xl sm:text-7xl md:text-8xl font-black text-white leading-[0.9] tracking-tight mb-6"
        >
          Your AI
          <br />
          <span className="gradient-text">Fashion Judge</span>
          <br />
          is ready.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Upload your outfit. Get a brutally honest score, vibe analysis,
          and style tips — in seconds.{' '}
          <span className="text-white/70">No sugarcoating. Just facts.</span>
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Button size="xl" variant="glow" asChild>
            <Link href="/register">
              <Zap className="w-5 h-5" />
              Rate my outfit
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button size="xl" variant="outline" asChild>
            <Link href="/feed">
              <Star className="w-5 h-5" />
              Explore fits
            </Link>
          </Button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-white/40"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {['🧑', '👩', '🧔', '👸', '🙎'].map((e, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full glass border border-white/10 flex items-center justify-center text-sm"
                >
                  {e}
                </div>
              ))}
            </div>
            <span>10K+ outfits rated</span>
          </div>
          <span className="hidden sm:block text-white/20">·</span>
          <div className="flex items-center gap-1.5">
            {'⭐⭐⭐⭐⭐'.split('').map((s, i) => (
              <span key={i}>{s}</span>
            ))}
            <span>4.9/5 rating</span>
          </div>
          <span className="hidden sm:block text-white/20">·</span>
          <span>Free forever</span>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080808] to-transparent" />
    </section>
  );
}

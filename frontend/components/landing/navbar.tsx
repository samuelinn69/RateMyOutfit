'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export function LandingNavbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5"
    >
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-white text-lg tracking-tight">RateMyOutfit</span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <Link
          href="#how-it-works"
          className="text-sm text-white/60 hover:text-white transition-colors"
        >
          How it works
        </Link>
        <Link
          href="#features"
          className="text-sm text-white/60 hover:text-white transition-colors"
        >
          Features
        </Link>
        <Link href="/feed" className="text-sm text-white/60 hover:text-white transition-colors">
          Explore
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/login">Sign in</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/register">Get started free</Link>
        </Button>
      </div>
    </motion.nav>
  );
}

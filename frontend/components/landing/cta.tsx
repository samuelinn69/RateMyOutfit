'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LandingCTA() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-600/20 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center"
      >
        <div className="glass-strong rounded-3xl p-12 gradient-border">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 border border-purple-500/20">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">Free to use · No credit card</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Stop wondering.
            <br />
            <span className="gradient-text">Start knowing.</span>
          </h2>

          <p className="text-xl text-white/50 mb-10 max-w-xl mx-auto">
            10,000+ outfits rated. Join the community that actually knows
            what they look like before leaving the house.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="xl" variant="glow" asChild>
              <Link href="/register">
                Rate my outfit now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          <p className="text-white/20 text-sm mt-6">
            Free forever · No signup required to try
          </p>
        </div>
      </motion.div>
    </section>
  );
}

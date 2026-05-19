'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useT } from '@/hooks/use-t';

export function LandingFooter() {
  const T = useT();

  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-white text-sm">RateMyOutfit</span>
        </div>

        <div className="flex items-center gap-8">
          {T.footer.links.map((item) => (
            <Link key={item} href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">
              {item}
            </Link>
          ))}
        </div>

        <p className="text-white/20 text-sm">{T.footer.copy}</p>
      </div>
    </footer>
  );
}

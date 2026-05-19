'use client';

import { motion } from 'framer-motion';
import { Flame, Star, Palette, MessageSquare, Share2, Users, Zap, Shield } from 'lucide-react';
import { useT } from '@/hooks/use-t';

const icons = [Star, Flame, Palette, MessageSquare, Share2, Users, Zap, Shield];
const styles = [
  { color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { color: 'text-orange-400', bg: 'bg-orange-400/10' },
  { color: 'text-pink-400', bg: 'bg-pink-400/10' },
  { color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { color: 'text-green-400', bg: 'bg-green-400/10' },
  { color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  { color: 'text-violet-400', bg: 'bg-violet-400/10' },
];

export function LandingFeatures() {
  const T = useT();

  return (
    <section id="features" className="py-32 px-6 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/8 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-purple-400 font-semibold text-sm uppercase tracking-widest mb-4">
            {T.features.label}
          </p>
          <h2 className="text-5xl font-black text-white mb-4">
            {T.features.title1}
            <br />
            {T.features.title2}
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">{T.features.sub}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {T.features.items.map((feature, i) => {
            const Icon = icons[i];
            const style = styles[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass rounded-2xl p-6 hover:bg-white/8 transition-colors group"
              >
                <div className={`w-10 h-10 rounded-xl ${style.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${style.color}`} />
                </div>
                <h3 className="font-bold text-white mb-2 text-sm">{feature.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import {
  Flame,
  Star,
  Palette,
  MessageSquare,
  Share2,
  Users,
  Zap,
  Shield,
} from 'lucide-react';

const features = [
  {
    icon: Star,
    title: 'Multi-dimensional scoring',
    description: 'Score your outfit across 5 dimensions: overall, colors, fit, aesthetics, and originality.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
  },
  {
    icon: Flame,
    title: 'Roast mode',
    description: "Enable roast mode for brutal, hilarious feedback that'll make you laugh and cringe.",
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
  },
  {
    icon: Palette,
    title: 'Color analysis',
    description: 'Get complementary color palettes, what clashes, and what works for your skin tone.',
    color: 'text-pink-400',
    bg: 'bg-pink-400/10',
  },
  {
    icon: MessageSquare,
    title: 'Vibe detection',
    description: "AI identifies your style vibe — Old Money, Streetwear, Y2K, Quiet Luxury, and 15+ more.",
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    icon: Share2,
    title: 'Viral share cards',
    description: 'Share your results as a stunning card on Instagram, TikTok, or anywhere you flex.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: Users,
    title: 'Social feed',
    description: 'See trending outfits, like your favorites, and discover style inspo from the community.',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
  },
  {
    icon: Zap,
    title: 'Instant analysis',
    description: 'Results in under 10 seconds. Powered by GPT-4o Vision — the most advanced AI available.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
  },
  {
    icon: Shield,
    title: 'Privacy first',
    description: 'Keep your outfits private or share with the world. You stay in control.',
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
  },
];

export function LandingFeatures() {
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
            Features
          </p>
          <h2 className="text-5xl font-black text-white mb-4">
            Not just a rating.
            <br />A full fashion AI.
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Every detail your stylist would notice, delivered instantly.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass rounded-2xl p-6 hover:bg-white/8 transition-colors group"
            >
              <div className={`w-10 h-10 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <h3 className="font-bold text-white mb-2 text-sm">{feature.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

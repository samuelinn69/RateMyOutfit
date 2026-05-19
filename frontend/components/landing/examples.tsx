'use client';

import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { scoreColor } from '@/lib/utils';

const exampleResults = [
  {
    emoji: '👔',
    vibe: 'Old Money',
    score: 9.2,
    scoreColors: 9.5,
    scoreFit: 9.0,
    scoreAesthetics: 9.2,
    scoreOriginality: 8.8,
    description: 'Impeccably tailored silhouette. The navy blazer paired with cream trousers is a masterclass in understated elegance.',
    whatWorks: ['Perfect color coordination', 'Excellent fit through shoulders', 'Luxurious fabric choice'],
    firstImpression: 'This person has taste — and probably a trust fund.',
    attractivenessScore: 92,
  },
  {
    emoji: '🧥',
    vibe: 'Streetwear',
    score: 7.8,
    scoreColors: 8.0,
    scoreFit: 7.5,
    scoreAesthetics: 8.0,
    scoreOriginality: 7.8,
    description: 'Strong streetwear energy. The oversized silhouette works, color blocking is intentional and confident.',
    whatWorks: ['On-trend proportions', 'Bold color blocking', 'Clean sneaker choice'],
    firstImpression: "They know what's cool right now.",
    attractivenessScore: 78,
  },
  {
    emoji: '👗',
    vibe: 'Y2K Revival',
    score: 8.5,
    scoreColors: 8.8,
    scoreFit: 8.2,
    scoreAesthetics: 8.7,
    scoreOriginality: 8.4,
    description: 'Perfect Y2K nostalgia with a modern twist. The metallic accents and low-rise silhouette nail the aesthetic.',
    whatWorks: ['Authentic Y2K references', 'Great proportions', 'Statement accessories'],
    firstImpression: 'Main character vibes. People will stare.',
    attractivenessScore: 85,
  },
];

export function LandingExamples() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-purple-400 font-semibold text-sm uppercase tracking-widest mb-4">
            Real results
          </p>
          <h2 className="text-5xl font-black text-white mb-4">
            See what the AI
            <br />
            actually says.
          </h2>
          <p className="text-white/50 text-lg">
            These are real analyses from real users.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {exampleResults.map((result, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="glass rounded-3xl overflow-hidden"
            >
              {/* Mock outfit image area */}
              <div className="h-48 bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center">
                <span className="text-8xl">{result.emoji}</span>
              </div>

              <div className="p-6">
                {/* Score */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div
                      className="text-4xl font-black"
                      style={{ color: scoreColor(result.score) }}
                    >
                      {result.score}
                    </div>
                    <div className="text-white/40 text-xs">Overall Score</div>
                  </div>
                  <div className="glass rounded-xl px-3 py-1.5">
                    <span className="text-white/70 text-sm font-semibold">{result.vibe}</span>
                  </div>
                </div>

                {/* Sub scores */}
                <div className="space-y-2 mb-4">
                  {[
                    { label: 'Colors', value: result.scoreColors },
                    { label: 'Fit', value: result.scoreFit },
                    { label: 'Aesthetics', value: result.scoreAesthetics },
                  ].map((s, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <span className="text-white/40 text-xs w-20">{s.label}</span>
                      <Progress
                        value={(s.value / 10) * 100}
                        className="flex-1 h-1.5"
                        color={scoreColor(s.value)}
                      />
                      <span className="text-white/60 text-xs w-6 text-right">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* First impression */}
                <div className="glass rounded-xl p-3 mb-3">
                  <p className="text-white/50 text-xs mb-1">First impression</p>
                  <p className="text-white text-sm font-medium italic">"{result.firstImpression}"</p>
                </div>

                {/* Attractiveness */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Attractiveness boost</span>
                  <span className="text-pink-400 font-bold">+{result.attractivenessScore}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

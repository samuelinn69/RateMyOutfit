'use client';

import { motion } from 'framer-motion';
import { Upload, Cpu, Trophy } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    step: '01',
    title: 'Upload your fit',
    description:
      'Drop any photo — mirror selfie, full body shot, street style pic. Our AI handles the rest.',
    color: 'from-purple-600 to-purple-800',
    glow: 'rgba(168,85,247,0.3)',
  },
  {
    icon: Cpu,
    step: '02',
    title: 'AI does its thing',
    description:
      'GPT-4o analyzes your outfit in seconds — scores, vibes, color theory, fit assessment, the works.',
    color: 'from-pink-600 to-pink-800',
    glow: 'rgba(236,72,153,0.3)',
  },
  {
    icon: Trophy,
    step: '03',
    title: 'Get your results',
    description:
      'Scores, improvements, accessories, hairstyle tips, dating advice — a full breakdown you can actually use.',
    color: 'from-orange-600 to-orange-800',
    glow: 'rgba(249,115,22,0.3)',
  },
];

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-purple-400 font-semibold text-sm uppercase tracking-widest mb-4">
            How it works
          </p>
          <h2 className="text-5xl font-black text-white mb-4">
            From upload to glow-up
            <br />
            in 10 seconds.
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            No account needed to try. Just drop your fit and watch the AI do its thing.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative"
            >
              <div className="glass rounded-3xl p-8 h-full group hover:bg-white/8 transition-colors">
                <div className="mb-6">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4`}
                    style={{
                      boxShadow: `0 0 30px ${step.glow}`,
                    }}
                  >
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-6xl font-black text-white/5 select-none absolute top-6 right-8">
                    {step.step}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-white/50 leading-relaxed">{step.description}</p>
              </div>

              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 text-white/20 z-10 text-2xl">
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

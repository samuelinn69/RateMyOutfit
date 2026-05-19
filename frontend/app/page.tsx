import { Metadata } from 'next';
import { LandingHero } from '@/components/landing/hero';
import { LandingFeatures } from '@/components/landing/features';
import { LandingHowItWorks } from '@/components/landing/how-it-works';
import { LandingExamples } from '@/components/landing/examples';
import { LandingLeaderboard } from '@/components/landing/leaderboard';
import { LandingCTA } from '@/components/landing/cta';
import { LandingNavbar } from '@/components/landing/navbar';
import { LandingFooter } from '@/components/landing/footer';

export const metadata: Metadata = {
  title: 'RateMyOutfit — AI Fashion Judge',
  description:
    'Upload your fit. Get roasted by AI. Glow up your style. The viral fashion app that tells you the truth your friends won\'t.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#080808] overflow-x-hidden">
      <LandingNavbar />
      <LandingHero />
      <LandingHowItWorks />
      <LandingFeatures />
      <LandingExamples />
      <LandingLeaderboard />
      <LandingCTA />
      <LandingFooter />
    </div>
  );
}

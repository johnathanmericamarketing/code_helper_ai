import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { ValueStrip } from '@/components/landing/ValueStrip';
import { WhySection } from '@/components/landing/WhySection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { AudienceSection } from '@/components/landing/AudienceSection';
import { DifferentiatorSection } from '@/components/landing/DifferentiatorSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { LandingFooter } from '@/components/landing/LandingFooter';

export const LandingPage = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden selection:bg-violet-600/20">
      <LandingHeader />
      
      <main>
        <HeroSection />
        <ValueStrip />
        <WhySection />
        <HowItWorksSection />
        <FeaturesSection />
        <AudienceSection />
        <DifferentiatorSection />
        <FAQSection />
      </main>

      <LandingFooter />
    </div>
  );
};

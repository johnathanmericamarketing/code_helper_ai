import React, { useEffect } from 'react';
import '../../styles/landing.css';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { ValueStrip } from '@/components/landing/ValueStrip';
import { WhySection } from '@/components/landing/WhySection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { AudienceSection } from '@/components/landing/AudienceSection';
import { DifferentiatorSection } from '@/components/landing/DifferentiatorSection';
import { TryItSection } from '@/components/landing/TryItSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { LandingFooter } from '@/components/landing/LandingFooter';

export const LandingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  return (
    <div style={{minHeight:'100vh', background:'#080c18', color:'#f1f5f9', overflowX:'hidden'}}>
      <LandingHeader />
      <main id="top">
        <HeroSection />
        <ValueStrip />
        <WhySection />
        <HowItWorksSection />
        <FeaturesSection />
        <AudienceSection />
        <DifferentiatorSection />
        <TryItSection />
        <FAQSection />
      </main>
      <LandingFooter />
    </div>
  );
};

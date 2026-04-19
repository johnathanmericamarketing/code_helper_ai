import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { HeroStudioVisual } from './HeroStudioVisual';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[minmax(0,1.08fr)_500px] gap-12 lg:gap-16 items-center">
        
        {/* Left Copy */}
        <div className="flex flex-col items-start z-10">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm text-xs font-semibold text-slate-600 tracking-wide uppercase mb-6">
            Built for safer AI website changes
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-[64px] font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
            Your AI website team,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
              with preview, memory, and control.
            </span>
          </h1>

          <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-xl">
            Code Helper Studio helps people improve websites faster by turning plain-language requests into safe visual previews, brand-aware changes, and controlled publishing.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10">
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-full bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/20 text-base" onClick={() => navigate('/auth')}>
              Start building for free
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-full border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-base" onClick={() => {
              document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Watch the workflow <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Trust Bullets */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-medium text-slate-700">Safe before & after preview</span>
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-medium text-slate-700">Brand-aware AI changes</span>
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-medium text-slate-700">Drafts, versions & restore</span>
            </div>
          </div>
        </div>

        {/* Right Visual */}
        <div className="relative w-full flex justify-center lg:justify-end">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-violet-100 to-blue-50 opacity-50 blur-3xl rounded-full -z-10" />
          <HeroStudioVisual />
        </div>

      </div>
    </section>
  );
};

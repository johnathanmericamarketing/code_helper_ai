import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export const DifferentiatorSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left */}
        <div>
          <span className="text-sm font-bold text-violet-600 uppercase tracking-widest">What makes it different</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mt-4 mb-6">
            It explains the change, not just generates it.
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-4">
            The system does more than output UI. It helps people understand what changed, compare it against the live version, and decide what to do next.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            That makes it more useful for approval, iteration, stakeholder review, and safer deployment.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <span className="bg-white border border-slate-200 px-4 py-2 rounded-full text-sm font-semibold text-slate-700 shadow-sm">Guided mode</span>
            <span className="bg-white border border-slate-200 px-4 py-2 rounded-full text-sm font-semibold text-slate-700 shadow-sm">Visual inspector</span>
            <span className="bg-white border border-slate-200 px-4 py-2 rounded-full text-sm font-semibold text-slate-700 shadow-sm">Version restore</span>
            <span className="bg-white border border-slate-200 px-4 py-2 rounded-full text-sm font-semibold text-slate-700 shadow-sm">Brand memory</span>
          </div>
        </div>

        {/* Right CTA Card */}
        <div className="bg-gradient-to-br from-violet-600 to-indigo-800 text-white p-10 md:p-12 rounded-[32px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <span className="text-xs font-bold text-violet-200 uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-full">Sign up</span>
            <h3 className="text-3xl md:text-4xl font-bold mt-6 mb-4 leading-tight">
              Start improving your website with safer AI workflows.
            </h3>
            <p className="text-violet-100 text-lg mb-8 leading-relaxed">
              Create a project, load your current site, and generate your first guided preview in minutes.
            </p>

            <ul className="space-y-3 mb-10">
              <li className="flex items-center gap-3 text-violet-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> Create your workspace
              </li>
              <li className="flex items-center gap-3 text-violet-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> Add your site and brand context
              </li>
              <li className="flex items-center gap-3 text-violet-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> Generate your first safe preview
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-violet-900 hover:bg-slate-100 h-14 px-8 rounded-full font-bold shadow-lg" onClick={() => navigate('/auth')}>
                Create free account
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-14 px-8 rounded-full font-bold">
                Book a demo
              </Button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

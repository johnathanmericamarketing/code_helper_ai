import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const AudienceSection = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="text-sm font-bold text-violet-600 uppercase tracking-widest">Who this is for</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mt-4 max-w-3xl">
            Built for mixed teams, not just developers.
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-[28px]">
              <h3 className="text-xl font-bold text-slate-900 mb-3">For founders and marketers</h3>
              <p className="text-slate-600 leading-relaxed">
                Ship website improvements without waiting on a long dev queue for every headline, layout tweak, or conversion test.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-[28px]">
              <h3 className="text-xl font-bold text-slate-900 mb-3">For designers and operators</h3>
              <p className="text-slate-600 leading-relaxed">
                Review proposed UI changes visually, keep brand consistency tighter, and collaborate around safer previews.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-[28px]">
              <h3 className="text-xl font-bold text-slate-900 mb-3">For developers</h3>
              <p className="text-slate-600 leading-relaxed">
                Keep access to code, version history, logic review, and deployment workflows without making the product feel technical to everyone else.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-10 rounded-[32px] shadow-2xl sticky top-24">
            <h3 className="text-2xl md:text-3xl font-bold mb-8 leading-tight">
              Less friction. More confidence. Faster shipping.
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-violet-400 shrink-0 mt-0.5" />
                <p className="text-slate-300 leading-relaxed">The AI uses project context instead of starting cold every time.</p>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-violet-400 shrink-0 mt-0.5" />
                <p className="text-slate-300 leading-relaxed">Review happens visually, not only in generated code blocks.</p>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-violet-400 shrink-0 mt-0.5" />
                <p className="text-slate-300 leading-relaxed">Brand consistency is easier to protect across iterations.</p>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-violet-400 shrink-0 mt-0.5" />
                <p className="text-slate-300 leading-relaxed">Publishing feels safer because preview, versions, and restore are part of the workflow.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

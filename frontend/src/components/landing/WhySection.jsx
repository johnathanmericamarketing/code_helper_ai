import React from 'react';

export const WhySection = () => {
  return (
    <section id="why" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="text-sm font-bold text-violet-600 uppercase tracking-widest">Why this system exists</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mt-4 mb-6 max-w-3xl">
            Most teams do not need more website tools. They need a safer way to make changes.
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
            Website updates usually break down between vague requests, long feedback loops, inconsistent styling, and fear of publishing the wrong thing. Code Helper Studio reduces that friction by turning AI into a guided workspace instead of a black box.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-50 border border-slate-200 p-8 rounded-[28px]">
            <h3 className="text-xl font-bold text-slate-900 mb-4">The problem with normal AI chat</h3>
            <p className="text-slate-600 leading-relaxed">
              Most tools generate once and forget context. Teams repeat themselves, lose consistency, and end up reviewing output with low confidence.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-8 rounded-[28px]">
            <h3 className="text-xl font-bold text-slate-900 mb-4">The difference here</h3>
            <p className="text-slate-600 leading-relaxed">
              This system carries project context, previous approved changes, brand rules, and visual review into the workflow.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-8 rounded-[28px]">
            <h3 className="text-xl font-bold text-slate-900 mb-4">The core promise</h3>
            <p className="text-slate-600 leading-relaxed">
              You can request change quickly, see the result safely, and only publish when it looks right.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

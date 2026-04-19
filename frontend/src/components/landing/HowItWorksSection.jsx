import React from 'react';

export const HowItWorksSection = () => {
  const steps = [
    {
      num: "01",
      title: "Connect your project",
      copy: "Add your website, project context, brand rules, and deployment target so the system understands what it is working on."
    },
    {
      num: "02",
      title: "Describe a change",
      copy: "Ask for a redesign, copy improvement, layout cleanup, mobile fix, or section-specific update using everyday language."
    },
    {
      num: "03",
      title: "Review the preview",
      copy: "See what changed, compare it against the current site, inspect details visually, and refine without fear."
    },
    {
      num: "04",
      title: "Publish when ready",
      copy: "Approve the result, publish safely, and keep a version trail you can return to later."
    }
  ];

  return (
    <section id="how" className="py-24 px-6 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="text-sm font-bold text-violet-400 uppercase tracking-widest">How it works</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-4 mb-6 max-w-3xl">
            A simple workflow for people who want results, not tool complexity.
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
            The system is designed to feel understandable for non-technical users while still giving technical teams the control they expect.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 p-8 rounded-[28px] relative overflow-hidden group">
              <div className="text-6xl font-black text-slate-800 mb-6 group-hover:text-violet-900/50 transition-colors">
                {step.num}
              </div>
              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed">
                {step.copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Sparkles, Eye, Palette, History, Key, ShieldCheck } from 'lucide-react';

export const FeaturesSection = () => {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-violet-600" />,
      title: "AI website changes",
      copy: "Describe what you want in plain language and generate a safe visual preview before anything goes live."
    },
    {
      icon: <Eye className="w-6 h-6 text-violet-600" />,
      title: "Before and after review",
      copy: "Compare your current site with the proposed update side by side so changes feel obvious and low risk."
    },
    {
      icon: <Palette className="w-6 h-6 text-violet-600" />,
      title: "Brand-aware output",
      copy: "Keep colors, fonts, spacing, and tone more consistent by using project context and saved brand rules."
    },
    {
      icon: <History className="w-6 h-6 text-violet-600" />,
      title: "Version confidence",
      copy: "Save drafts, review previous versions, and restore with confidence when something needs to be rolled back."
    },
    {
      icon: <Key className="w-6 h-6 text-violet-600" />,
      title: "Bring your own keys",
      copy: "Use your own model keys or platform-managed access depending on how you want to scale and control costs."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-violet-600" />,
      title: "Safe publishing",
      copy: "Keep your live site protected until you explicitly publish the approved preview."
    }
  ];

  return (
    <section id="features" className="py-24 px-6 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-bold text-violet-600 uppercase tracking-widest">What you can do</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mt-4 mb-6 max-w-3xl mx-auto">
            One workspace for AI generation, visual review, brand control, and publishing.
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Instead of juggling disconnected tools, you get one guided environment for understanding the current site, proposing changes, reviewing output, and moving forward safely.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white border border-slate-200 p-8 rounded-[28px] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center mb-6">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
              <p className="text-slate-600 leading-relaxed">{f.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

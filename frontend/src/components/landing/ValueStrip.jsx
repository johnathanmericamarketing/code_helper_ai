import React from 'react';
import { Sparkles, Eye, Save, Lock } from 'lucide-react';

export const ValueStrip = () => {
  const items = [
    { icon: <Sparkles className="w-4 h-4 text-violet-600" />, label: "AI-assisted changes" },
    { icon: <Eye className="w-4 h-4 text-violet-600" />, label: "Guided visual workflow" },
    { icon: <Save className="w-4 h-4 text-violet-600" />, label: "Project + deploy aware" },
    { icon: <Lock className="w-4 h-4 text-violet-600" />, label: "Protected publishing" }
  ];

  return (
    <div className="border-y border-slate-200 bg-slate-50/50 py-6 px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-between gap-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2.5 rounded-[16px] shadow-sm flex-1 min-w-[200px] justify-center md:justify-start">
            {item.icon}
            <span className="text-sm font-semibold text-slate-700">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

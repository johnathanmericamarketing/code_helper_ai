import React from 'react';
import { 
  Wand2, 
  Layout, 
  Settings, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const HeroStudioVisual = () => {
  return (
    <div className="w-full max-w-[500px] aspect-[4/3] bg-white rounded-[30px] border border-slate-200 shadow-2xl shadow-violet-500/10 overflow-hidden flex flex-col relative select-none">
      
      {/* Top Bar */}
      <div className="h-10 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          </div>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest ml-2">Workspace Studio</span>
        </div>
        <div className="bg-violet-100 text-violet-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          Guided Mode
        </div>
      </div>

      {/* Main Body */}
      <div className="flex flex-1 min-h-0 bg-slate-50/30">
        
        {/* Left Rail */}
        <div className="w-12 border-r border-slate-100 bg-white flex flex-col items-center py-4 gap-4 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
            <Layout className="w-4 h-4" />
          </div>
          <div className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-50 flex items-center justify-center transition-colors">
            <Wand2 className="w-4 h-4" />
          </div>
          <div className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-50 flex items-center justify-center transition-colors mt-auto">
            <Settings className="w-4 h-4" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden relative">
          
          {/* Prompt Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex gap-3 items-start shrink-0">
            <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-800">Make the hero section dark mode and round the buttons.</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-violet-500 rounded-full" />
                </div>
                <span className="text-[9px] text-slate-400 font-medium uppercase">Validating...</span>
              </div>
            </div>
          </div>

          {/* Previews */}
          <div className="flex gap-3 flex-1 min-h-0">
            {/* Current */}
            <div className="flex-1 flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm opacity-60">
              <div className="h-6 bg-slate-50 border-b border-slate-100 flex items-center px-2 shrink-0">
                <span className="text-[9px] font-semibold text-slate-500 uppercase">Current Live</span>
              </div>
              <div className="flex-1 p-2 flex flex-col gap-2">
                <div className="w-16 h-2 bg-slate-200 rounded-sm" />
                <div className="w-full h-12 bg-slate-100 rounded-md" />
                <div className="w-12 h-4 bg-slate-200 rounded-sm" />
              </div>
            </div>

            {/* Preview */}
            <div className="flex-1 flex flex-col border-2 border-violet-500 rounded-xl overflow-hidden bg-slate-900 shadow-md">
              <div className="h-6 bg-slate-800 border-b border-slate-700 flex items-center px-2 shrink-0">
                <span className="text-[9px] font-semibold text-violet-400 uppercase">Preview</span>
              </div>
              <div className="flex-1 p-2 flex flex-col gap-2">
                <div className="w-16 h-2 bg-slate-700 rounded-sm" />
                <div className="w-full h-12 bg-slate-800 rounded-md" />
                <div className="w-12 h-4 bg-violet-600 rounded-full" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Summary Card */}
      <div className="absolute bottom-6 right-6 w-48 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-3 shadow-xl shadow-slate-200/50">
        <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
          <RefreshCw className="w-3 h-3 text-violet-600" />
          What changed
        </h4>
        <ul className="space-y-1.5 mb-3">
          <li className="flex items-center gap-1.5 text-[10px] text-slate-600">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Changed bg to slate-900
          </li>
          <li className="flex items-center gap-1.5 text-[10px] text-slate-600">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Updated button radius
          </li>
        </ul>
        <div className="flex gap-2">
          <button className="flex-1 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold hover:bg-slate-200 transition-colors">
            Save draft
          </button>
          <button className="flex-1 py-1.5 rounded-lg bg-violet-600 text-white text-[10px] font-bold hover:bg-violet-700 transition-colors shadow-sm">
            Publish
          </button>
        </div>
      </div>

    </div>
  );
};

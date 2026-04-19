import React from 'react';
import { FileCode2 } from 'lucide-react';

export const LandingFooter = () => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-slate-200 bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-10">
        
        {/* Left */}
        <div className="space-y-4 max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <FileCode2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">Code Helper Studio</span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            AI website workspace for safer changes and faster publishing.
          </p>
        </div>

        {/* Right Links */}
        <div className="flex gap-12">
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-slate-900 text-sm">Product</h4>
            <button onClick={() => scrollTo('features')} className="text-sm text-slate-500 hover:text-violet-600 text-left">Features</button>
            <button onClick={() => scrollTo('how')} className="text-sm text-slate-500 hover:text-violet-600 text-left">How it works</button>
            <button onClick={() => scrollTo('faq')} className="text-sm text-slate-500 hover:text-violet-600 text-left">FAQ</button>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-slate-900 text-sm">Legal</h4>
            <button className="text-sm text-slate-500 hover:text-violet-600 text-left">Privacy Policy</button>
            <button className="text-sm text-slate-500 hover:text-violet-600 text-left">Terms of Service</button>
          </div>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-400">© {new Date().getFullYear()} Code Helper AI. All rights reserved.</p>
        <p className="text-xs text-slate-400">Built securely on Google Cloud Platform & Firebase.</p>
      </div>
    </footer>
  );
};

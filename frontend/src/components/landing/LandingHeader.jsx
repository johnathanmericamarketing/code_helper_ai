import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileCode2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const LandingHeader = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shadow-sm">
            <FileCode2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[15px] tracking-tight text-slate-900 leading-none">Code Helper Studio</span>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mt-0.5">AI Website Workspace</span>
          </div>
        </div>

        {/* Center */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollTo('why')} className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">Why it works</button>
          <button onClick={() => scrollTo('how')} className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">How it works</button>
          <button onClick={() => scrollTo('features')} className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">Features</button>
          <button onClick={() => scrollTo('faq')} className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">FAQ</button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <Button onClick={() => navigate('/app')} className="rounded-full bg-violet-600 hover:bg-violet-700 text-white shadow-sm">
              Open Workspace
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/auth')} className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full font-medium">
                Sign in
              </Button>
              <Button onClick={() => navigate('/auth')} className="rounded-full bg-violet-600 hover:bg-violet-700 text-white shadow-sm font-medium px-6">
                Start free
              </Button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

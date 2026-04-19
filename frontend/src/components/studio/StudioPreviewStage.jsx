import React from 'react';
import { LiveSitePreview } from '@/components/LiveSitePreview';
import { VisualInspector } from '@/components/VisualInspector';
import { Badge } from '@/components/ui/badge';
import { Eye, Wand2, Sparkles, Loader2 } from 'lucide-react';

export const StudioPreviewStage = ({ 
  currentDomain, 
  futureAppCode, 
  isGenerating 
}) => {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 min-h-0 bg-[var(--bg-app)]">
      
      {/* Current Site Card */}
      <div className="flex flex-col h-full bg-surface border border-subtle rounded-[var(--radius-card)] overflow-hidden shadow-sm">
        <div className="h-12 border-b border-subtle flex items-center px-4 bg-muted-custom shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border-strong text-muted-custom">
              Before
            </Badge>
            <span className="text-sm font-semibold text-primary-custom flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-secondary-custom"/> Current Site
            </span>
          </div>
        </div>
        <div className="flex-1 min-h-0 bg-background">
          <LiveSitePreview initialUrl={currentDomain} title="Your Site" />
        </div>
      </div>

      {/* Future Site Card */}
      <div className={`flex flex-col h-full bg-surface border rounded-[var(--radius-card)] overflow-hidden shadow-sm transition-colors ${futureAppCode && !isGenerating ? 'border-[var(--accent-500)] ring-1 ring-[var(--accent-500)]' : 'border-subtle'}`}>
        <div className={`h-12 border-b flex items-center px-4 shrink-0 transition-colors ${futureAppCode && !isGenerating ? 'bg-[var(--accent-50)] border-[var(--accent-200)]' : 'bg-muted-custom border-subtle'}`}>
          <div className="flex items-center gap-2">
            <Badge variant={futureAppCode && !isGenerating ? 'default' : 'outline'} className={futureAppCode && !isGenerating ? 'bg-[var(--accent-600)] text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5' : 'text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border-strong text-muted-custom'}>
              After
            </Badge>
            <span className="text-sm font-semibold text-primary-custom flex items-center gap-1.5">
              <Wand2 className={`w-3.5 h-3.5 ${futureAppCode && !isGenerating ? 'text-[var(--accent-600)]' : 'text-secondary-custom'}`}/> Preview Changes
            </span>
          </div>
        </div>
        
        <div className="flex-1 min-h-0 relative bg-background">
          {isGenerating ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/80 backdrop-blur-sm z-10 gap-4">
              <div className="w-10 h-10 border-4 border-[var(--accent-500)] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-primary-custom font-medium animate-pulse">Building your changes…</p>
            </div>
          ) : futureAppCode ? (
            <VisualInspector htmlContent={futureAppCode} title="Your Site With Changes" isPreview />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-custom opacity-60 space-y-4 px-8 text-center">
              <Sparkles className="w-12 h-12 text-[var(--accent-500)]" />
              <p className="font-medium text-sm">Tell us what to change below.<br/>You'll see how your site will look here before you publish.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

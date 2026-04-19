import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rocket, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

export const StudioReviewRail = ({ 
  isGenerating,
  futureAppCode,
  summary,
  onPublish
}) => {
  if (!futureAppCode && !isGenerating) return null;

  return (
    <div className="w-80 bg-surface border-l border-subtle flex flex-col h-full shrink-0 shadow-[-4px_0_20px_-10px_rgba(0,0,0,0.05)] z-10 overflow-y-auto">
      
      <div className="p-4 border-b border-subtle bg-muted-custom">
        <h3 className="font-bold text-primary-custom text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-[var(--accent-600)]" />
          Change Summary
        </h3>
      </div>

      <div className="p-4 space-y-6 flex-1">
        {/* Summary Card */}
        <div className="space-y-2">
          <p className="text-sm text-secondary-custom leading-relaxed">
            {isGenerating ? (
              <span className="animate-pulse">Analyzing changes...</span>
            ) : (
              summary || 'We updated the UI based on your request. Please review the changes on the left before publishing.'
            )}
          </p>
        </div>

        {/* Checklist Card */}
        {!isGenerating && futureAppCode && (
          <div className="bg-[var(--bg-app)] border border-subtle rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary-custom mb-3">
              Before you publish
            </h4>
            
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--success-text)] shrink-0 mt-0.5" />
              <p className="text-xs text-secondary-custom">Code compiled successfully.</p>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--success-text)] shrink-0 mt-0.5" />
              <p className="text-xs text-secondary-custom">Brand rules respected.</p>
            </div>

            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-[var(--warning-text)] shrink-0 mt-0.5" />
              <p className="text-xs text-secondary-custom">You are about to overwrite the live site.</p>
            </div>
          </div>
        )}
      </div>

      {!isGenerating && futureAppCode && (
        <div className="p-4 border-t border-subtle bg-surface shrink-0">
          <Button 
            className="w-full gap-2 bg-[var(--accent-600)] hover:bg-[var(--accent-700)] text-white shadow-md rounded-[var(--radius-button)] py-6 text-base"
            onClick={onPublish}
          >
            <Rocket className="w-5 h-5" /> Publish Now
          </Button>
        </div>
      )}

    </div>
  );
};

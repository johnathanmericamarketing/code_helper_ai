import React from 'react';
import { History, CheckCircle2, RotateCcw, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const VersionCard = ({ version, onCompare, onRestore }) => {
  const isPublished = version.status === 'approved' || version.type === 'published';
  const date = new Date(version.created_at || Date.now()).toLocaleString('en-US', { 
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
  });

  return (
    <div className="bg-surface border border-subtle rounded-[var(--radius-card)] p-5 hover:shadow-sm transition-all group">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-start gap-4">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            isPublished ? "bg-[var(--success-bg)] text-[var(--success-text)]" : "bg-[var(--accent-100)] text-[var(--accent-600)]"
          )}>
            {isPublished ? <CheckCircle2 className="w-5 h-5" /> : <History className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-primary-custom text-sm">
                {isPublished ? 'Published Snapshot' : 'Draft Generation'}
              </h3>
              <span className="text-xs text-muted-custom">• {date}</span>
            </div>
            <p className="text-secondary-custom text-sm line-clamp-2">
              {version.raw_request || version.prompt || 'Manual update'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onCompare(version)}
            className="gap-2 rounded-[var(--radius-button)] border-subtle text-secondary-custom"
          >
            <GitCompare className="w-4 h-4" /> Compare
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => onRestore(version)}
            className="gap-2 rounded-[var(--radius-button)] bg-[var(--accent-600)] hover:bg-[var(--accent-700)] text-white"
          >
            <RotateCcw className="w-4 h-4" /> Restore
          </Button>
        </div>

      </div>
    </div>
  );
};

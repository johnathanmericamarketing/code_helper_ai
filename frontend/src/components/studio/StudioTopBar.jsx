import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Undo2, Save, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'guided', label: 'Guided' },
  { id: 'build',  label: 'Build'  },
  { id: 'review', label: 'Review' },
];

/**
 * StudioTopBar
 * The top action bar inside Workspace Studio.
 * Contains: page title, Guided/Build/Review tabs, Undo, Save Draft, Publish.
 */
export const StudioTopBar = ({
  activeTab,
  onTabChange,
  onUndo,
  onSaveDraft,
  onPublish,
  canPublish,
  isGenerating,
}) => {
  return (
    <div className="border-b border-border bg-card px-5 py-3 shrink-0">
      <div className="flex items-start justify-between gap-4">

        {/* Page identity */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="secondary"
              className="text-[10px] h-5 px-2 bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20"
            >
              Builder mode
            </Badge>
            <span className="text-[10px] text-muted-foreground">Safe preview only</span>
          </div>
          <h1 className="text-xl font-semibold text-foreground leading-none">Workspace Studio</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Compare your live site and AI changes side by side before publishing.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Guided / Build / Review tab group */}
          <div className="flex rounded-lg border border-border bg-muted/30 p-0.5">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                  activeTab === tab.id
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Undo */}
          <Button
            variant="outline"
            size="sm"
            onClick={onUndo}
            className="h-8 gap-1.5 text-xs bg-card"
          >
            <Undo2 className="w-3.5 h-3.5" /> Undo
          </Button>

          {/* Save Draft */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs bg-card"
            disabled={!canPublish}
            onClick={onSaveDraft}
          >
            <Save className="w-3.5 h-3.5" /> Save draft
          </Button>

          {/* Publish */}
          <Button
            size="sm"
            className="h-8 gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={!canPublish || isGenerating}
            onClick={onPublish}
          >
            <Rocket className="w-3.5 h-3.5" /> Publish changes
          </Button>

        </div>
      </div>
    </div>
  );
};

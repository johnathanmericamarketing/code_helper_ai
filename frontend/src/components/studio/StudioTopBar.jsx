import React from 'react';
import { Button } from '@/components/ui/button';
import { Undo, Save, Rocket, Code2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export const StudioTopBar = ({ projectName, onPublish, canPublish }) => {
  return (
    <div className="h-14 bg-surface border-b border-subtle flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-[var(--accent-600)]" />
          <h2 className="font-bold text-primary-custom">
            Studio <span className="text-muted-custom font-normal mx-1">/</span> {projectName || 'Loading...'}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 mr-4 border-r border-subtle pr-4">
          <span className="text-xs font-medium text-secondary-custom">Guided</span>
          <Switch disabled />
          <span className="text-xs font-medium text-muted-custom">Advanced</span>
        </div>

        <Button variant="outline" size="sm" className="gap-2 rounded-[var(--radius-button)] border-subtle h-8" disabled>
          <Undo className="w-3.5 h-3.5" /> Undo
        </Button>
        <Button variant="outline" size="sm" onClick={onSaveDraft} className="gap-2 rounded-[var(--radius-button)] border-subtle h-8">
          <Save className="w-3.5 h-3.5" /> Save draft
        </Button>
        <Button 
          size="sm" 
          onClick={onPublish}
          disabled={!canPublish}
          className="gap-2 bg-[var(--accent-600)] hover:bg-[var(--accent-700)] text-white shadow-sm rounded-[var(--radius-button)] h-8"
        >
          <Rocket className="w-3.5 h-3.5" /> Publish
        </Button>
      </div>
    </div>
  );
};

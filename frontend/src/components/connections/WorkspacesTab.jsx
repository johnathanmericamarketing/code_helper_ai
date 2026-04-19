import React from 'react';
import { FolderGit2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const WorkspacesTab = () => {
  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-primary-custom">Local Workspaces</h3>
          <p className="text-sm text-muted-custom">Connect to a local directory for desktop development.</p>
        </div>
        <Button className="gap-2 bg-[var(--accent-600)] hover:bg-[var(--accent-700)] text-white shadow-sm rounded-[var(--radius-button)]">
          <Plus className="w-4 h-4" /> Link Folder
        </Button>
      </div>

      <div className="bg-surface border border-dashed border-strong rounded-[var(--radius-card)] p-12 text-center">
        <FolderGit2 className="w-12 h-12 text-muted-custom mx-auto mb-4 opacity-50" />
        <h4 className="text-base font-semibold text-primary-custom mb-1">No workspaces linked</h4>
        <p className="text-sm text-secondary-custom max-w-sm mx-auto mb-6">
          Link a local folder to sync files directly to your computer. Requires the desktop agent.
        </p>
        <Button variant="outline" className="border-subtle rounded-[var(--radius-button)]">
          Download Desktop Agent
        </Button>
      </div>
    </div>
  );
};

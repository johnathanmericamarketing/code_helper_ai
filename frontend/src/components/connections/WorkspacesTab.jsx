import React from 'react';
import { FolderGit2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const WorkspacesTab = () => (
  <div className="space-y-6 fade-in">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-bold text-[var(--text-primary)]">Local Workspaces</h3>
        <p className="text-sm text-[var(--text-muted)]">Connect to a local directory for desktop development.</p>
      </div>
      <Button
        className="gap-2 text-white rounded-[var(--radius-button)]"
        style={{ backgroundColor: 'var(--accent-600)' }}
      >
        <Plus className="w-4 h-4" /> Link Folder
      </Button>
    </div>

    <div
      className="rounded-[var(--radius-card)] border border-dashed p-12 text-center"
      style={{ borderColor: 'var(--border-strong)', backgroundColor: 'var(--bg-surface)' }}
    >
      <FolderGit2 className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: 'var(--text-muted)' }} />
      <h4 className="text-base font-semibold text-[var(--text-primary)] mb-1">No workspaces linked</h4>
      <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto mb-6">
        Link a local folder to sync files directly to your computer. Requires the desktop agent.
      </p>
      <Button
        variant="outline"
        className="rounded-[var(--radius-button)] border-[var(--border-subtle)] text-[var(--text-secondary)]"
      >
        Download Desktop Agent
      </Button>
    </div>
  </div>
);

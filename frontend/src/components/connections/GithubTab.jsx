import React from 'react';
import { Github, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const GithubTab = () => (
  <div className="space-y-6 fade-in">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-bold text-[var(--text-primary)]">GitHub Repositories</h3>
        <p className="text-sm text-[var(--text-muted)]">Link your project to a GitHub repo to push commits directly.</p>
      </div>
      <Button
        className="gap-2 text-white rounded-[var(--radius-button)]"
        style={{ backgroundColor: '#24292F' }}
      >
        <Plus className="w-4 h-4" /> Link Repo
      </Button>
    </div>

    <div
      className="rounded-[var(--radius-card)] border border-dashed p-12 text-center"
      style={{ borderColor: 'var(--border-strong)', backgroundColor: 'var(--bg-surface)' }}
    >
      <Github className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: 'var(--text-muted)' }} />
      <h4 className="text-base font-semibold text-[var(--text-primary)] mb-1">No repositories linked</h4>
      <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto mb-6">
        Connect your GitHub account to enable automatic PR creation and commit tracking.
      </p>
      <Button
        variant="outline"
        className="rounded-[var(--radius-button)] border-[var(--border-subtle)] text-[var(--text-secondary)] gap-2"
      >
        <Github className="w-4 h-4" /> Connect GitHub
      </Button>
    </div>
  </div>
);

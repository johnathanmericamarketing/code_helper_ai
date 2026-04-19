import React from 'react';
import { Github, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const GithubTab = () => {
  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-primary-custom">GitHub Repositories</h3>
          <p className="text-sm text-muted-custom">Link your project to a GitHub repo to push commits directly.</p>
        </div>
        <Button className="gap-2 bg-[#24292F] hover:bg-[#24292F]/90 text-white shadow-sm rounded-[var(--radius-button)]">
          <Plus className="w-4 h-4" /> Link Repo
        </Button>
      </div>

      <div className="bg-surface border border-dashed border-strong rounded-[var(--radius-card)] p-12 text-center">
        <Github className="w-12 h-12 text-muted-custom mx-auto mb-4 opacity-50" />
        <h4 className="text-base font-semibold text-primary-custom mb-1">No repositories linked</h4>
        <p className="text-sm text-secondary-custom max-w-sm mx-auto mb-6">
          Connect your GitHub account to enable automatic PR creation and commit tracking.
        </p>
        <Button variant="outline" className="border-subtle rounded-[var(--radius-button)]">
          <Github className="w-4 h-4 mr-2" /> Connect GitHub
        </Button>
      </div>
    </div>
  );
};

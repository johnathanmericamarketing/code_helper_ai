import React from 'react';
import { Server, Plus, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HostingTab = () => {
  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-primary-custom">Hosting Servers</h3>
          <p className="text-sm text-muted-custom">Connect via SFTP, SSH, or FTP to deploy your code directly.</p>
        </div>
        <Button className="gap-2 bg-[var(--accent-600)] hover:bg-[var(--accent-700)] text-white shadow-sm rounded-[var(--radius-button)]">
          <Plus className="w-4 h-4" /> Add Server
        </Button>
      </div>

      <div className="bg-surface border border-dashed border-strong rounded-[var(--radius-card)] p-12 text-center">
        <Server className="w-12 h-12 text-muted-custom mx-auto mb-4 opacity-50" />
        <h4 className="text-base font-semibold text-primary-custom mb-1">No servers connected</h4>
        <p className="text-sm text-secondary-custom max-w-sm mx-auto mb-6">
          Add your first hosting server to enable one-click publishing from the Studio.
        </p>
        <Button variant="outline" className="border-subtle rounded-[var(--radius-button)]">
          <Globe className="w-4 h-4 mr-2" /> Connect Hosting
        </Button>
      </div>
    </div>
  );
};

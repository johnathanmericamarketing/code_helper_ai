import React from 'react';
import { Server, Plus, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HostingTab = () => (
  <div className="space-y-6 fade-in">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-bold text-[var(--text-primary)]">Hosting Servers</h3>
        <p className="text-sm text-[var(--text-muted)]">Connect via SFTP, SSH, or FTP to deploy your code directly.</p>
      </div>
      <Button
        className="gap-2 text-white rounded-[var(--radius-button)]"
        style={{ backgroundColor: 'var(--accent-600)' }}
      >
        <Plus className="w-4 h-4" /> Add Server
      </Button>
    </div>

    <div
      className="rounded-[var(--radius-card)] border border-dashed p-12 text-center"
      style={{ borderColor: 'var(--border-strong)', backgroundColor: 'var(--bg-surface)' }}
    >
      <Server className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: 'var(--text-muted)' }} />
      <h4 className="text-base font-semibold text-[var(--text-primary)] mb-1">No servers connected</h4>
      <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto mb-6">
        Add your first hosting server to enable one-click publishing from the Studio.
      </p>
      <Button
        variant="outline"
        className="rounded-[var(--radius-button)] border-[var(--border-subtle)] text-[var(--text-secondary)] gap-2"
      >
        <Globe className="w-4 h-4" /> Connect Hosting
      </Button>
    </div>
  </div>
);

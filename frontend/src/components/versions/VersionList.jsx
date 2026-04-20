import React from 'react';
import { VersionCard } from './VersionCard';
import { GitBranch } from 'lucide-react';

export const VersionList = ({ versions, onCompare, onRestore }) => {
  if (!versions?.length) {
    return (
      <div
        className="rounded-[var(--radius-card)] border border-dashed p-14 text-center"
        style={{ borderColor: 'var(--border-strong)', backgroundColor: 'var(--bg-surface)' }}
      >
        <GitBranch className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: 'var(--text-muted)' }} />
        <p className="text-sm text-[var(--text-muted)]">No versions saved yet for this project.</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {versions.map(v => (
        <VersionCard
          key={v.id}
          version={v}
          onCompare={onCompare}
          onRestore={onRestore}
        />
      ))}
    </div>
  );
};

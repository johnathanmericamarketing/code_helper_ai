import React from 'react';
import { VersionCard } from './VersionCard';

export const VersionList = ({ versions, onCompare, onRestore }) => {
  if (!versions || versions.length === 0) {
    return (
      <div className="text-center py-12 bg-surface border border-dashed border-strong rounded-[var(--radius-card)]">
        <p className="text-muted-custom">No versions found for this project yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {versions.map(version => (
        <VersionCard 
          key={version.id} 
          version={version} 
          onCompare={onCompare}
          onRestore={onRestore}
        />
      ))}
    </div>
  );
};

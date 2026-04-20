import React from 'react';
import { RotateCcw, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

const TYPE_BADGE = {
  published: { label: 'Published', cls: 'bg-[var(--success-bg)] text-[var(--success-text)]' },
  draft:     { label: 'Draft',     cls: 'bg-[var(--warning-bg)] text-[var(--warning-text)]' },
};

export const VersionCard = ({ version, onCompare, onRestore }) => {
  const badge = TYPE_BADGE[version.type] ?? TYPE_BADGE.draft;

  const timeAgo = version.createdAt?.toDate
    ? formatDistanceToNow(version.createdAt.toDate(), { addSuffix: true })
    : version.createdAt
      ? formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })
      : '—';

  return (
    <div
      className="rounded-[var(--radius-card)] border p-5 flex flex-col sm:flex-row sm:items-start gap-4 transition-all hover:border-[var(--accent-500)]"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
    >
      {/* Left */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${badge.cls}`}>
            {badge.label}
          </span>
          <span className="text-xs text-[var(--text-muted)]">{timeAgo}</span>
          {version.model && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-mono"
              style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-muted)' }}
            >
              {version.model}
            </span>
          )}
        </div>
        <p className="text-sm text-[var(--text-primary)] font-medium line-clamp-2 leading-relaxed">
          {version.prompt || version.raw_request || 'No prompt recorded'}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCompare?.(version)}
          className="gap-1.5 rounded-[var(--radius-button)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-500)] hover:text-[var(--accent-500)]"
        >
          <GitCompare className="w-3.5 h-3.5" /> Compare
        </Button>
        <Button
          size="sm"
          onClick={() => onRestore?.(version)}
          className="gap-1.5 rounded-[var(--radius-button)] text-white"
          style={{ backgroundColor: 'var(--accent-600)' }}
        >
          <RotateCcw className="w-3.5 h-3.5" /> Restore
        </Button>
      </div>
    </div>
  );
};

import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const VersionFilters = ({ onSearch }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: 'var(--text-muted)' }}
        />
        <Input
          onChange={e => onSearch?.(e.target.value)}
          placeholder="Search versions or prompts…"
          className="pl-9 rounded-[var(--radius-button)] border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
        />
      </div>
      <Button
        variant="outline"
        className="gap-2 rounded-[var(--radius-button)] border-[var(--border-subtle)] text-[var(--text-secondary)]"
      >
        <Filter className="w-4 h-4" /> All Types
      </Button>
    </div>
  );
};

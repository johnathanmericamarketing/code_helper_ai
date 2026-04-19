import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const VersionFilters = ({ onSearch, onFilterChange }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-custom" />
        <Input 
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search versions or prompts..." 
          className="pl-9 border-subtle rounded-[var(--radius-button)] bg-surface"
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="border-subtle rounded-[var(--radius-button)] text-secondary-custom gap-2">
          <Filter className="w-4 h-4" /> All Types
        </Button>
      </div>
    </div>
  );
};

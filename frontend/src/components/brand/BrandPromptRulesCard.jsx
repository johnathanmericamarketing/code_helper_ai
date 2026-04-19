import React from 'react';
import { TerminalSquare, Sparkles } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const BrandPromptRulesCard = ({ brand, onChange }) => {
  return (
    <div className="bg-[var(--accent-50)] border border-[var(--accent-200)] rounded-[var(--radius-card)] p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <TerminalSquare className="w-5 h-5 text-[var(--accent-700)]" />
        <h2 className="font-bold text-[var(--accent-700)] text-lg">System Prompt Rules</h2>
      </div>
      
      <p className="text-sm text-muted-custom mb-6">
        These rules are injected into every AI request to ensure outputs stay consistent with your specific coding style and framework choices.
      </p>

      <div className="space-y-3">
        <Label className="text-sm font-semibold text-primary-custom flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-muted-custom" /> Custom AI Instructions
        </Label>
        <Textarea 
          value={brand?.aiInstructions || ''}
          onChange={(e) => onChange({ ...brand, aiInstructions: e.target.value })}
          placeholder="e.g. Always use Tailwind CSS for styling. Prefer functional components. Do not use external libraries unless specified."
          className="bg-surface border-subtle rounded-[var(--radius-button)] min-h-[160px] resize-none focus-visible:ring-[var(--accent-500)]"
        />
      </div>
    </div>
  );
};

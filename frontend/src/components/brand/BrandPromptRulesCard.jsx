import React from 'react';
import { TerminalSquare, Sparkles } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const BrandPromptRulesCard = ({ brand, onChange }) => {
  return (
    <div
      className="rounded-[var(--radius-card)] border p-6"
      style={{
        backgroundColor: 'rgba(139,92,246,0.06)',
        borderColor: 'rgba(139,92,246,0.2)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <TerminalSquare className="w-5 h-5" style={{ color: 'var(--accent-500)' }} />
        <h2 className="font-bold text-[var(--accent-500)] text-lg">System Prompt Rules</h2>
      </div>

      <p className="text-sm text-[var(--text-muted)] mb-5 leading-relaxed">
        These rules are injected into every AI request to keep outputs consistent with your coding style and framework choices.
      </p>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--text-muted)]" /> Custom AI Instructions
        </Label>
        <Textarea
          value={brand?.aiInstructions || ''}
          onChange={e => onChange({ ...brand, aiInstructions: e.target.value })}
          placeholder="e.g. Always use Tailwind CSS. Prefer functional React components. Never add external libraries unless specified."
          className="min-h-[160px] resize-none bg-[var(--bg-surface)] border-[var(--border-subtle)] rounded-[var(--radius-button)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          style={{ caretColor: 'var(--accent-500)' }}
        />
      </div>
    </div>
  );
};

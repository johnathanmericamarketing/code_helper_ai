import React from 'react';
import { MessageSquare, LayoutTemplate } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const BrandRulesCard = ({ brand, onChange }) => {
  return (
    <div
      className="rounded-[var(--radius-card)] border p-6"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex items-center gap-2 mb-6 pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <MessageSquare className="w-5 h-5" style={{ color: 'var(--accent-500)' }} />
        <h2 className="font-bold text-[var(--text-primary)] text-lg">Voice & Rules</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[var(--text-primary)]">Tone of Voice</Label>
          <Textarea
            value={brand?.voice || ''}
            onChange={e => onChange({ ...brand, voice: e.target.value })}
            placeholder="e.g. Professional but approachable. Avoid jargon. Speak directly to non-technical business owners."
            className="border-[var(--border-subtle)] rounded-[var(--radius-button)] min-h-[100px] resize-none bg-[var(--bg-app)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          />
        </div>

        <div className="space-y-2 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <Label className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4 text-[var(--text-muted)]" /> Component Preferences
          </Label>
          <Textarea
            value={brand?.preferences || ''}
            onChange={e => onChange({ ...brand, preferences: e.target.value })}
            placeholder="e.g. Always use rounded buttons. Cards should have soft shadows. Avoid heavy gradients."
            className="border-[var(--border-subtle)] rounded-[var(--radius-button)] min-h-[100px] resize-none bg-[var(--bg-app)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          />
        </div>
      </div>
    </div>
  );
};

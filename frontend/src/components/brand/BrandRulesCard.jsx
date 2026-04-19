import React from 'react';
import { MessageSquare, LayoutTemplate } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const BrandRulesCard = ({ brand, onChange }) => {
  return (
    <div className="bg-surface border border-subtle rounded-[var(--radius-card)] p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6 border-b border-subtle pb-4">
        <MessageSquare className="w-5 h-5 text-[var(--accent-600)]" />
        <h2 className="font-bold text-primary-custom text-lg">Voice & Rules</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-primary-custom flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-muted-custom" /> Tone of Voice
          </Label>
          <Textarea 
            value={brand?.tone || ''}
            onChange={(e) => onChange({ ...brand, tone: e.target.value })}
            placeholder="e.g. Professional but approachable. Avoid jargon."
            className="border-subtle rounded-[var(--radius-button)] min-h-[100px] resize-none"
          />
        </div>

        <div className="space-y-3 pt-4 border-t border-subtle">
          <Label className="text-sm font-semibold text-primary-custom flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4 text-muted-custom" /> Component Preferences
          </Label>
          <Textarea 
            value={brand?.preferences || ''}
            onChange={(e) => onChange({ ...brand, preferences: e.target.value })}
            placeholder="e.g. Always use rounded buttons. Cards should have soft shadows."
            className="border-subtle rounded-[var(--radius-button)] min-h-[100px] resize-none"
          />
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Palette, Type } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export const BrandIdentityCard = ({ brand, onChange }) => {
  return (
    <div
      className="rounded-[var(--radius-card)] border p-6"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex items-center gap-2 mb-6 pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <Palette className="w-5 h-5" style={{ color: 'var(--accent-500)' }} />
        <h2 className="font-bold text-[var(--text-primary)] text-lg">Identity & Visuals</h2>
      </div>

      <div className="space-y-6">
        {/* Colors */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Palette className="w-4 h-4 text-[var(--text-muted)]" /> Brand Colors (Hex)
          </Label>
          <div className="flex gap-3">
            {[
              { key: 'primaryColor',   placeholder: '#7c3aed', label: 'Primary'   },
              { key: 'secondaryColor', placeholder: '#0f172a', label: 'Secondary' },
              { key: 'accentColor',    placeholder: '#8b5cf6', label: 'Accent'    },
            ].map(({ key, placeholder, label }) => {
              const value = brand?.[key] || '';
              return (
                <div key={key} className="flex-1 relative">
                  <div
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border"
                    style={{
                      backgroundColor: value || placeholder,
                      borderColor: 'var(--border-strong)',
                    }}
                  />
                  <Input
                    value={value}
                    onChange={e => onChange({ ...brand, [key]: e.target.value })}
                    placeholder={placeholder}
                    title={label}
                    className="pl-8 border-[var(--border-subtle)] rounded-[var(--radius-button)] bg-[var(--bg-app)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Typography */}
        <div className="space-y-3 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <Label className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Type className="w-4 h-4 text-[var(--text-muted)]" /> Typography
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-[var(--text-muted)] font-medium">Headings Font</span>
              <Input
                value={brand?.headingFont || ''}
                onChange={e => onChange({ ...brand, headingFont: e.target.value })}
                placeholder="e.g. Space Grotesk"
                className="border-[var(--border-subtle)] rounded-[var(--radius-button)] bg-[var(--bg-app)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs text-[var(--text-muted)] font-medium">Body Font</span>
              <Input
                value={brand?.bodyFont || ''}
                onChange={e => onChange({ ...brand, bodyFont: e.target.value })}
                placeholder="e.g. Inter"
                className="border-[var(--border-subtle)] rounded-[var(--radius-button)] bg-[var(--bg-app)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

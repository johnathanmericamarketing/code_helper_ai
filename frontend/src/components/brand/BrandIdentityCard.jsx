import React from 'react';
import { Palette, Type } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export const BrandIdentityCard = ({ brand, onChange }) => {
  return (
    <div className="bg-surface border border-subtle rounded-[var(--radius-card)] p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6 border-b border-subtle pb-4">
        <Palette className="w-5 h-5 text-[var(--accent-600)]" />
        <h2 className="font-bold text-primary-custom text-lg">Identity & Visuals</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-primary-custom flex items-center gap-2">
            <Palette className="w-4 h-4 text-muted-custom" /> Primary Colors (Hex)
          </Label>
          <div className="flex gap-3">
            {[1, 2, 3].map((idx) => {
              const color = brand?.colors?.[idx - 1] || '';
              return (
                <div key={idx} className="flex-1 relative">
                  <div 
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-subtle"
                    style={{ backgroundColor: color || '#f1f5f9' }}
                  />
                  <Input 
                    value={color}
                    onChange={(e) => {
                      const newColors = [...(brand?.colors || [])];
                      newColors[idx - 1] = e.target.value;
                      onChange({ ...brand, colors: newColors });
                    }}
                    placeholder="#000000"
                    className="pl-8 border-subtle rounded-[var(--radius-button)]"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-subtle">
          <Label className="text-sm font-semibold text-primary-custom flex items-center gap-2">
            <Type className="w-4 h-4 text-muted-custom" /> Typography
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-muted-custom font-medium">Headings Font</span>
              <Input 
                value={brand?.typography?.headings || ''}
                onChange={(e) => onChange({ 
                  ...brand, 
                  typography: { ...brand?.typography, headings: e.target.value } 
                })}
                placeholder="e.g. Inter"
                className="border-subtle rounded-[var(--radius-button)]"
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-custom font-medium">Body Font</span>
              <Input 
                value={brand?.typography?.body || ''}
                onChange={(e) => onChange({ 
                  ...brand, 
                  typography: { ...brand?.typography, body: e.target.value } 
                })}
                placeholder="e.g. Roboto"
                className="border-subtle rounded-[var(--radius-button)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

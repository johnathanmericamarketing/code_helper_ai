import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { HexColorPicker } from 'react-colorful';
import { Palette, Save, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { projectService } from '@/lib/project-service';

const DEFAULT_BRAND = {
  brandName: '',
  tagline: '',
  primaryColor:   '#3b82f6',
  secondaryColor: '#0f172a',
  accentColor:    '#f59e0b',
  headingFont: '',
  bodyFont: '',
  voice: '',
  dos: '',
  donts: '',
  logoUrl: '',
  extraNotes: '',
};

const ColorField = ({ label, value, onChange }) => (
  <div className="space-y-1">
    <Label className="text-xs">{label}</Label>
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 w-full border border-border rounded-md px-2 py-1.5 hover:bg-muted/40 text-left"
        >
          <span
            className="w-5 h-5 rounded border border-border shrink-0"
            style={{ backgroundColor: value }}
          />
          <span className="text-xs font-mono text-foreground truncate">{value}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <HexColorPicker color={value} onChange={onChange} />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-3 font-mono text-xs h-8"
          maxLength={9}
        />
      </PopoverContent>
    </Popover>
  </div>
);

export const BrandKitCard = ({ project, onSaved }) => {
  const [brand, setBrand]   = useState({ ...DEFAULT_BRAND, ...(project?.brand || {}) });
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty]   = useState(false);

  useEffect(() => {
    setBrand({ ...DEFAULT_BRAND, ...(project?.brand || {}) });
    setDirty(false);
  }, [project?.id]);

  const update = (patch) => {
    setBrand((prev) => ({ ...prev, ...patch }));
    setDirty(true);
  };

  const handleSave = async () => {
    if (!project?.id) return;
    setSaving(true);
    try {
      await projectService.updateBrand(project.id, brand);
      toast.success('Brand kit saved — the AI will use it on every change.');
      setDirty(false);
      onSaved?.();
    } catch (e) {
      console.error(e);
      toast.error("Couldn't save brand kit. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const hasSaved = Boolean(project?.brand?.updatedAt);

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Palette className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Brand Kit
                {hasSaved && !dirty && (
                  <Badge variant="success" className="gap-1 text-[10px] font-normal">
                    <CheckCircle2 className="w-3 h-3"/> Saved
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Colors, fonts, and tone — applied to every AI-generated change on this site.
              </CardDescription>
            </div>
          </div>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!project || saving || !dirty}
            className="gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
            {saving ? 'Saving…' : dirty ? 'Save brand kit' : 'Saved'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Identity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs">Brand / business name</Label>
            <Input value={brand.brandName} onChange={(e) => update({ brandName: e.target.value })} placeholder="Acme Co." />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Tagline (optional)</Label>
            <Input value={brand.tagline} onChange={(e) => update({ tagline: e.target.value })} placeholder="Smarter tools, happier teams." />
          </div>
        </div>

        {/* Colors */}
        <div>
          <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-2">
            <Palette className="w-3.5 h-3.5"/> Colors
          </Label>
          <div className="grid grid-cols-3 gap-3">
            <ColorField label="Primary"   value={brand.primaryColor}   onChange={(v) => update({ primaryColor: v })}/>
            <ColorField label="Secondary" value={brand.secondaryColor} onChange={(v) => update({ secondaryColor: v })}/>
            <ColorField label="Accent"    value={brand.accentColor}    onChange={(v) => update({ accentColor: v })}/>
          </div>
        </div>

        {/* Fonts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs">Heading font</Label>
            <Input value={brand.headingFont} onChange={(e) => update({ headingFont: e.target.value })} placeholder="e.g. Inter, Poppins, Helvetica" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Body font</Label>
            <Input value={brand.bodyFont} onChange={(e) => update({ bodyFont: e.target.value })} placeholder="e.g. Inter, system-ui" />
          </div>
        </div>

        {/* Voice & tone */}
        <div className="space-y-1">
          <Label className="text-xs flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-primary"/> Voice &amp; tone
          </Label>
          <Textarea
            value={brand.voice}
            onChange={(e) => update({ voice: e.target.value })}
            placeholder="e.g. Friendly, confident, plain-English. Speak like a helpful coworker, not a corporate brochure."
            className="min-h-[70px]"
          />
        </div>

        {/* Dos / Don'ts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs">Do</Label>
            <Textarea
              value={brand.dos}
              onChange={(e) => update({ dos: e.target.value })}
              placeholder="e.g. Use short sentences. Mention our 30-day guarantee. Say &quot;team&quot; not &quot;staff&quot;."
              className="min-h-[70px]"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Don't</Label>
            <Textarea
              value={brand.donts}
              onChange={(e) => update({ donts: e.target.value })}
              placeholder="e.g. Avoid jargon, exclamation marks, all-caps headings, stock-photo clichés."
              className="min-h-[70px]"
            />
          </div>
        </div>

        {/* Logo + extras */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs">Logo URL (optional)</Label>
            <Input
              type="url"
              value={brand.logoUrl}
              onChange={(e) => update({ logoUrl: e.target.value })}
              placeholder="https://…/logo.svg"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Anything else?</Label>
            <Textarea
              value={brand.extraNotes}
              onChange={(e) => update({ extraNotes: e.target.value })}
              placeholder="Other rules the AI should follow — spacing, iconography, accessibility, etc."
              className="min-h-[70px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

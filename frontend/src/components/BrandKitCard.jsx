import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { HexColorPicker } from 'react-colorful';
import { Palette, Save, Loader2, CheckCircle2, Sparkles, AlertCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { projectService } from '@/lib/project-service';

const DEFAULT_BRAND = {
  brandName: '',
  tagline: '',
  primaryColor: '#3b82f6',
  secondaryColor: '#0f172a',
  accentColor: '#f59e0b',
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
          className="flex items-center gap-2 w-full border border-border rounded-md px-2 py-1.5 hover:bg-muted/40 text-left transition-colors"
        >
          <span
            className="w-5 h-5 rounded border border-border shrink-0 shadow-sm"
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
          placeholder="#000000"
        />
      </PopoverContent>
    </Popover>
  </div>
);

/** Live brand preview strip */
const BrandPreview = ({ brand }) => (
  <div
    className="border border-border rounded-xl overflow-hidden"
    style={{ fontFamily: brand.headingFont || undefined }}
  >
    <div
      className="px-5 py-4 flex items-center justify-between"
      style={{ backgroundColor: brand.primaryColor, color: '#fff' }}
    >
      {brand.logoUrl ? (
        <img src={brand.logoUrl} alt="Logo" className="h-7 object-contain max-w-[120px]" />
      ) : (
        <span className="font-bold text-sm">{brand.brandName || 'Your Brand'}</span>
      )}
      <span
        className="text-xs px-2 py-0.5 rounded-full font-medium"
        style={{ backgroundColor: brand.accentColor, color: '#fff' }}
      >
        {brand.tagline || 'Tagline'}
      </span>
    </div>
    <div
      className="px-5 py-4 space-y-1"
      style={{ backgroundColor: brand.secondaryColor || '#fff', fontFamily: brand.bodyFont || undefined }}
    >
      <p className="text-xs opacity-70" style={{ color: brand.secondaryColor === '#0f172a' ? '#fff' : '#374151' }}>
        {brand.voice ? `"${brand.voice.slice(0, 80)}…"` : 'Voice & tone preview will appear here.'}
      </p>
      <div className="flex gap-2 pt-1">
        <span className="w-4 h-4 rounded-full border border-white/30 shadow-inner" style={{ backgroundColor: brand.primaryColor }} />
        <span className="w-4 h-4 rounded-full border border-white/30 shadow-inner" style={{ backgroundColor: brand.secondaryColor }} />
        <span className="w-4 h-4 rounded-full border border-white/30 shadow-inner" style={{ backgroundColor: brand.accentColor }} />
      </div>
    </div>
  </div>
);

/**
 * BrandKitCard
 * Props:
 *   project  — the active project object (with .id and .brand fields)
 *   onSaved  — callback fired after a successful save
 *   prefill  — optional { primaryColor?, secondaryColor?, accentColor?, headingFont?, bodyFont? }
 *              Pre-fills fields from AI-detected brand values.
 */
export const BrandKitCard = ({ project, onSaved, prefill }) => {
  const [brand, setBrand] = useState({ ...DEFAULT_BRAND, ...(project?.brand || {}), ...(prefill || {}) });
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(Boolean(prefill && Object.keys(prefill).length > 0));
  const [showPreview, setShowPreview] = useState(false);

  // Re-sync when the project changes (e.g. user switches project)
  useEffect(() => {
    setBrand({ ...DEFAULT_BRAND, ...(project?.brand || {}), ...(prefill || {}) });
    setDirty(Boolean(prefill && Object.keys(prefill).length > 0));
  }, [project?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Merge in new prefill values without losing existing saved data
  useEffect(() => {
    if (prefill && Object.keys(prefill).length > 0) {
      setBrand((prev) => ({ ...prev, ...prefill }));
      setDirty(true);
    }
  }, [prefill]);

  const update = (patch) => {
    setBrand((prev) => ({ ...prev, ...patch }));
    setDirty(true);
  };

  const handleSave = async () => {
    if (!project?.id) {
      toast.error('No active project — please select a project first.');
      return;
    }
    setSaving(true);
    try {
      await projectService.updateBrand(project.id, brand);
      toast.success('Brand kit saved — the AI will use it on every change.', {
        description: 'All future generations will respect your colors, fonts, and tone.',
      });
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
  const isComplete = brand.brandName && brand.primaryColor && brand.voice;

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
              <Palette className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 flex-wrap">
                Brand Kit
                {hasSaved && !dirty && (
                  <Badge variant="success" className="gap-1 text-[10px] font-normal">
                    <CheckCircle2 className="w-3 h-3" /> Saved &amp; Active
                  </Badge>
                )}
                {dirty && (
                  <Badge variant="warning" className="gap-1 text-[10px] font-normal">
                    Unsaved changes
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Colors, fonts, and tone — applied to <strong>every AI-generated change</strong> on this project.
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview((v) => !v)}
              className="gap-1.5 text-xs h-8 text-muted-foreground"
            >
              <Eye className="w-3.5 h-3.5" />
              {showPreview ? 'Hide' : 'Preview'}
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!project || saving || !dirty}
              className="gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving…' : dirty ? 'Save Brand Kit' : 'Saved'}
            </Button>
          </div>
        </div>

        {/* Completion hint */}
        {!isComplete && (
          <div className="flex items-start gap-2 mt-2 text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2 border border-border">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-warning" />
            <span>Fill in <strong>Brand name</strong>, <strong>Primary color</strong>, and <strong>Voice &amp; tone</strong> for best AI results.</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Live preview */}
        {showPreview && (
          <>
            <BrandPreview brand={brand} />
            <Separator />
          </>
        )}

        {/* Identity */}
        <div>
          <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">Identity</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Brand / Business name *</Label>
              <Input
                value={brand.brandName}
                onChange={(e) => update({ brandName: e.target.value })}
                placeholder="Acme Co."
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Tagline (optional)</Label>
              <Input
                value={brand.tagline}
                onChange={(e) => update({ tagline: e.target.value })}
                placeholder="Smarter tools, happier teams."
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Colors */}
        <div>
          <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5" /> Colors *
          </p>
          <div className="grid grid-cols-3 gap-3">
            <ColorField label="Primary" value={brand.primaryColor} onChange={(v) => update({ primaryColor: v })} />
            <ColorField label="Secondary" value={brand.secondaryColor} onChange={(v) => update({ secondaryColor: v })} />
            <ColorField label="Accent" value={brand.accentColor} onChange={(v) => update({ accentColor: v })} />
          </div>
        </div>

        <Separator />

        {/* Fonts */}
        <div>
          <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">Typography</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Heading font</Label>
              <Input
                value={brand.headingFont}
                onChange={(e) => update({ headingFont: e.target.value })}
                placeholder="e.g. Inter, Poppins, Helvetica"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Body font</Label>
              <Input
                value={brand.bodyFont}
                onChange={(e) => update({ bodyFont: e.target.value })}
                placeholder="e.g. Inter, system-ui"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Voice & tone */}
        <div>
          <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-primary" /> Voice &amp; Tone *
          </p>
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
            <Label className="text-xs text-success font-semibold">✓ Do</Label>
            <Textarea
              value={brand.dos}
              onChange={(e) => update({ dos: e.target.value })}
              placeholder='e.g. Use short sentences. Mention our 30-day guarantee. Say "team" not "staff".'
              className="min-h-[80px]"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-destructive font-semibold">✗ Don't</Label>
            <Textarea
              value={brand.donts}
              onChange={(e) => update({ donts: e.target.value })}
              placeholder="e.g. Avoid jargon, exclamation marks, all-caps headings."
              className="min-h-[80px]"
            />
          </div>
        </div>

        <Separator />

        {/* Logo + extras */}
        <div>
          <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">Logo &amp; Extra Notes</p>
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
              <Label className="text-xs">Anything else the AI should know?</Label>
              <Textarea
                value={brand.extraNotes}
                onChange={(e) => update({ extraNotes: e.target.value })}
                placeholder="Spacing rules, iconography, accessibility requirements, etc."
                className="min-h-[70px]"
              />
            </div>
          </div>
        </div>

        {/* Bottom save bar */}
        {dirty && (
          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Unsaved changes.</strong> Save to apply your brand kit to future AI generations.
            </p>
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving}
              size="sm"
              className="gap-2 shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {saving ? 'Saving…' : 'Save Brand Kit'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

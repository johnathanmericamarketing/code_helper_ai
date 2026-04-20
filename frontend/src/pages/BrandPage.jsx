import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Loader2, Save, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { BrandIdentityCard }      from '@/components/brand/BrandIdentityCard';
import { BrandRulesCard }         from '@/components/brand/BrandRulesCard';
import { BrandPromptRulesCard }   from '@/components/brand/BrandPromptRulesCard';
import { BrandContentLibraryCard } from '@/components/brand/BrandContentLibraryCard';

import { useProject }     from '@/context/ProjectContext';
import { projectService } from '@/lib/project-service';

export const BrandPage = () => {
  const { activeProject, refreshActiveProject } = useProject();
  const [brand, setBrand]   = useState(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty]   = useState(false);

  // Hydrate from active project
  useEffect(() => {
    if (activeProject) {
      setBrand(activeProject.brand || {});
      setDirty(false);
    }
  }, [activeProject?.id]);

  const handleChange = (updated) => {
    setBrand(updated);
    setDirty(true);
  };

  const handleSave = async () => {
    if (!activeProject?.id) { toast.error('No project selected.'); return; }
    setSaving(true);
    try {
      await projectService.update(activeProject.id, { brand });
      await refreshActiveProject();
      setDirty(false);
      toast.success('Brand kit saved!');
    } catch (err) {
      console.error(err);
      toast.error('Could not save brand kit.');
    } finally {
      setSaving(false);
    }
  };

  if (!activeProject) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--text-muted)] fade-in">
        <p>Please select a project to manage its brand kit.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 fade-in pb-12">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <Palette className="w-7 h-7" style={{ color: 'var(--accent-500)' }} />
            Brand Kit
          </h1>
          <p className="text-[var(--text-muted)] text-sm mt-1 max-w-xl">
            Define your brand identity, voice, and AI instructions. These are injected into every generation.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving || !dirty}
          className="gap-2 rounded-[var(--radius-button)] text-white self-start sm:self-auto"
          style={{ backgroundColor: dirty ? 'var(--accent-600)' : 'var(--bg-muted)' }}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving…' : dirty ? 'Save Changes' : 'Saved'}
        </Button>
      </div>

      {/* Cards */}
      {brand !== null && (
        <div className="grid gap-6">
          <BrandIdentityCard    brand={brand} onChange={handleChange} />
          <BrandRulesCard       brand={brand} onChange={handleChange} />
          <BrandPromptRulesCard brand={brand} onChange={handleChange} />
          <BrandContentLibraryCard brand={brand} onChange={handleChange} />
        </div>
      )}
    </div>
  );
};

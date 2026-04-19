import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save, BookOpen } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { projectService } from '@/lib/project-service';
import { toast } from 'sonner';

import { BrandIdentityCard } from '@/components/brand/BrandIdentityCard';
import { BrandRulesCard } from '@/components/brand/BrandRulesCard';
import { BrandPromptRulesCard } from '@/components/brand/BrandPromptRulesCard';

export const BrandPage = () => {
  const { activeProject, refreshActiveProject } = useProject();
  const [brand, setBrand] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (activeProject) {
      setBrand(activeProject.brand || { colors: [], typography: {}, tone: '', preferences: '', aiInstructions: '' });
    }
  }, [activeProject]);

  const handleSave = async () => {
    if (!activeProject) return;
    setSaving(true);
    try {
      await projectService.update(activeProject.id, { brand });
      await refreshActiveProject();
      toast.success('Brand rules saved successfully');
    } catch (e) {
      console.error(e);
      toast.error('Failed to save brand rules');
    } finally {
      setSaving(false);
    }
  };

  if (!activeProject) {
    return (
      <div className="flex items-center justify-center h-full text-muted-custom fade-in">
        <p>Please select a project first to manage its brand.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 fade-in pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary-custom tracking-tight">Brand</h1>
          <p className="text-muted-custom text-sm md:text-base mt-1 max-w-xl">
            Save colors, fonts, voice, and rules so every AI change stays consistent.
          </p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="gap-2 bg-[var(--accent-600)] hover:bg-[var(--accent-700)] text-white shadow-sm rounded-[var(--radius-button)]"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : 'Save brand rules'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Visuals & Rules */}
        <div className="lg:col-span-2 space-y-6">
          <BrandIdentityCard brand={brand} onChange={setBrand} />
          <BrandRulesCard brand={brand} onChange={setBrand} />
        </div>

        {/* Right Column - Prompt Instructions */}
        <div className="space-y-6">
          <BrandPromptRulesCard brand={brand} onChange={setBrand} />
          
          {/* Subtle suggestions/info card */}
          <div className="bg-surface border border-subtle rounded-[var(--radius-card)] p-5">
            <div className="flex gap-3">
              <div className="mt-0.5">
                <BookOpen className="w-4 h-4 text-[var(--accent-500)]" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-primary-custom">Brand Suggestions</h3>
                <p className="text-xs text-muted-custom mt-1 leading-relaxed">
                  The AI uses these rules automatically during generation. Be as specific as possible in your System Prompt Rules to prevent drifting from your core architecture.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

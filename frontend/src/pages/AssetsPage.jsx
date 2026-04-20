import React, { useState } from 'react';
import { toast } from 'sonner';
import { ImagePlus } from 'lucide-react';

import { AssetPromptCard }    from '@/components/assets/AssetPromptCard';
import { AssetUrlImportCard } from '@/components/assets/AssetUrlImportCard';
import { AssetResultsGrid }   from '@/components/assets/AssetResultsGrid';

import { generateImage }   from '@/lib/media-service';
import { useProject }      from '@/context/ProjectContext';
import { projectService }  from '@/lib/project-service';

export const AssetsPage = () => {
  const { activeProject, refreshActiveProject } = useProject();
  const [prompt, setPrompt]           = useState('');
  const [loading, setLoading]         = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [result, setResult]           = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) { toast.error('Please enter an image description.'); return; }
    setLoading(true);
    setResult(null);
    try {
      const data = await generateImage(prompt);
      setResult(data);
      toast.success('Image generated!');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to generate image. Check your Gemini API key in Settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleImportUrl = async (url) => {
    if (!activeProject) { toast.error('Please select a project first.'); return; }
    setImportLoading(true);
    try {
      const current = activeProject.external_assets || [];
      if (current.includes(url)) { toast.info('URL already in assets.'); return; }
      await projectService.update(activeProject.id, { external_assets: [url, ...current] });
      await refreshActiveProject();
      toast.success('Asset URL imported!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to import asset URL.');
    } finally {
      setImportLoading(false);
    }
  };

  if (!activeProject) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--text-muted)] fade-in">
        <p>Please select a project to manage assets.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 fade-in pb-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <ImagePlus className="w-7 h-7" style={{ color: 'var(--accent-500)' }} />
            Assets
          </h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            Generate images with Imagen 3 and push them directly into Studio.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <div>
          <AssetPromptCard
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={handleGenerate}
            loading={loading}
          />
          <AssetUrlImportCard
            onImport={handleImportUrl}
            loading={importLoading}
          />
        </div>

        <AssetResultsGrid
          result={result}
          loading={loading}
          prompt={prompt}
          externalAssets={activeProject.external_assets || []}
        />
      </div>
    </div>
  );
};

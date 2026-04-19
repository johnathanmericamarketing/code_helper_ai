import React, { useState } from 'react';
import { toast } from 'sonner';
import { generateImage } from '@/lib/media-service';
import { useProject } from '@/context/ProjectContext';
import { projectService } from '@/lib/project-service';

import { AssetPromptCard } from '@/components/assets/AssetPromptCard';
import { AssetUrlImportCard } from '@/components/assets/AssetUrlImportCard';
import { AssetResultsGrid } from '@/components/assets/AssetResultsGrid';

export const AssetsPage = () => {
  const { activeProject, refreshActiveProject } = useProject();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter an image description.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await generateImage(prompt);
      setResult(data);
      toast.success('Image generated successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to generate image. Ensure you have an active Gemini key set in Settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleImportUrl = async (url) => {
    if (!activeProject) return toast.error('Please select a project first.');
    setImportLoading(true);
    try {
      const currentAssets = activeProject.external_assets || [];
      // avoid duplicates
      if (currentAssets.includes(url)) {
        toast.info('This URL is already in your assets.');
        setImportLoading(false);
        return;
      }
      const newAssets = [url, ...currentAssets];
      await projectService.update(activeProject.id, { external_assets: newAssets });
      await refreshActiveProject();
      toast.success('Asset URL imported successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to import asset URL.');
    } finally {
      setImportLoading(false);
    }
  };

  if (!activeProject) {
    return (
      <div className="flex items-center justify-center h-full text-muted-custom fade-in">
        <p>Please select a project first to manage assets.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 fade-in pb-12">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary-custom tracking-tight">Assets</h1>
          <p className="text-muted-custom text-sm md:text-base mt-1 max-w-xl">
            Generate high-quality images and push them directly into Studio.
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

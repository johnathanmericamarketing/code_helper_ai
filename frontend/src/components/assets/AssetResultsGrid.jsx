import React from 'react';
import { ImagePlus, Copy, Code, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AssetResultsGrid = ({ result, loading, prompt, externalAssets = [] }) => {
  const getDataUrl = () => {
    if (!result) return '';
    return `data:${result.mimeType};base64,${result.base64}`;
  };

  const handleCopyBase64 = () => {
    if (!result) return;
    navigator.clipboard.writeText(getDataUrl());
  };

  const handleCopyImgTag = () => {
    if (!result) return;
    const tag = `<img src="${getDataUrl()}" alt="${prompt.replace(/"/g, '&quot;')}" />`;
    navigator.clipboard.writeText(tag);
  };

  return (
    <div className="bg-surface border border-subtle rounded-[var(--radius-card)] flex flex-col h-full overflow-hidden shadow-sm">
      <div className="flex items-center justify-between p-6 border-b border-subtle">
        <div className="flex items-center gap-2">
          <ImagePlus className="w-5 h-5 text-primary-custom" />
          <h2 className="font-bold text-primary-custom text-lg">Project Assets</h2>
        </div>
      </div>

      <div className="flex-1 p-6 bg-[var(--bg-app)] relative flex items-center justify-center min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center text-muted-custom gap-4">
            <div className="w-10 h-10 border-4 border-[var(--accent-500)] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">Calling Google Imagen 3 API...</p>
          </div>
        ) : result ? (
          <img 
            src={getDataUrl()} 
            alt="Generated asset" 
            className="w-full h-full object-contain rounded-xl drop-shadow-md"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-custom gap-3 opacity-60">
            <ImagePlus className="w-12 h-12" />
            <p className="text-sm">No new image generated</p>
          </div>
        )}
      </div>

      {result && !loading && (
        <div className="p-4 border-t border-subtle bg-surface flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            className="flex-1 gap-2 border-subtle rounded-[var(--radius-button)] text-secondary-custom hover:text-primary-custom" 
            onClick={handleCopyBase64}
          >
            <Copy className="w-4 h-4" /> Copy Base64
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 gap-2 border-subtle rounded-[var(--radius-button)] text-secondary-custom hover:text-primary-custom" 
            onClick={handleCopyImgTag}
          >
            <Code className="w-4 h-4" /> Copy {'<img>'} Tag
          </Button>
          <Button 
            className="flex-1 gap-2 bg-[var(--accent-100)] text-[var(--accent-700)] hover:bg-[var(--accent-200)] rounded-[var(--radius-button)] border-none shadow-none"
          >
            Send to Studio <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {externalAssets.length > 0 && (
        <div className="p-6 border-t border-subtle bg-surface">
          <h3 className="text-sm font-bold text-secondary-custom uppercase tracking-wider mb-4">Imported Assets</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {externalAssets.map((url, i) => (
              <div key={i} className="group relative border border-subtle rounded-xl overflow-hidden aspect-video bg-[var(--bg-app)]">
                {/* Simple detection if it's an image or something else based on extension, otherwise default to img and let it break if it's a doc. We can refine later. */}
                <img src={url} alt={`Imported ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                <div className="absolute inset-0 items-center justify-center hidden bg-muted-custom p-2 text-center text-[10px] break-all text-secondary-custom">
                  {url}
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => navigator.clipboard.writeText(url)} title="Copy URL">
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

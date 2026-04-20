import React from 'react';
import { ImagePlus, Copy, Code, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const AssetResultsGrid = ({ result, loading, prompt, externalAssets = [] }) => {
  const getDataUrl = () => {
    if (!result) return '';
    return `data:${result.mimeType};base64,${result.base64}`;
  };

  const handleCopyBase64 = () => {
    navigator.clipboard.writeText(getDataUrl());
    toast.success('Base64 data URL copied!');
  };

  const handleCopyImgTag = () => {
    const tag = `<img src="${getDataUrl()}" alt="${prompt.replace(/"/g, '&quot;')}" />`;
    navigator.clipboard.writeText(tag);
    toast.success('<img> tag copied!');
  };

  return (
    <div
      className="rounded-[var(--radius-card)] border flex flex-col overflow-hidden"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <ImagePlus className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
        <h2 className="font-bold text-[var(--text-primary)] text-lg">Project Assets</h2>
      </div>

      {/* Preview area */}
      <div
        className="flex-1 p-6 flex items-center justify-center min-h-[300px] relative"
        style={{ backgroundColor: 'var(--bg-app)' }}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-4 text-[var(--text-muted)]">
            <div
              className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: 'var(--accent-500)', borderTopColor: 'transparent' }}
            />
            <p className="text-sm font-medium">Calling Google Imagen 3…</p>
          </div>
        ) : result ? (
          <img
            src={getDataUrl()}
            alt="Generated asset"
            className="w-full h-full object-contain rounded-xl drop-shadow-md"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 opacity-40 text-[var(--text-muted)]">
            <ImagePlus className="w-12 h-12" />
            <p className="text-sm">No image generated yet</p>
          </div>
        )}
      </div>

      {/* Action row for generated image */}
      {result && !loading && (
        <div className="p-4 border-t flex flex-wrap gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
          <Button
            variant="outline"
            className="flex-1 gap-2 rounded-[var(--radius-button)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            onClick={handleCopyBase64}
          >
            <Copy className="w-4 h-4" /> Copy Base64
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2 rounded-[var(--radius-button)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            onClick={handleCopyImgTag}
          >
            <Code className="w-4 h-4" /> Copy {'<img>'} Tag
          </Button>
          <Button
            className="flex-1 gap-2 rounded-[var(--radius-button)] text-[var(--accent-500)] border bg-transparent hover:bg-[var(--accent-50)]"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            Send to Studio <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Imported assets grid */}
      {externalAssets.length > 0 && (
        <div className="p-5 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-[var(--text-muted)]">Imported Assets</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {externalAssets.map((url, i) => (
              <div
                key={i}
                className="group relative rounded-xl overflow-hidden aspect-video"
                style={{ backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-subtle)' }}
              >
                <img
                  src={url}
                  alt={`Imported ${i}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
                <div className="absolute inset-0 items-center justify-center hidden p-2 text-center text-[10px] break-all text-[var(--text-muted)]">
                  {url}
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={() => { navigator.clipboard.writeText(url); toast.success('URL copied!'); }}
                    title="Copy URL"
                  >
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

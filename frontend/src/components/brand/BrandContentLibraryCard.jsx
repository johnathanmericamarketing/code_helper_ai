import React, { useState } from 'react';
import { Plus, Trash2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export const BrandContentLibraryCard = ({ brand, onChange }) => {
  const [url, setUrl] = useState('');
  const contentUrls = brand.content_urls || [];

  const handleAddUrl = () => {
    if (!url.trim()) return;
    try {
      new URL(url.trim());
      if (contentUrls.includes(url.trim())) {
        toast.info('This URL is already in your content library.');
        return;
      }
      onChange({ ...brand, content_urls: [...contentUrls, url.trim()] });
      setUrl('');
    } catch (e) {
      toast.error('Please enter a valid URL');
    }
  };

  const handleRemoveUrl = (targetUrl) => {
    onChange({ ...brand, content_urls: contentUrls.filter(u => u !== targetUrl) });
  };

  return (
    <div className="bg-surface border border-subtle rounded-[var(--radius-card)] p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4 border-b border-subtle pb-4">
        <Globe className="w-5 h-5 text-[var(--accent-600)]" />
        <h2 className="font-bold text-primary-custom text-lg">Content Library</h2>
      </div>

      <p className="text-sm text-secondary-custom mb-4">
        Paste links to Google Docs, Notion pages, or websites. The AI will reference these as context for your website's copy and data.
      </p>

      <div className="flex gap-2 mb-6">
        <Input
          placeholder="https://docs.google.com/document/d/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 text-xs border-subtle rounded-[var(--radius-button)]"
        />
        <Button 
          onClick={handleAddUrl}
          disabled={!url.trim()}
          size="sm"
          className="bg-[var(--accent-100)] text-[var(--accent-700)] hover:bg-[var(--accent-200)] rounded-[var(--radius-button)]"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {contentUrls.length === 0 ? (
          <div className="text-xs text-muted-custom italic p-3 border border-dashed border-subtle rounded-xl text-center">
            No external content links added yet.
          </div>
        ) : (
          contentUrls.map((u, i) => (
            <div key={i} className="flex items-center justify-between p-2 px-3 border border-subtle rounded-lg bg-[var(--bg-app)] group">
              <a href={u} target="_blank" rel="noreferrer" className="text-xs text-primary-custom truncate flex-1 hover:underline hover:text-[var(--accent-600)] mr-2" title={u}>
                {u}
              </a>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-muted-custom hover:text-[var(--danger-text)] hover:bg-[var(--danger-bg)] opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveUrl(u)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

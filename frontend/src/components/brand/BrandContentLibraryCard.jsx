import React, { useState } from 'react';
import { Plus, Trash2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export const BrandContentLibraryCard = ({ brand, onChange }) => {
  const [url, setUrl] = useState('');
  const contentUrls = brand?.content_urls || [];

  const handleAdd = () => {
    if (!url.trim()) return;
    try {
      new URL(url.trim());
      if (contentUrls.includes(url.trim())) {
        toast.info('This URL is already in your content library.');
        return;
      }
      onChange({ ...brand, content_urls: [...contentUrls, url.trim()] });
      setUrl('');
    } catch {
      toast.error('Please enter a valid URL.');
    }
  };

  const handleRemove = (target) => {
    onChange({ ...brand, content_urls: contentUrls.filter(u => u !== target) });
  };

  return (
    <div
      className="rounded-[var(--radius-card)] border p-6"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex items-center gap-2 mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <Globe className="w-5 h-5" style={{ color: 'var(--accent-500)' }} />
        <h2 className="font-bold text-[var(--text-primary)] text-lg">Content Library</h2>
      </div>

      <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
        Paste links to Google Docs, Notion pages, or websites. The AI will reference these as context for your website copy.
      </p>

      <div className="flex gap-2 mb-5">
        <Input
          placeholder="https://docs.google.com/document/d/…"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
          className="flex-1 text-xs border-[var(--border-subtle)] rounded-[var(--radius-button)] bg-[var(--bg-app)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
        />
        <Button
          onClick={handleAdd}
          disabled={!url.trim()}
          size="sm"
          className="rounded-[var(--radius-button)] text-[var(--accent-500)] border border-[var(--border-subtle)] hover:bg-[var(--accent-50)] bg-transparent"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {contentUrls.length === 0 ? (
          <div
            className="text-xs text-[var(--text-muted)] italic p-3 border border-dashed rounded-xl text-center"
            style={{ borderColor: 'var(--border-strong)' }}
          >
            No external content links added yet.
          </div>
        ) : (
          contentUrls.map((u, i) => (
            <div
              key={i}
              className="group flex items-center justify-between p-2 px-3 rounded-lg"
              style={{ backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-subtle)' }}
            >
              <a
                href={u}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[var(--text-primary)] truncate flex-1 mr-2 hover:underline"
                style={{ color: 'var(--accent-500)' }}
                title={u}
              >
                {u}
              </a>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: 'var(--danger-text)' }}
                onClick={() => handleRemove(u)}
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

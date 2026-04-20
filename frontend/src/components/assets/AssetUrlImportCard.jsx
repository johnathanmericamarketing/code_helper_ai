import React, { useState } from 'react';
import { Link2, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export const AssetUrlImportCard = ({ onImport, loading }) => {
  const [url, setUrl] = useState('');

  const handleImport = () => {
    if (!url.trim()) return;
    try {
      new URL(url.trim());
      onImport(url.trim());
      setUrl('');
    } catch {
      toast.error('Please enter a valid URL.');
    }
  };

  return (
    <div
      className="rounded-[var(--radius-card)] border p-6 mt-4"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex items-center gap-2 mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <Link2 className="w-5 h-5" style={{ color: 'var(--accent-500)' }} />
        <h2 className="font-bold text-[var(--text-primary)] text-lg">Import via URL</h2>
      </div>

      <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
        Paste a public direct URL from Google Drive, Dropbox, or a CDN to add it to your project assets.
      </p>

      <div className="flex gap-3">
        <Input
          placeholder="https://example.com/image.png"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleImport(); }}
          className="flex-1 border-[var(--border-subtle)] rounded-[var(--radius-button)] bg-[var(--bg-app)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
        />
        <Button
          onClick={handleImport}
          disabled={loading || !url.trim()}
          className="rounded-[var(--radius-button)] text-[var(--accent-500)] border bg-transparent hover:bg-[var(--accent-50)]"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />}
          Import
        </Button>
      </div>
    </div>
  );
};

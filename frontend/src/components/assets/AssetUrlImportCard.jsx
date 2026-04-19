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
    } catch (e) {
      toast.error('Please enter a valid URL');
    }
  };

  return (
    <div className="bg-surface border border-subtle rounded-[var(--radius-card)] p-6 shadow-sm mt-6">
      <div className="flex items-center gap-2 mb-4 border-b border-subtle pb-4">
        <Link2 className="w-5 h-5 text-[var(--accent-600)]" />
        <h2 className="font-bold text-primary-custom text-lg">Import via URL</h2>
      </div>

      <p className="text-sm text-secondary-custom mb-4">
        Have an image or video already hosted on Google Drive, Dropbox, or elsewhere? Paste the public direct URL here to add it to your project assets.
      </p>

      <div className="flex gap-3">
        <Input
          placeholder="https://example.com/image.png"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 border-subtle rounded-[var(--radius-button)]"
        />
        <Button 
          onClick={handleImport}
          disabled={loading || !url.trim()}
          className="bg-[var(--accent-100)] text-[var(--accent-700)] hover:bg-[var(--accent-200)] rounded-[var(--radius-button)]"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />}
          Import
        </Button>
      </div>
    </div>
  );
};

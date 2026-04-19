import React from 'react';
import { Sparkles, Loader2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export const AssetPromptCard = ({ prompt, setPrompt, onGenerate, loading }) => {
  return (
    <div className="bg-surface border border-subtle rounded-[var(--radius-card)] p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4 border-b border-subtle pb-4">
        <Wand2 className="w-5 h-5 text-[var(--accent-600)]" />
        <h2 className="font-bold text-primary-custom text-lg">Image Generation</h2>
      </div>

      <p className="text-sm text-secondary-custom mb-6">
        Provide a detailed description of the asset you want. Imagen 3 will create a gorgeous image and we will encode it as a Base64 string so you can perfectly inject it into your generated React components without hosting the image separately.
      </p>

      <div className="space-y-4">
        <Textarea
          placeholder="A sleek modern hero background with floating UI cards and data streams, dark mode..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[140px] resize-none border-subtle rounded-[var(--radius-button)] focus-visible:ring-[var(--accent-500)]"
        />
        
        <Button 
          className="w-full gap-2 bg-[var(--accent-600)] hover:bg-[var(--accent-700)] text-white shadow-md rounded-[var(--radius-button)]" 
          onClick={onGenerate}
          disabled={loading || !prompt.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Asset (takes ~5-10s)...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Image
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

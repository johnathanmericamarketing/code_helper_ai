import React from 'react';
import { Sparkles, Loader2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export const AssetPromptCard = ({ prompt, setPrompt, onGenerate, loading }) => (
  <div
    className="rounded-[var(--radius-card)] border p-6"
    style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
  >
    <div className="flex items-center gap-2 mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <Wand2 className="w-5 h-5" style={{ color: 'var(--accent-500)' }} />
      <h2 className="font-bold text-[var(--text-primary)] text-lg">Image Generation</h2>
    </div>

    <p className="text-sm text-[var(--text-secondary)] mb-5 leading-relaxed">
      Describe the asset you want. Google Imagen 3 will create a high-quality image encoded as Base64 — ready to inject into any component without a separate hosting step.
    </p>

    <div className="space-y-4">
      <Textarea
        placeholder="A sleek modern hero background with floating UI cards, dark mode, violet accent glow…"
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        className="min-h-[140px] resize-none border-[var(--border-subtle)] rounded-[var(--radius-button)] bg-[var(--bg-app)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
        style={{ caretColor: 'var(--accent-500)' }}
      />

      <Button
        className="w-full gap-2 text-white shadow-md rounded-[var(--radius-button)]"
        style={{ backgroundColor: 'var(--accent-600)' }}
        onClick={onGenerate}
        disabled={loading || !prompt.trim()}
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Generating (5–10 s)…</>
        ) : (
          <><Sparkles className="w-4 h-4" /> Generate Image</>
        )}
      </Button>
    </div>
  </div>
);

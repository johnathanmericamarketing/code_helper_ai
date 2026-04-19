import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Loader2, Lightbulb } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const StudioComposer = ({ 
  prompt, 
  setPrompt, 
  onGenerate, 
  isGenerating,
  model,
  setModel,
  onGetIdeas,
  ideasLoading
}) => {
  return (
    <div className="shrink-0 bg-surface border-t border-subtle p-4 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)] z-20">
      <div className="max-w-6xl mx-auto flex flex-col gap-3">
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-700)]">What changes do you want?</span>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onGetIdeas}
              disabled={ideasLoading}
              className="h-8 gap-1.5 text-xs rounded-[var(--radius-button)] border-subtle"
            >
              {ideasLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Lightbulb className="w-3.5 h-3.5 text-[var(--warning-text)]"/>}
              {ideasLoading ? 'Thinking…' : 'Get ideas'}
            </Button>
            
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-[160px] h-8 text-xs bg-muted-custom border-subtle rounded-[var(--radius-button)]">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="claude-opus-4-5">Claude Opus 4.5</SelectItem>
                <SelectItem value="claude-sonnet-4-5">Claude Sonnet 4.5</SelectItem>
                <SelectItem value="gemini-1.5-pro-latest">Gemini 1.5 Pro</SelectItem>
                <SelectItem value="gemini-1.5-flash-latest">Gemini 1.5 Flash</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="relative group">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to change — for example, 'make the header dark blue' or 'add a contact form in the footer'."
            className="resize-none min-h-[80px] pr-16 bg-[var(--bg-app)] border-strong rounded-[var(--radius-button)] focus-visible:ring-[var(--accent-500)] text-sm py-3"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onGenerate();
              }
            }}
          />
          <Button 
            size="icon"
            className="absolute right-3 bottom-3 h-10 w-10 shadow-md transition-transform rounded-xl bg-[var(--accent-600)] hover:bg-[var(--accent-700)] text-white"
            disabled={!prompt.trim() || isGenerating}
            onClick={onGenerate}
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
          </Button>
        </div>

      </div>
    </div>
  );
};

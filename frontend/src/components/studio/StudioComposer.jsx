import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Loader2, Lightbulb, X } from 'lucide-react';

/**
 * StudioComposer
 * The prompt input bar + model selector + idea chips inside Workspace Studio.
 * Shown when activeTab === 'build' or showPromptBar is true.
 */
export const StudioComposer = ({
  prompt,
  onPromptChange,
  model,
  onModelChange,
  onGenerate,
  onGetIdeas,
  onClose,
  isGenerating,
  ideasLoading,
  ideas,
  showIdeas,
  hasProject,
}) => {
  return (
    <div className="border-b border-border bg-card/80 px-5 py-3 shrink-0">

      {/* Prompt row */}
      <div className="flex items-center gap-3 max-w-4xl">

        {/* Textarea + send button */}
        <div className="relative flex-1">
          <Textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Describe your changes… e.g. 'Redesign the hero section with a bold heading'"
            className="resize-none min-h-[40px] max-h-[100px] pr-14 text-sm py-2.5 bg-card border-border rounded-xl"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onGenerate();
              }
            }}
          />
          <Button
            size="icon"
            className="absolute right-2 bottom-2 h-7 w-7 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            disabled={!prompt.trim() || isGenerating}
            onClick={onGenerate}
            aria-label="Send prompt"
          >
            {isGenerating
              ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
              : <Send className="w-3.5 h-3.5 text-white" />
            }
          </Button>
        </div>

        {/* Right-side controls */}
        <div className="flex gap-2 items-center">

          {/* Ideas button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onGetIdeas}
            disabled={ideasLoading || !hasProject}
            className="h-8 text-xs gap-1.5"
            aria-label="Get AI ideas"
          >
            {ideasLoading
              ? <Loader2 className="w-3 h-3 animate-spin" />
              : <Lightbulb className="w-3 h-3 text-yellow-500" />
            }
            Ideas
          </Button>

          {/* Model selector */}
          <Select value={model} onValueChange={onModelChange}>
            <SelectTrigger className="h-8 text-[11px] w-[140px] bg-card border-border" aria-label="Select AI model">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="claude-opus-4-5">Claude Opus 4.5</SelectItem>
              <SelectItem value="claude-sonnet-4-5">Claude Sonnet 4.5</SelectItem>
              <SelectItem value="gemini-1.5-pro-latest">Gemini 1.5 Pro</SelectItem>
              <SelectItem value="gemini-1.5-flash-latest">Gemini 1.5 Flash</SelectItem>
            </SelectContent>
          </Select>

          {/* Close / hide bar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-muted-foreground"
            aria-label="Close prompt bar"
          >
            <X className="w-4 h-4" />
          </Button>

        </div>
      </div>

      {/* Idea chips */}
      {showIdeas && ideas.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {ideas.map((idea, i) => (
            <button
              key={i}
              onClick={() => {
                onPromptChange(idea.prompt || idea.title);
              }}
              className="text-[11px] px-3 py-1 rounded-full border border-border bg-card hover:border-indigo-500/40 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-colors"
            >
              {idea.title}
            </button>
          ))}
        </div>
      )}

    </div>
  );
};

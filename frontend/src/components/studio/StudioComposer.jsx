import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Loader2, Lightbulb, Bookmark, BookmarkPlus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { getUserProfile, updateUserProfile } from '@/lib/user-service';

const PREMADE_PROMPTS = [
  { title: "Dark Mode", prompt: "Convert the entire page to a modern dark mode theme. Use slate-900 for background and slate-100 for text." },
  { title: "Mobile Responsive", prompt: "Ensure all grid layouts collapse to a single column on mobile, and increase tap target sizes for buttons." },
  { title: "Add Contact Form", prompt: "Add a contact form section at the bottom of the page with Name, Email, and Message fields." },
  { title: "Polish UI", prompt: "Make the UI look more premium by adding subtle box-shadows, rounding corners, and using a modern gradient background." }
];

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
  const [promptsOpen, setPromptsOpen] = useState(false);
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [isSavingPrompt, setIsSavingPrompt] = useState(false);

  useEffect(() => {
    getUserProfile().then(p => {
      if (p?.saved_prompts) setSavedPrompts(p.saved_prompts);
    }).catch(() => {});
  }, []);

  const handleSaveCurrentPrompt = async () => {
    if (!prompt.trim()) return toast.error('Prompt is empty');
    setIsSavingPrompt(true);
    try {
      const newSaved = [...savedPrompts, prompt.trim()];
      await updateUserProfile({ saved_prompts: newSaved });
      setSavedPrompts(newSaved);
      toast.success('Prompt saved to your library!');
    } catch (e) {
      toast.error('Failed to save prompt');
    } finally {
      setIsSavingPrompt(false);
    }
  };

  const handleSelectPrompt = (text) => {
    setPrompt(text);
    setPromptsOpen(false);
  };

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

            <Dialog open={promptsOpen} onOpenChange={setPromptsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs rounded-[var(--radius-button)] border-subtle">
                  <Bookmark className="w-3.5 h-3.5 text-[var(--accent-500)]" />
                  Prompts
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-surface border-subtle rounded-[var(--radius-card)] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-primary-custom">Prompt Library</DialogTitle>
                  <DialogDescription>Select a pre-made prompt or save your current one.</DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 mt-4">
                  {/* Pre-made Prompts */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-secondary-custom uppercase tracking-wider">Pre-made Prompts</h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {PREMADE_PROMPTS.map((p, i) => (
                        <div 
                          key={i} 
                          onClick={() => handleSelectPrompt(p.prompt)}
                          className="border border-subtle bg-muted-custom p-3 rounded-xl cursor-pointer hover:border-[var(--accent-500)] transition-colors group"
                        >
                          <h5 className="text-sm font-semibold text-primary-custom group-hover:text-[var(--accent-600)] mb-1">{p.title}</h5>
                          <p className="text-xs text-muted-custom line-clamp-2">{p.prompt}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Saved Prompts */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-secondary-custom uppercase tracking-wider">Your Saved Prompts</h4>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={handleSaveCurrentPrompt} 
                        disabled={isSavingPrompt || !prompt.trim()}
                        className="h-7 text-xs rounded-lg gap-1.5"
                      >
                        {isSavingPrompt ? <Loader2 className="w-3 h-3 animate-spin"/> : <BookmarkPlus className="w-3 h-3"/>}
                        Save current
                      </Button>
                    </div>
                    {savedPrompts.length === 0 ? (
                      <div className="text-xs text-muted-custom italic p-4 border border-dashed border-subtle rounded-xl text-center">
                        You haven't saved any custom prompts yet. Type something in the composer and click "Save current".
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {savedPrompts.map((text, i) => (
                          <div 
                            key={i} 
                            onClick={() => handleSelectPrompt(text)}
                            className="border border-subtle p-3 rounded-xl cursor-pointer hover:border-[var(--accent-500)] transition-colors text-sm text-primary-custom"
                          >
                            {text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
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

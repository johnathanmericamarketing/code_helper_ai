import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VisualInspector } from '@/components/VisualInspector';
import { LiveSitePreview } from '@/components/LiveSitePreview';
import { Sparkles, Send, Play, Loader2, Rocket, FileCode2, History, Eye, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { requestsService, generatedCodeService } from '@/lib/firebase-service';
import { useProject } from '@/context/ProjectContext';
import Editor from '@monaco-editor/react';

export const WorkspaceStudioPage = () => {
  const { activeProject } = useProject();
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('claude-sonnet-4-5');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // State for the three panes
  const [serverCode, setServerCode] = useState('// Connect to a repository to load active branch code here.\n\nfunction App() {\n  return <div>Hello World</div>;\n}');
  const [currentAppCode, setCurrentAppCode] = useState('<div><h1>Your App</h1><p>This represents the current state of your application UI.</p></div>');
  const [futureAppCode, setFutureAppCode] = useState(null);
  
  const [activeRequestId, setActiveRequestId] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || !activeProject) {
      if (!activeProject) toast.error("Please select a project first.");
      return;
    }
    setIsGenerating(true);
    setFutureAppCode(null);

    try {
      toast.info('Working on your changes…');
      
      // 1. Create a request footprint scoped to project
      const rawPayload = {
        raw_request: prompt,
        urgency: 'high',
        area_of_app: 'frontend'
      };
      const req = await requestsService.create(rawPayload, activeProject.id);
      setActiveRequestId(req.id);
      
      // 2. Process with dynamic model override
      const generated = await requestsService.process(req.id, prompt, currentAppCode, model);
      
      if (generated && generated.code_changes && generated.code_changes.length > 0) {
        // Find HTML/React changes suitable for the visual inspector, otherwise fallback to the first diff
        const uiChange = generated.code_changes.find(c => c.file_path.endsWith('.jsx') || c.file_path.endsWith('.html'));
        const diffToRender = uiChange ? uiChange.diff : generated.code_changes[0].diff;
        
        setFutureAppCode(diffToRender);
        toast.success('Your preview is ready — check it on the right!');
      } else {
        toast.error("We couldn't build a preview for this request. Try rewording it.");
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate changes. Check your API keys and quota.');
      setFutureAppCode('<!-- Error generating code -->');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePushCode = async () => {
    if (!activeRequestId || !futureAppCode) return;
    try {
      await requestsService.updateStatus(activeRequestId, 'approved');
      toast.success('Successfully pushed code to production!');
      // Move future code to current codebase state
      setCurrentAppCode(futureAppCode);
      setFutureAppCode(null);
      setPrompt('');
    } catch (e) {
      toast.error('Failed to push code.');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] bg-background overflow-hidden">
      
      {/* Top Main Workspace (3 columns) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-0 min-h-0 divide-x divide-border">
        
        {/* Column 1: Server Code */}
        <div className="flex flex-col h-full bg-[#1e1e1e]">
          <div className="h-10 border-b border-white/10 flex items-center px-4 bg-[#252526] text-white/70 text-xs font-semibold justify-between shrink-0">
            <span className="flex items-center gap-2 uppercase tracking-wider"><FileCode2 className="w-3.5 h-3.5"/> Your Code From Server</span>
            <Badge variant="outline" className="border-white/20 text-white/50 bg-transparent scale-90">Read Only</Badge>
          </div>
          <div className="flex-1 min-h-0 relative">
            <Editor
              height="100%"
              language="javascript"
              theme="vs-dark"
              value={serverCode}
              options={{ minimap: { enabled: false }, readOnly: true, fontSize: 12, wordWrap: 'on' }}
            />
          </div>
        </div>

        {/* Column 2: Your Site (live preview) */}
        <div className="flex flex-col h-full bg-card relative">
          <div className="h-10 border-b border-border flex items-center px-4 bg-muted/40 text-foreground/80 text-xs font-semibold shrink-0">
            <span className="flex items-center gap-2 uppercase tracking-wider"><Eye className="w-3.5 h-3.5 text-primary"/> Your Site Now</span>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden bg-background">
            <LiveSitePreview initialUrl={activeProject?.domain} title="Your Site" />
          </div>
        </div>

        {/* Column 3: Your Site With Changes */}
        <div className="flex flex-col h-full bg-muted/10 relative border-l border-border/50">
          <div className="h-10 border-b border-border flex items-center px-4 bg-muted/40 text-foreground/80 text-xs font-semibold shrink-0">
            <span className="flex items-center gap-2 uppercase tracking-wider"><Wand2 className="w-3.5 h-3.5 text-primary"/> Your Site With Changes</span>
          </div>
          <div className="flex-1 min-h-0 relative overflow-hidden bg-background">
            {isGenerating ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-10 gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-secondary-foreground font-medium animate-pulse">Building your changes…</p>
              </div>
            ) : futureAppCode ? (
              <VisualInspector htmlContent={futureAppCode} title="Your Site With Changes" isPreview />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-60 space-y-4 px-8 text-center">
                <Sparkles className="w-16 h-16 text-primary/40" />
                <p className="font-medium">Tell us what to change below.<br/>You'll see how your site will look here before you publish.</p>
              </div>
            )}
            
            {/* Push Button Container fixed at bottom of this pane */}
            {futureAppCode && !isGenerating && (
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <Button 
                  onClick={handlePushCode}
                  className="w-full shadow-2xl shadow-primary/30 h-12 text-lg gap-3 bg-gradient-to-r from-primary to-blue-600 hover:scale-[1.02] transition-transform"
                >
                  <Rocket className="w-5 h-5"/> Publish These Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar: AI Target Command */}
      <div className="shrink-0 border-t border-border bg-card p-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] relative z-30">
        <div className="max-w-5xl mx-auto flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">What changes do you want?</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Model Override:</span>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="w-[180px] h-8 text-xs bg-muted/40 border-border">
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
              className="resize-none min-h-[80px] pr-16 bg-muted/20 border-border focus-visible:ring-primary/50 text-base py-3"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
            <Button 
              size="icon"
              className="absolute right-3 bottom-3 h-10 w-10 shadow-md transition-transform group-focus-within:scale-105"
              disabled={!prompt.trim() || isGenerating}
              onClick={handleGenerate}
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

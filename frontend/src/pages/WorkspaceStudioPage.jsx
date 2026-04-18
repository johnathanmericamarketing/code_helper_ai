import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VisualInspector } from '@/components/VisualInspector';
import { LiveSitePreview } from '@/components/LiveSitePreview';
import { IntakeWizard } from '@/components/IntakeWizard';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Sparkles, Send, Play, Loader2, Rocket, FileCode2, History, Eye, Wand2, Trash2, Settings2, Lightbulb, X } from 'lucide-react';
import { toast } from 'sonner';
import { requestsService, generatedCodeService } from '@/lib/firebase-service';
import { projectService } from '@/lib/project-service';
import { useProject } from '@/context/ProjectContext';
import Editor from '@monaco-editor/react';

export const WorkspaceStudioPage = () => {
  const { activeProject, refreshActiveProject } = useProject();
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('claude-sonnet-4-5');
  const [isGenerating, setIsGenerating] = useState(false);

  // State for the three panes
  const [serverCode, setServerCode] = useState('// Connect to a repository to load active branch code here.\n\nfunction App() {\n  return <div>Hello World</div>;\n}');
  const [currentAppCode, setCurrentAppCode] = useState('<div><h1>Your App</h1><p>This represents the current state of your application UI.</p></div>');
  const [futureAppCode, setFutureAppCode] = useState(null);

  const [activeRequestId, setActiveRequestId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [ideas, setIdeas] = useState([]);
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [showIdeas, setShowIdeas] = useState(false);

  const handleGetIdeas = async () => {
    if (!activeProject) {
      toast.error('Please select a project first.');
      return;
    }
    setIdeasLoading(true);
    setShowIdeas(true);
    try {
      const intake = activeProject.intake || {};
      const log = Array.isArray(activeProject.changeLog) ? activeProject.changeLog.slice(-5) : [];
      const brand = activeProject.brand || {};
      const brandNotes = [
        brand.brandName   && `Brand: ${brand.brandName}`,
        brand.tagline     && `Tagline: ${brand.tagline}`,
        (brand.primaryColor || brand.secondaryColor || brand.accentColor) &&
          `Colors: ${brand.primaryColor || ''} / ${brand.secondaryColor || ''} / ${brand.accentColor || ''}`,
        (brand.headingFont || brand.bodyFont) && `Fonts: ${brand.headingFont || ''} / ${brand.bodyFont || ''}`,
        brand.voice && `Voice: ${brand.voice}`,
      ].filter(Boolean).join(' | ');
      const result = await requestsService.suggestIdeas({
        siteUrl: activeProject.domain || '',
        goals: intake.goals?.summary || '',
        siteNotes: [activeProject.siteNotes, brandNotes].filter(Boolean).join('\n'),
        recentChanges: log.map((e) => e.summary).filter(Boolean),
      });
      setIdeas(Array.isArray(result.ideas) ? result.ideas : []);
      if (result.mode === 'stub') {
        toast.info('Showing example ideas. Add your API key in Settings for AI-tailored suggestions.');
      }
    } catch (err) {
      console.error(err);
      toast.error("Couldn't load ideas. Try again in a moment.");
      setShowIdeas(false);
    } finally {
      setIdeasLoading(false);
    }
  };

  // Auto-open intake wizard the first time a user enters the Studio for a
  // project that hasn't completed intake yet.
  useEffect(() => {
    if (activeProject && !activeProject.intake?.completedAt) {
      setWizardOpen(true);
    }
  }, [activeProject?.id, activeProject?.intake?.completedAt]);

  // Build an AI context string from the saved intake + recent change log so
  // every generation run gets the project's notes without re-entering them.
  const buildProjectContext = () => {
    if (!activeProject) return currentAppCode;
    const parts = [`Current UI:\n${currentAppCode}`];
    const intake = activeProject.intake;
    if (intake?.goals?.summary) {
      parts.push(`Project goals (from intake):\n${intake.goals.summary}`);
      if (intake.goals.categories?.length) {
        parts.push(`Focus areas: ${intake.goals.categories.join(', ')}`);
      }
      if (intake.goals.pages?.length) {
        parts.push(`Pages in scope: ${intake.goals.pages.join(', ')}`);
      }
    }
    const brand = activeProject.brand;
    if (brand && Object.values(brand).some(Boolean)) {
      const brandLines = [
        brand.brandName   && `Brand name: ${brand.brandName}`,
        brand.tagline     && `Tagline: ${brand.tagline}`,
        (brand.primaryColor || brand.secondaryColor || brand.accentColor) &&
          `Colors: primary ${brand.primaryColor || '—'}, secondary ${brand.secondaryColor || '—'}, accent ${brand.accentColor || '—'}`,
        (brand.headingFont || brand.bodyFont) &&
          `Fonts: headings ${brand.headingFont || '—'}, body ${brand.bodyFont || '—'}`,
        brand.voice       && `Voice & tone: ${brand.voice}`,
        brand.dos         && `Do: ${brand.dos}`,
        brand.donts       && `Don't: ${brand.donts}`,
        brand.logoUrl     && `Logo URL: ${brand.logoUrl}`,
        brand.extraNotes  && `Brand notes: ${brand.extraNotes}`,
      ].filter(Boolean);
      if (brandLines.length) {
        parts.push(`Brand kit (must be respected in every change):\n${brandLines.join('\n')}`);
      }
    }
    if (activeProject.siteNotes) {
      parts.push(`Site notes:\n${activeProject.siteNotes}`);
    }
    const log = Array.isArray(activeProject.changeLog) ? activeProject.changeLog.slice(-5) : [];
    if (log.length) {
      parts.push(`Recent changes on this site:\n${log.map((e) => `- ${e.summary}`).join('\n')}`);
    }
    return parts.join('\n\n');
  };

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
      
      // 2. Process with dynamic model override (include intake/notes/changelog context)
      const generated = await requestsService.process(req.id, prompt, buildProjectContext(), model);
      
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
    setIsPublishing(true);
    try {
      await requestsService.updateStatus(activeRequestId, 'approved');
      // Save a friendly entry to the project's change log so the user can see
      // a timeline of what they've published over time.
      if (activeProject?.id) {
        try {
          await projectService.appendChangeLog(activeProject.id, {
            summary: prompt.trim().slice(0, 200) || 'Published a change',
            requestId: activeRequestId,
            model,
          });
          refreshActiveProject?.();
        } catch (logErr) {
          console.warn('Could not append change log entry', logErr);
        }
      }
      toast.success('Your changes are now live!');
      setCurrentAppCode(futureAppCode);
      setFutureAppCode(null);
      setPrompt('');
      setConfirmOpen(false);
    } catch (e) {
      toast.error("We couldn't publish your changes. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDiscard = () => {
    setFutureAppCode(null);
    setActiveRequestId(null);
    toast.info('Changes discarded. Your live site is unchanged.');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] bg-background overflow-hidden">
      
      {/* Top Main Workspace (3 columns) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-0 min-h-0 divide-x divide-border">
        
        {/* Column 1: Server Code */}
        <div className="flex flex-col h-full bg-[#1e1e1e]">
          <div className="h-10 border-b border-white/10 flex items-center px-4 bg-[#252526] text-white/70 text-xs font-semibold justify-between shrink-0">
            <span className="flex items-center gap-2 uppercase tracking-wider"><FileCode2 className="w-3.5 h-3.5"/> Your Code From Server</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setWizardOpen(true)}
                disabled={!activeProject}
                className="h-7 text-[11px] text-white/70 hover:text-white hover:bg-white/10 gap-1"
                title="Site info & goals"
              >
                <Settings2 className="w-3.5 h-3.5"/>
                Site info
                {activeProject?.intake?.completedAt && (
                  <span className="w-1.5 h-1.5 rounded-full bg-success ml-0.5" />
                )}
              </Button>
              <Badge variant="outline" className="border-white/20 text-white/50 bg-transparent scale-90">Read Only</Badge>
            </div>
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

        {/* Column 2: Your Site Now */}
        <div className="flex flex-col h-full bg-card relative">
          <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-muted/40 shrink-0">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-muted text-muted-foreground border">Before</Badge>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-primary"/> Your Site Now</span>
                <span className="text-[11px] text-muted-foreground">What visitors see today</span>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden bg-background">
            <LiveSitePreview initialUrl={activeProject?.domain} title="Your Site" />
          </div>
        </div>

        {/* Column 3: Your Site With Changes */}
        <div className={`flex flex-col h-full bg-muted/10 relative border-l ${futureAppCode && !isGenerating ? 'border-primary/60 ring-2 ring-primary/30 ring-inset' : 'border-border/50'}`}>
          <div className={`h-12 border-b flex items-center justify-between px-4 shrink-0 ${futureAppCode && !isGenerating ? 'bg-primary/5 border-primary/40' : 'bg-muted/40 border-border'}`}>
            <div className="flex items-center gap-2">
              <Badge
                variant={futureAppCode && !isGenerating ? 'default' : 'outline'}
                className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5"
              >
                {futureAppCode && !isGenerating ? 'After — Not Live Yet' : 'After'}
              </Badge>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Wand2 className="w-3.5 h-3.5 text-primary"/> Your Site With Changes</span>
                <span className="text-[11px] text-muted-foreground">What visitors will see after you publish</span>
              </div>
            </div>
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

            {/* Publish / Discard bar fixed at bottom of this pane */}
            {futureAppCode && !isGenerating && (
              <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col gap-2">
                <div className="bg-background/95 backdrop-blur-sm border border-primary/30 rounded-lg p-3 shadow-xl">
                  <p className="text-xs text-muted-foreground mb-2 text-center">
                    Happy with how it looks? Publishing updates your live site for everyone.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={handleDiscard}
                      className="gap-2 text-muted-foreground hover:text-destructive"
                      title="Discard changes"
                    >
                      <Trash2 className="w-4 h-4"/> Discard
                    </Button>
                    <Button
                      onClick={() => setConfirmOpen(true)}
                      className="flex-1 shadow-lg shadow-primary/20 h-11 text-base gap-2 bg-gradient-to-r from-primary to-blue-600 hover:scale-[1.01] transition-transform"
                    >
                      <Rocket className="w-5 h-5"/> Publish to Live Site
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <IntakeWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        project={activeProject}
        onComplete={() => refreshActiveProject?.()}
      />

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-primary"/>
              Publish changes to your live site?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your visitors will see the new version right away. You can always describe new changes afterward, but this replaces what's on your site now.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPublishing}>Not yet</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); handlePushCode(); }}
              disabled={isPublishing}
              className="bg-gradient-to-r from-primary to-blue-600 gap-2"
            >
              {isPublishing ? <Loader2 className="w-4 h-4 animate-spin"/> : <Rocket className="w-4 h-4"/>}
              {isPublishing ? 'Publishing…' : 'Yes, publish now'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bottom Bar: AI Target Command */}
      <div className="shrink-0 border-t border-border bg-card p-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] relative z-30">
        <div className="max-w-5xl mx-auto flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">What changes do you want?</span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGetIdeas}
                disabled={ideasLoading || !activeProject}
                className="h-8 gap-1.5 text-xs"
                title="Not sure what to change? Get 5 ideas tailored to your site."
              >
                {ideasLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Lightbulb className="w-3.5 h-3.5 text-yellow-500"/>}
                {ideasLoading ? 'Thinking…' : 'Get ideas'}
              </Button>
              <span className="text-xs text-muted-foreground">Model:</span>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="w-[160px] h-8 text-xs bg-muted/40 border-border">
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

          {showIdeas && (
            <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-3 relative">
              <button
                type="button"
                onClick={() => setShowIdeas(false)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                aria-label="Close ideas"
              >
                <X className="w-4 h-4"/>
              </button>
              <p className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-2">
                <Lightbulb className="w-3.5 h-3.5 text-yellow-500"/> Ideas for your site — click one to use it
              </p>
              {ideasLoading ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin"/> Coming up with ideas tailored to your site…
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {ideas.map((idea, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { setPrompt(idea.prompt || idea.title); setShowIdeas(false); }}
                      className="text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:border-primary/60 hover:bg-primary/5 text-left transition-colors"
                      title={idea.prompt}
                    >
                      {idea.title}
                    </button>
                  ))}
                  {ideas.length === 0 && (
                    <span className="text-xs text-muted-foreground">No ideas returned.</span>
                  )}
                </div>
              )}
            </div>
          )}
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

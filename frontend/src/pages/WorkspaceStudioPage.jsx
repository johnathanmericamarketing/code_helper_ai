import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisualInspector } from '@/components/VisualInspector';
import { LiveSitePreview } from '@/components/LiveSitePreview';
import { IntakeWizard } from '@/components/IntakeWizard';
import { BrandKitCard } from '@/components/BrandKitCard';
import { SectionBlock } from '@/components/ui/section-block';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Sparkles, Send, Loader2, Rocket, FileCode2, Eye, Wand2, Trash2, Settings2, 
  Lightbulb, X, Palette, CheckCircle2, MonitorSmartphone, Bot, Globe
} from 'lucide-react';
import { toast } from 'sonner';
import { requestsService } from '@/lib/firebase-service';
import { projectService } from '@/lib/project-service';
import { useProject } from '@/context/ProjectContext';
import { detectBrandSignals } from '@/lib/brand-detection';
import { generationRTDB, useGenerationProgress } from '@/lib/realtime-service';
import Editor from '@monaco-editor/react';

const tabs = [
  { id: "guided", label: "Guided" },
  { id: "build", label: "Build" }
];

export const WorkspaceStudioPage = () => {
  const { activeProject, refreshActiveProject } = useProject();
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('claude-sonnet-4-5');
  const [isGenerating, setIsGenerating] = useState(false);

  // Live generation progress from RTDB
  const [activeRequestId, setActiveRequestId] = useState(null);
  const genProgress = useGenerationProgress(activeRequestId);

  // State for the three panes
  const [serverCode, setServerCode] = useState('// Connect to a repository to load active branch code here.\n\nfunction App() {\n  return <div>Hello World</div>;\n}');
  const [currentAppCode, setCurrentAppCode] = useState('<div><h1>Your App</h1><p>This represents the current state of your application UI.</p></div>');
  const [futureAppCode, setFutureAppCode] = useState(null);

  // keep a single requestId state (removed duplicate declared later)
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [ideas, setIdeas] = useState([]);
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [showIdeas, setShowIdeas] = useState(false);

  // Brand detection state
  const [brandDetected, setBrandDetected]   = useState(null); // result from detectBrandSignals
  const [brandDialogOpen, setBrandDialogOpen] = useState(false);

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

      // 1. Create Firestore request record
      const rawPayload = {
        raw_request: prompt,
        urgency: 'high',
        area_of_app: 'frontend'
      };
      const req = await requestsService.create(rawPayload, activeProject.id);
      setActiveRequestId(req.id);

      // 2. Open a live RTDB progress node so the UI animates immediately
      await generationRTDB.init(req.id);

      // 3. Call the Cloud Function (it writes progress steps to RTDB as it runs)
      const generated = await requestsService.process(req.id, prompt, buildProjectContext(), model);
      
      if (generated && generated.code_changes && generated.code_changes.length > 0) {
        // Find HTML/React changes suitable for the visual inspector, otherwise fallback to the first diff
        const uiChange = generated.code_changes.find(c => c.file_path.endsWith('.jsx') || c.file_path.endsWith('.html'));
        const diffToRender = uiChange ? uiChange.diff : generated.code_changes[0].diff;

        setFutureAppCode(diffToRender);
        toast.success('Your preview is ready — check it on the right!');

        // Scan all diffs for brand signals
        const allDiffText = generated.code_changes.map((c) => c.diff || '').join('\n');
        const responseText = (generated.summary || '') + '\n' + allDiffText;
        const detected = detectBrandSignals(responseText, activeProject?.brand);
        if (detected) {
          setBrandDetected(detected);
        }
      } else {
        toast.error("We couldn't build a preview for this request. Try rewording it.");
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate changes. Check your API keys and quota.');
      setFutureAppCode('<!-- Error generating code -->');
    } finally {
      setIsGenerating(false);
      // Clean up the RTDB progress node after a short delay
      if (activeRequestId) {
        setTimeout(() => generationRTDB.clear(activeRequestId).catch(() => {}), 3000);
      }
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
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-background text-foreground">
      {/* Header Block */}
      <div className="border-b border-border bg-card px-5 py-4 shrink-0">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted/80">Builder mode</Badge>
              Safe preview only
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Workspace Studio</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Top actions */}
            <div className="flex rounded-lg border border-border bg-muted/30 p-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${tab.id === 'guided' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <Button onClick={() => setWizardOpen(true)} variant="outline" className="gap-2 bg-card h-9">
               <Settings2 className="w-4 h-4"/> Site Info
               {activeProject?.intake?.completedAt && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
            </Button>

            <Button 
              onClick={() => setConfirmOpen(true)}
              disabled={!futureAppCode || isGenerating}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white h-9"
            >
              <CheckCircle2 className="w-4 h-4"/>
              Publish to Live
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Space */}
      <div className="flex-1 p-5 overflow-hidden">
        <div className="mx-auto h-full flex flex-col lg:flex-row gap-5 max-w-[1600px]">
          
          {/* LEFT COLUMN: Input & Current Site */}
          <div className="w-full lg:w-[450px] xl:w-[500px] flex flex-col gap-5 shrink-0 h-full overflow-y-auto pr-1">
            
            {/* AI Studio Assistant Block */}
            <SectionBlock 
              title="AI Studio Assistant" 
              subtitle="Describe changes or new components you need"
              icon={<Bot className="w-4 h-4 text-indigo-500" />}
              className="shrink-0"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
			          <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">What changes do you want?</span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleGetIdeas}
                    disabled={ideasLoading || !activeProject}
                    className="h-7 text-[10px] text-muted-foreground hover:text-indigo-500 shrink-0"
                    title="Not sure what to change? Get 5 ideas tailored to your site."
                  >
                    {ideasLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1"/> : <Lightbulb className="w-3 h-3 text-yellow-500 mr-1"/>}
                    {ideasLoading ? 'Thinking…' : 'Get ideas'}
                  </Button>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="h-7 text-[10px] bg-muted/40 border-border max-w-[130px] shrink-0">
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
                <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-3 relative mb-3">
                  <button
                    type="button"
                    onClick={() => setShowIdeas(false)}
                    className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4"/>
                  </button>
                  <p className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-2">
                    <Lightbulb className="w-3.5 h-3.5 text-yellow-500"/> Ideas for your site
                  </p>
                  {ideasLoading ? (
                     <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
                       <Loader2 className="w-3 h-3 animate-spin"/> Coming up with tailored ideas…
                     </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {ideas.map((idea, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => { setPrompt(idea.prompt || idea.title); setShowIdeas(false); }}
                          className="text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:border-indigo-500/40 hover:bg-indigo-500/5 text-left transition-colors"
                          title={idea.prompt}
                        >
                          {idea.title}
                        </button>
                      ))}
                      {ideas.length === 0 && <span className="text-xs text-muted-foreground">No ideas returned.</span>}
                    </div>
                  )}
                </div>
              )}

              <div className="relative group">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your changes... e.g. 'Redesign the hero section'"
                  className="resize-none min-h-[100px] pr-16 bg-card border-border focus-visible:ring-indigo-500/50 text-sm py-3 shadow-sm rounded-xl"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerate();
                    }
                  }}
                />
                <Button 
                  size="icon"
                  className="absolute right-2 bottom-2 h-9 w-9 bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-transform group-focus-within:scale-105 rounded-lg"
                  disabled={!prompt.trim() || isGenerating}
                  onClick={handleGenerate}
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Send className="w-4 h-4 text-white ml-0.5" />}
                </Button>
              </div>

               {/* Brand Detection Banner placed right under prompt if triggered */}
               {brandDetected && (
                 <div className="mt-4 border border-indigo-500/30 bg-indigo-500/5 rounded-lg p-3 flex flex-col gap-3">
                   <div className="flex items-center gap-2 text-xs">
                     <Palette className="w-4 h-4 text-indigo-400 shrink-0" />
                     <span className="text-foreground font-medium flex-1">Brand signals detected</span>
                     <button
                       type="button"
                       onClick={() => setBrandDetected(null)}
                       className="text-muted-foreground hover:text-foreground shrink-0"
                     >
                       <X className="w-3.5 h-3.5" />
                     </button>
                   </div>
                   <Button
                     size="sm"
                     variant="outline"
                     className="w-full text-xs h-8 bg-card border-indigo-500/40 text-indigo-500 hover:bg-indigo-500/10"
                     onClick={() => setBrandDialogOpen(true)}
                   >
                     Review & Save to Brand Kit
                   </Button>
                 </div>
               )}
            </SectionBlock>

            {/* Current Site View Block */}
            <SectionBlock
              title="Your Site Now"
              subtitle="Current production view"
              icon={<Eye className="w-4 h-4 text-emerald-500" />}
              className="flex-1 min-h-[300px] flex flex-col"
            >
              <div className="flex-1 min-h-0 bg-background overflow-hidden relative -mx-5 -mb-5 mt-2 border-t border-border rounded-b-xl">
                 <LiveSitePreview initialUrl={activeProject?.domain} title="Your Site" />
              </div>
            </SectionBlock>
          </div>

          {/* RIGHT COLUMN: Visual Preview */}
          <div className="flex-1 flex flex-col min-w-0">
             <SectionBlock
               title="Preview Workspace"
               subtitle="Review staging changes before publishing"
               icon={<MonitorSmartphone className="w-4 h-4 text-blue-500" />}
               className="flex-1 h-full flex flex-col shadow-sm"
               hasWrapper={false}
             >
               <div className="flex-1 relative bg-background overflow-hidden flex flex-col -mx-5 -mb-5 mt-2 border-t border-border rounded-b-xl">
                  {isGenerating ? (
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/60 backdrop-blur-sm z-10 gap-5 px-8">
                       <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                       <p className="text-secondary-foreground font-medium text-center animate-pulse">
                         {genProgress.step || 'Building your changes…'}
                       </p>
                       {genProgress.progress > 0 && (
                         <div className="w-full max-w-xs">
                           <div className="flex justify-between text-xs text-muted-foreground mb-1">
                             <span>Progress</span>
                             <span>{genProgress.progress}%</span>
                           </div>
                           <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${genProgress.progress}%` }} />
                           </div>
                         </div>
                       )}
                     </div>
                  ) : futureAppCode ? (
                     <VisualInspector htmlContent={futureAppCode} title="Your Preview" isPreview />
                  ) : (
                     <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-60 space-y-4 px-8 text-center bg-muted/10">
                       <Wand2 className="w-16 h-16 text-indigo-500/40" />
                       <p className="font-medium text-sm">Tell us what to change on the left.<br/>You'll see your live preview here.</p>
                     </div>
                  )}
               </div>

               {/* Publish / Discard bar overlay fixed at bottom of the preview pane */}
               {futureAppCode && !isGenerating && (
                  <div className="absolute bottom-5 left-5 right-5 z-20 flex flex-col gap-2 mx-auto max-w-lg">
                    <div className="bg-card/95 backdrop-blur-md border border-indigo-500/30 rounded-xl p-3 shadow-2xl">
                      <div className="flex gap-2">
                        <Button variant="ghost" onClick={handleDiscard} className="text-muted-foreground hover:text-destructive w-1/3">
                           <Trash2 className="w-4 h-4 mr-2"/> Discard
                        </Button>
                        <Button 
                          onClick={() => setConfirmOpen(true)} 
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                        >
                           <CheckCircle2 className="w-4 h-4 mr-2"/> Publish Changes Now
                        </Button>
                      </div>
                    </div>
                  </div>
               )}
             </SectionBlock>
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
              <Rocket className="w-5 h-5 text-indigo-600"/>
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
              className="bg-indigo-600 hover:bg-indigo-700 gap-2 text-white"
            >
              {isPublishing ? <Loader2 className="w-4 h-4 animate-spin"/> : <CheckCircle2 className="w-4 h-4"/>}
              {isPublishing ? 'Publishing…' : 'Yes, publish now'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={brandDialogOpen} onOpenChange={setBrandDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-indigo-500" />
              Update Brand Kit — {activeProject?.name || 'this project'}
            </DialogTitle>
            <DialogDescription>
              The AI found new brand values in your recent change. Review and save them to make sure every future generation stays on-brand.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-4">
            {activeProject && (
              <BrandKitCard
                project={activeProject}
                prefill={brandDetected?.prefill}
                onSaved={() => {
                  setBrandDialogOpen(false);
                  setBrandDetected(null);
                  refreshActiveProject?.();
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { IntakeWizard } from '@/components/IntakeWizard';
import { BrandKitCard } from '@/components/BrandKitCard';
import { Loader2, CheckCircle2, Rocket, Palette } from 'lucide-react';

// Studio sub-components
import { StudioLeftPanel }    from '@/components/studio/StudioLeftPanel';
import { StudioTopBar }       from '@/components/studio/StudioTopBar';
import { StudioComposer }     from '@/components/studio/StudioComposer';
import { StudioPreviewStage } from '@/components/studio/StudioPreviewStage';

import { toast } from 'sonner';
import { requestsService }    from '@/lib/firebase-service';
import { projectService }     from '@/lib/project-service';
import { useProject }         from '@/context/ProjectContext';
import { detectBrandSignals } from '@/lib/brand-detection';
import { generationRTDB, useGenerationProgress } from '@/lib/realtime-service';

export const WorkspaceStudioPage = () => {
  const { activeProject, refreshActiveProject } = useProject();

  // ── UI State ────────────────────────────────────────────────────────────────
  const [activeTab,     setActiveTab]     = useState('guided');
  const [showComposer,  setShowComposer]  = useState(false);

  // ── Prompt / Generation State ────────────────────────────────────────────────
  const [prompt,          setPrompt]          = useState('');
  const [model,           setModel]           = useState('claude-sonnet-4-5');
  const [isGenerating,    setIsGenerating]    = useState(false);
  const [activeRequestId, setActiveRequestId] = useState(null);
  const genProgress = useGenerationProgress(activeRequestId);

  // ── Code State ───────────────────────────────────────────────────────────────
  const [currentAppCode, setCurrentAppCode] = useState(
    '<div><h1>Your App</h1><p>This represents the current state of your application UI.</p></div>'
  );
  const [futureAppCode, setFutureAppCode] = useState(null);

  // ── Dialog / Modal State ─────────────────────────────────────────────────────
  const [confirmOpen,     setConfirmOpen]     = useState(false);
  const [isPublishing,    setIsPublishing]    = useState(false);
  const [wizardOpen,      setWizardOpen]      = useState(false);
  const [brandDialogOpen, setBrandDialogOpen] = useState(false);
  const [brandDetected,   setBrandDetected]   = useState(null);

  // ── Ideas State ──────────────────────────────────────────────────────────────
  const [ideas,        setIdeas]        = useState([]);
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [showIdeas,    setShowIdeas]    = useState(false);

  // ── Effects ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeProject && !activeProject.intake?.completedAt) {
      setWizardOpen(true);
    }
  }, [activeProject?.id, activeProject?.intake?.completedAt]);

  // Auto-open brand dialog after generation detects new brand signals
  useEffect(() => {
    if (brandDetected) setBrandDialogOpen(true);
  }, [brandDetected]);

  // ── Project Context Builder ──────────────────────────────────────────────────
  const buildProjectContext = () => {
    if (!activeProject) return currentAppCode;
    const parts = [`Current UI:\n${currentAppCode}`];
    const intake = activeProject.intake;
    if (intake?.goals?.summary) parts.push(`Project goals:\n${intake.goals.summary}`);
    const brand = activeProject.brand;
    if (brand && Object.values(brand).some(Boolean)) {
      const brandLines = [
        brand.brandName   && `Brand name: ${brand.brandName}`,
        brand.tagline     && `Tagline: ${brand.tagline}`,
        (brand.primaryColor || brand.secondaryColor) &&
          `Colors: primary ${brand.primaryColor || '—'}, secondary ${brand.secondaryColor || '—'}`,
        (brand.headingFont || brand.bodyFont) &&
          `Fonts: headings ${brand.headingFont || '—'}, body ${brand.bodyFont || '—'}`,
        brand.voice && `Voice: ${brand.voice}`,
      ].filter(Boolean);
      if (brandLines.length) parts.push(`Brand kit:\n${brandLines.join('\n')}`);
    }
    if (activeProject.siteNotes) parts.push(`Site notes:\n${activeProject.siteNotes}`);
    const log = Array.isArray(activeProject.changeLog) ? activeProject.changeLog.slice(-5) : [];
    if (log.length) parts.push(`Recent changes:\n${log.map(e => `- ${e.summary}`).join('\n')}`);
    return parts.join('\n\n');
  };

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleActivateBuild = () => {
    setActiveTab('build');
    setShowComposer(true);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'build') setShowComposer(true);
    if (tab === 'guided') setShowComposer(false);
  };

  const handleGetIdeas = async () => {
    if (!activeProject) { toast.error('Please select a project first.'); return; }
    setIdeasLoading(true);
    setShowIdeas(true);
    try {
      const intake    = activeProject.intake || {};
      const log       = Array.isArray(activeProject.changeLog) ? activeProject.changeLog.slice(-5) : [];
      const brand     = activeProject.brand || {};
      const brandNotes = [
        brand.brandName && `Brand: ${brand.brandName}`,
        brand.tagline   && `Tagline: ${brand.tagline}`,
        brand.voice     && `Voice: ${brand.voice}`,
      ].filter(Boolean).join(' | ');
      const result = await requestsService.suggestIdeas({
        siteUrl: activeProject.domain || '',
        goals:   intake.goals?.summary || '',
        siteNotes: [activeProject.siteNotes, brandNotes].filter(Boolean).join('\n'),
        recentChanges: log.map(e => e.summary).filter(Boolean),
      });
      setIdeas(Array.isArray(result.ideas) ? result.ideas : []);
      if (result.mode === 'stub') toast.info('Showing example ideas. Add your API key in Settings for AI-tailored suggestions.');
    } catch (err) {
      console.error(err);
      toast.error("Couldn't load ideas. Try again.");
      setShowIdeas(false);
    } finally {
      setIdeasLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !activeProject) {
      if (!activeProject) toast.error('Please select a project first.');
      return;
    }
    setIsGenerating(true);
    setFutureAppCode(null);
    try {
      toast.info('Working on your changes…');
      const req = await requestsService.create(
        { raw_request: prompt, urgency: 'high', area_of_app: 'frontend' },
        activeProject.id
      );
      setActiveRequestId(req.id);
      await generationRTDB.init(req.id);
      const generated = await requestsService.process(req.id, prompt, buildProjectContext(), model);
      if (generated?.code_changes?.length > 0) {
        const uiChange = generated.code_changes.find(
          c => c.file_path.endsWith('.jsx') || c.file_path.endsWith('.html')
        );
        setFutureAppCode(uiChange ? uiChange.diff : generated.code_changes[0].diff);
        toast.success('Your preview is ready!');
        const allDiffText = generated.code_changes.map(c => c.diff || '').join('\n');
        const detected = detectBrandSignals((generated.summary || '') + '\n' + allDiffText, activeProject?.brand);
        if (detected) setBrandDetected(detected);
      } else {
        toast.error("We couldn't build a preview. Try rewording your request.");
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate changes. Check your API keys.');
      setFutureAppCode('<!-- Error generating code -->');
    } finally {
      setIsGenerating(false);
      if (activeRequestId) setTimeout(() => generationRTDB.clear(activeRequestId).catch(() => {}), 3000);
    }
  };

  const handlePublish = async () => {
    if (!activeRequestId || !futureAppCode) return;
    setIsPublishing(true);
    try {
      await requestsService.updateStatus(activeRequestId, 'approved');
      if (activeProject?.id) {
        try {
          await projectService.appendChangeLog(activeProject.id, {
            summary:   prompt.trim().slice(0, 200) || 'Published a change',
            requestId: activeRequestId,
            model,
          });
          refreshActiveProject?.();
        } catch (logErr) { console.warn('Could not append change log', logErr); }
      }
      toast.success('Your changes are now live!');
      setCurrentAppCode(futureAppCode);
      setFutureAppCode(null);
      setPrompt('');
      setConfirmOpen(false);
    } catch {
      toast.error("We couldn't publish. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDiscard = () => {
    setFutureAppCode(null);
    setActiveRequestId(null);
    toast.info('Changes discarded. Your live site is unchanged.');
  };

  const handleUndo = () => {
    if (futureAppCode) handleDiscard();
    else toast.info('Nothing to undo.');
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-full overflow-hidden bg-background text-foreground">

      {/* Left Panel */}
      <StudioLeftPanel activeProject={activeProject} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        {/* Top Bar */}
        <StudioTopBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onUndo={handleUndo}
          onSaveDraft={() => toast.info('Draft saved.')}
          onPublish={() => setConfirmOpen(true)}
          canPublish={!!futureAppCode}
          isGenerating={isGenerating}
        />

        {/* Composer (prompt bar) */}
        {(activeTab === 'build' || showComposer) && (
          <StudioComposer
            prompt={prompt}
            onPromptChange={setPrompt}
            model={model}
            onModelChange={setModel}
            onGenerate={handleGenerate}
            onGetIdeas={handleGetIdeas}
            onClose={() => setShowComposer(false)}
            isGenerating={isGenerating}
            ideasLoading={ideasLoading}
            ideas={ideas}
            showIdeas={showIdeas}
            hasProject={!!activeProject}
          />
        )}

        {/* Two-pane preview */}
        <StudioPreviewStage
          activeProject={activeProject}
          activeTab={activeTab}
          isGenerating={isGenerating}
          genProgress={genProgress}
          futureAppCode={futureAppCode}
          onActivateBuild={handleActivateBuild}
          onDiscard={handleDiscard}
          onConfirmPublish={() => setConfirmOpen(true)}
        />

      </div>

      {/* ── Modals ──────────────────────────────────────────────── */}

      {/* Intake Wizard */}
      <IntakeWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        project={activeProject}
        onComplete={() => refreshActiveProject?.()}
      />

      {/* Publish Confirm Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-indigo-600" />
              Publish changes to your live site?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your visitors will see the new version right away. You can always describe new changes afterward.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPublishing}>Not yet</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); handlePublish(); }}
              disabled={isPublishing}
              className="bg-indigo-600 hover:bg-indigo-700 gap-2 text-white"
            >
              {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {isPublishing ? 'Publishing…' : 'Yes, publish now'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Brand Kit Update Dialog (auto-opens when AI detects new brand signals) */}
      <Dialog open={brandDialogOpen} onOpenChange={setBrandDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-indigo-500" />
              Update Brand Kit — {activeProject?.name || 'this project'}
            </DialogTitle>
            <DialogDescription>
              The AI found new brand values. Review and save them to keep future generations on-brand.
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

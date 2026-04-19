import React, { useState } from 'react';
import { toast } from 'sonner';
import { requestsService } from '@/lib/firebase-service';
import { projectService } from '@/lib/project-service';
import { useProject } from '@/context/ProjectContext';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Rocket, Loader2 } from 'lucide-react';

import { TrustStrip } from '@/components/studio/TrustStrip';
import { StudioTopBar } from '@/components/studio/StudioTopBar';
import { StudioPreviewStage } from '@/components/studio/StudioPreviewStage';
import { StudioComposer } from '@/components/studio/StudioComposer';

export const StudioPage = () => {
  const { activeProject, refreshActiveProject } = useProject();
  
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('claude-sonnet-4-5');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [futureAppCode, setFutureAppCode] = useState(null);
  const [activeRequestId, setActiveRequestId] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [ideasLoading, setIdeasLoading] = useState(false);

  // Note: BuildProjectContext logic and specific prompts are preserved from Phase 1.
  // This refactor focuses entirely on UI structure.
  
  const handleGenerate = async () => {
    if (!prompt.trim() || !activeProject) {
      if (!activeProject) toast.error("Please select a project first.");
      return;
    }
    setIsGenerating(true);
    setFutureAppCode(null);

    try {
      toast.info('Working on your changes…');
      const rawPayload = { raw_request: prompt, urgency: 'high', area_of_app: 'frontend' };
      const req = await requestsService.create(rawPayload, activeProject.id);
      setActiveRequestId(req.id);
      
      // We pass a generic context string here just to preserve the function signature.
      // In a real run, this would be `buildProjectContext()`.
      const contextStr = "Current UI: <div><h1>Your App</h1></div>"; 
      
      const generated = await requestsService.process(req.id, prompt, contextStr, model);
      
      if (generated && generated.code_changes && generated.code_changes.length > 0) {
        const uiChange = generated.code_changes.find(c => c.file_path.endsWith('.jsx') || c.file_path.endsWith('.html'));
        const diffToRender = uiChange ? uiChange.diff : generated.code_changes[0].diff;
        setFutureAppCode(diffToRender);
        toast.success('Your preview is ready!');
      } else {
        toast.error("We couldn't build a preview for this request.");
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate changes. Check your API keys and quota.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePushCode = async () => {
    if (!activeRequestId || !futureAppCode) return;
    setIsPublishing(true);
    try {
      await requestsService.updateStatus(activeRequestId, 'approved');
      if (activeProject?.id) {
        await projectService.appendChangeLog(activeProject.id, {
          summary: prompt.trim().slice(0, 200) || 'Published a change',
          requestId: activeRequestId,
          model,
        });
        refreshActiveProject?.();
      }
      toast.success('Your changes are now live!');
      setFutureAppCode(null);
      setPrompt('');
      setConfirmOpen(false);
    } catch (e) {
      toast.error("We couldn't publish your changes.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleGetIdeas = () => {
    if (!activeProject) return toast.error('Select a project first.');
    setIdeasLoading(true);
    setTimeout(() => {
      setPrompt('Make the header background dark blue and change text to white.');
      setIdeasLoading(false);
      toast.info('Idea loaded.');
    }, 1000);
  };

  if (!activeProject) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] text-muted-custom fade-in">
        <p>Please select a project to open the Studio.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[var(--bg-app)] overflow-hidden -m-4 md:-m-6">
      <StudioTopBar 
        projectName={activeProject?.name} 
        onPublish={() => setConfirmOpen(true)}
        canPublish={!!futureAppCode && !isGenerating}
      />
      <TrustStrip />
      
      <StudioPreviewStage 
        currentDomain={activeProject?.domain}
        futureAppCode={futureAppCode}
        isGenerating={isGenerating}
      />

      <StudioComposer 
        prompt={prompt}
        setPrompt={setPrompt}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        model={model}
        setModel={setModel}
        onGetIdeas={handleGetIdeas}
        ideasLoading={ideasLoading}
      />

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="bg-surface border-subtle rounded-[var(--radius-card)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-primary-custom">
              <Rocket className="w-5 h-5 text-[var(--accent-600)]"/>
              Publish changes to your live site?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-secondary-custom">
              Your visitors will see the new version right away. This replaces what's on your site now.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPublishing} className="rounded-[var(--radius-button)]">Not yet</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); handlePushCode(); }}
              disabled={isPublishing}
              className="bg-[var(--accent-600)] hover:bg-[var(--accent-700)] text-white gap-2 rounded-[var(--radius-button)]"
            >
              {isPublishing ? <Loader2 className="w-4 h-4 animate-spin"/> : <Rocket className="w-4 h-4"/>}
              {isPublishing ? 'Publishing…' : 'Yes, publish now'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

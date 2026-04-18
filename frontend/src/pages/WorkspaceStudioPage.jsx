import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisualInspector } from '@/components/VisualInspector';
import { LiveSitePreview } from '@/components/LiveSitePreview';
import { IntakeWizard } from '@/components/IntakeWizard';
import { BrandKitCard } from '@/components/BrandKitCard';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Sparkles, Send, Loader2, Rocket, Wand2, Trash2, Settings2,
  Lightbulb, X, Palette, CheckCircle2, MonitorSmartphone, Bot,
  Undo2, Save, LayoutTemplate, FolderKanban, Layers3, FileCode2,
  Settings, ChevronDown, Plus, Globe, ArrowRight, Search
} from 'lucide-react';
import { toast } from 'sonner';
import { requestsService } from '@/lib/firebase-service';
import { projectService } from '@/lib/project-service';
import { useProject } from '@/context/ProjectContext';
import { detectBrandSignals } from '@/lib/brand-detection';
import { generationRTDB, useGenerationProgress } from '@/lib/realtime-service';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'guided', label: 'Guided' },
  { id: 'build', label: 'Build' },
  { id: 'review', label: 'Review' },
];

const studioNavItems = [
  { to: '/app/studio',       icon: LayoutTemplate, label: 'Workspace Studio' },
  { to: '/app',              icon: FolderKanban,   label: 'Projects' },
  { to: '/app/brand',        icon: Palette,        label: 'Brand Kit' },
  { to: '/app/history',      icon: Layers3,        label: 'Versions' },
  { to: '/app/assets',       icon: FileCode2,      label: 'Files' },
  { to: '/app/settings',     icon: Settings,       label: 'Settings' },
];

const guidedSteps = [
  { num: 1, text: 'See your current site' },
  { num: 2, text: 'Describe the change' },
  { num: 3, text: 'Review the preview' },
  { num: 4, text: 'Publish when ready' },
];

export const WorkspaceStudioPage = () => {
  const { activeProject, refreshActiveProject } = useProject();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('guided');
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('claude-sonnet-4-5');
  const [isGenerating, setIsGenerating] = useState(false);

  const [activeRequestId, setActiveRequestId] = useState(null);
  const genProgress = useGenerationProgress(activeRequestId);

  const [currentAppCode, setCurrentAppCode] = useState('<div><h1>Your App</h1><p>This represents the current state of your application UI.</p></div>');
  const [futureAppCode, setFutureAppCode] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [ideas, setIdeas] = useState([]);
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [showIdeas, setShowIdeas] = useState(false);
  const [showPromptBar, setShowPromptBar] = useState(false);

  const [brandDetected, setBrandDetected] = useState(null);
  const [brandDialogOpen, setBrandDialogOpen] = useState(false);

  useEffect(() => {
    if (activeProject && !activeProject.intake?.completedAt) {
      setWizardOpen(true);
    }
  }, [activeProject?.id, activeProject?.intake?.completedAt]);

  const buildProjectContext = () => {
    if (!activeProject) return currentAppCode;
    const parts = [`Current UI:\n${currentAppCode}`];
    const intake = activeProject.intake;
    if (intake?.goals?.summary) {
      parts.push(`Project goals:\n${intake.goals.summary}`);
    }
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

  const handleGetIdeas = async () => {
    if (!activeProject) { toast.error('Please select a project first.'); return; }
    setIdeasLoading(true);
    setShowIdeas(true);
    try {
      const intake = activeProject.intake || {};
      const log = Array.isArray(activeProject.changeLog) ? activeProject.changeLog.slice(-5) : [];
      const brand = activeProject.brand || {};
      const brandNotes = [
        brand.brandName   && `Brand: ${brand.brandName}`,
        brand.tagline     && `Tagline: ${brand.tagline}`,
        brand.voice       && `Voice: ${brand.voice}`,
      ].filter(Boolean).join(' | ');
      const result = await requestsService.suggestIdeas({
        siteUrl: activeProject.domain || '',
        goals: intake.goals?.summary || '',
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
      const req = await requestsService.create({ raw_request: prompt, urgency: 'high', area_of_app: 'frontend' }, activeProject.id);
      setActiveRequestId(req.id);
      await generationRTDB.init(req.id);
      const generated = await requestsService.process(req.id, prompt, buildProjectContext(), model);
      if (generated?.code_changes?.length > 0) {
        const uiChange = generated.code_changes.find(c => c.file_path.endsWith('.jsx') || c.file_path.endsWith('.html'));
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

  const handlePushCode = async () => {
    if (!activeRequestId || !futureAppCode) return;
    setIsPublishing(true);
    try {
      await requestsService.updateStatus(activeRequestId, 'approved');
      if (activeProject?.id) {
        try {
          await projectService.appendChangeLog(activeProject.id, {
            summary: prompt.trim().slice(0, 200) || 'Published a change',
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
    } catch (e) {
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
    if (futureAppCode) {
      handleDiscard();
    } else {
      toast.info('Nothing to undo.');
    }
  };

  return (
    <div className="flex h-full overflow-hidden bg-background text-foreground">

      {/* ── Left Studio Nav Panel ─────────────────────────────── */}
      <div className="w-[220px] shrink-0 flex flex-col border-r border-border bg-card h-full overflow-y-auto">

        {/* Logo / Title */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-border shrink-0">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
            <LayoutTemplate className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground leading-none">Workspace Studio</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">AI powered website builder</div>
          </div>
        </div>

        {/* Project Selector */}
        <div className="px-3 py-3 border-b border-border shrink-0">
          <button
            onClick={() => {}}
            className="w-full flex items-center gap-2.5 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 px-3 py-2.5 transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-foreground/10 flex items-center justify-center shrink-0">
              <Layers3 className="w-3.5 h-3.5 text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-foreground truncate">{activeProject?.name || 'Select Project'}</div>
              <div className="text-[10px] text-muted-foreground truncate">Project workspace</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          </button>
        </div>

        {/* Studio Nav Items */}
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {studioNavItems.map((item) => {
            const isActive = item.to === '/app' ? location.pathname === '/app' : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-medium dark:bg-indigo-500/10 dark:text-indigo-400'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Guided Workflow Info Box */}
        <div className="px-3 pb-4 shrink-0">
          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <p className="text-[11px] font-semibold text-foreground mb-0.5">Guided workflow</p>
            <p className="text-[10px] text-muted-foreground mb-3">Designed for any type of user</p>
            <div className="space-y-2">
              {guidedSteps.map((step) => (
                <div key={step.num} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full border border-border bg-card flex items-center justify-center shrink-0">
                    <span className="text-[9px] font-semibold text-muted-foreground">{step.num}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{step.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content Area ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        {/* Top Action Bar */}
        <div className="border-b border-border bg-card px-5 py-3 shrink-0">
          <div className="flex items-start justify-between gap-4">
            {/* Title section */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-[10px] h-5 px-2 bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20">
                  Builder mode
                </Badge>
                <span className="text-[10px] text-muted-foreground">Safe preview only</span>
              </div>
              <h1 className="text-xl font-semibold text-foreground leading-none">Workspace Studio</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Compare your live site and AI changes side by side before publishing.</p>
            </div>

            {/* Tab + Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Guided / Build / Review tabs */}
              <div className="flex rounded-lg border border-border bg-muted/30 p-0.5">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                      activeTab === tab.id
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Undo */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleUndo}
                className="h-8 gap-1.5 text-xs bg-card"
              >
                <Undo2 className="w-3.5 h-3.5" /> Undo
              </Button>

              {/* Save Draft */}
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs bg-card"
                disabled={!futureAppCode}
                onClick={() => toast.info('Draft saved.')}
              >
                <Save className="w-3.5 h-3.5" /> Save draft
              </Button>

              {/* Publish Changes */}
              <Button
                size="sm"
                className="h-8 gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={!futureAppCode || isGenerating}
                onClick={() => setConfirmOpen(true)}
              >
                <Rocket className="w-3.5 h-3.5" /> Publish changes
              </Button>
            </div>
          </div>
        </div>

        {/* Prompt Bar (show when tab is Build or when clicked) */}
        {(activeTab === 'build' || showPromptBar) && (
          <div className="border-b border-border bg-card/80 px-5 py-3 shrink-0">
            <div className="flex items-center gap-3 max-w-4xl">
              <div className="relative flex-1">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your changes… e.g. 'Redesign the hero section with a bold heading'"
                  className="resize-none min-h-[40px] max-h-[100px] pr-14 text-sm py-2.5 bg-card border-border rounded-xl"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); }
                  }}
                />
                <Button
                  size="icon"
                  className="absolute right-2 bottom-2 h-7 w-7 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                  disabled={!prompt.trim() || isGenerating}
                  onClick={handleGenerate}
                >
                  {isGenerating ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" /> : <Send className="w-3.5 h-3.5 text-white" />}
                </Button>
              </div>
              <div className="flex gap-2 items-center">
                <Button variant="ghost" size="sm" onClick={handleGetIdeas} disabled={ideasLoading || !activeProject} className="h-8 text-xs gap-1.5">
                  {ideasLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Lightbulb className="w-3 h-3 text-yellow-500" />}
                  Ideas
                </Button>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="h-8 text-[11px] w-[140px] bg-card border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="claude-opus-4-5">Claude Opus 4.5</SelectItem>
                    <SelectItem value="claude-sonnet-4-5">Claude Sonnet 4.5</SelectItem>
                    <SelectItem value="gemini-1.5-pro-latest">Gemini 1.5 Pro</SelectItem>
                    <SelectItem value="gemini-1.5-flash-latest">Gemini 1.5 Flash</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPromptBar(false)}
                  className="h-8 w-8 p-0 text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Ideas chips */}
            {showIdeas && ideas.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {ideas.map((idea, i) => (
                  <button
                    key={i}
                    onClick={() => { setPrompt(idea.prompt || idea.title); setShowIdeas(false); }}
                    className="text-[11px] px-3 py-1 rounded-full border border-border bg-card hover:border-indigo-500/40 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-colors"
                  >
                    {idea.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Two-Pane Preview Area ─────────────────────────── */}
        <div className="flex-1 flex gap-4 p-4 overflow-hidden min-h-0">

          {/* LEFT: Your site now (Before) */}
          <div className="flex-1 flex flex-col min-w-0 rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            {/* Pane header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border shrink-0 bg-card">
              <div>
                <p className="text-xs font-semibold text-foreground">Your site now</p>
                <p className="text-[10px] text-muted-foreground">Live production view for comparison</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] h-5 px-2 bg-muted/40">Before</Badge>
                {!showPromptBar && activeTab === 'guided' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-[10px] px-2 gap-1 bg-card"
                    onClick={() => { setActiveTab('build'); setShowPromptBar(true); }}
                  >
                    <Wand2 className="w-3 h-3" /> Describe change
                  </Button>
                )}
              </div>
            </div>

            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 border-b border-border shrink-0">
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
              </div>
              <div className="flex-1 flex items-center gap-2 bg-card rounded-md px-2.5 h-6 border border-border">
                <Globe className="w-2.5 h-2.5 text-muted-foreground shrink-0" />
                <span className="text-[10px] text-muted-foreground truncate">{activeProject?.domain || 'your-site.com'}</span>
                <Badge variant="outline" className="ml-auto text-[9px] h-4 px-1.5">Before</Badge>
              </div>
            </div>

            {/* Live preview */}
            <div className="flex-1 min-h-0 overflow-hidden bg-white dark:bg-zinc-900 relative">
              <LiveSitePreview
                initialUrl={activeProject?.domain}
                title="Your Site"
              />
              {/* Guided overlay when no project */}
              {!activeProject && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/40 backdrop-blur-sm gap-3 px-6 text-center">
                  <Globe className="w-10 h-10 text-muted-foreground/50" />
                  <p className="text-sm font-medium text-muted-foreground">Select a project to see your live site</p>
                  <Button size="sm" variant="outline" onClick={() => navigate('/app')} className="gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Create or select project
                  </Button>
                </div>
              )}
            </div>

            {/* Guided workflow CTA for tab = guided */}
            {activeTab === 'guided' && (
              <div className="border-t border-border px-4 py-3 bg-card shrink-0">
                <button
                  onClick={() => { setActiveTab('build'); setShowPromptBar(true); }}
                  className="w-full flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                >
                  <span className="flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5" />
                    Step 2: Describe the change you want
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: Your site with changes (After) */}
          <div className="flex-1 flex flex-col min-w-0 rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            {/* Pane header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border shrink-0 bg-card">
              <div>
                <p className="text-xs font-semibold text-foreground">Your site with changes</p>
                <p className="text-[10px] text-muted-foreground">Safe AI preview before publish</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] h-5 px-2 bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20">After</Badge>
                {futureAppCode && !isGenerating && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-[10px] px-2 text-destructive hover:text-destructive"
                    onClick={handleDiscard}
                  >
                    <Trash2 className="w-3 h-3 mr-1" /> Discard
                  </Button>
                )}
              </div>
            </div>

            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 border-b border-border shrink-0">
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
              </div>
              <div className="flex-1 flex items-center gap-2 bg-card rounded-md px-2.5 h-6 border border-border">
                <Globe className="w-2.5 h-2.5 text-muted-foreground shrink-0" />
                <span className="text-[10px] text-muted-foreground truncate">{activeProject?.domain || 'your-site.com'}</span>
                <Badge variant="outline" className="ml-auto text-[9px] h-4 px-1.5 bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400">After</Badge>
              </div>
            </div>

            {/* Preview content */}
            <div className="flex-1 min-h-0 overflow-hidden bg-white dark:bg-zinc-900 relative">
              {isGenerating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/60 backdrop-blur-sm z-10 gap-4 px-8">
                  <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-medium text-secondary-foreground text-center animate-pulse">
                    {genProgress.step || 'Building your changes…'}
                  </p>
                  {genProgress.progress > 0 && (
                    <div className="w-full max-w-xs">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{genProgress.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${genProgress.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : futureAppCode ? (
                <VisualInspector htmlContent={futureAppCode} title="Your Preview" isPreview />
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-4 px-8 text-center bg-muted/5">
                  {activeTab === 'guided' ? (
                    <>
                      {/* Guided: show mini mock of "after" design */}
                      <div className="w-full max-w-[280px] rounded-xl border border-indigo-200 bg-indigo-600 dark:border-indigo-500/30 dark:bg-indigo-600/90 p-5 text-left shadow-lg">
                        <p className="text-[10px] font-semibold text-indigo-200 uppercase tracking-wide mb-2">AI website builder</p>
                        <h2 className="text-base font-bold text-white mb-1.5">Launch faster with a cleaner, smarter homepage</h2>
                        <p className="text-[10px] text-indigo-200/80 mb-4">Stronger hierarchy, clearer CTA focus, and a more premium visual style designed to increase confidence.</p>
                        <div className="flex gap-2">
                          <div className="h-7 px-3 rounded-md bg-white text-indigo-700 text-[10px] font-semibold flex items-center">Start free</div>
                          <div className="h-7 px-3 rounded-md bg-indigo-500/40 text-white text-[10px] font-semibold flex items-center">Book demo</div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground max-w-xs">
                        Describe what you want on the left, then your AI-generated preview will appear here.
                      </p>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-12 h-12 text-indigo-500/30" />
                      <p className="text-sm font-medium text-muted-foreground">
                        Describe a change above and hit Send.<br />Your preview will appear here.
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* Publish bar at bottom of after pane */}
              {futureAppCode && !isGenerating && (
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <div className="bg-card/95 backdrop-blur-md border border-indigo-500/30 rounded-xl p-3 shadow-2xl flex gap-2">
                    <Button variant="ghost" onClick={handleDiscard} className="text-muted-foreground hover:text-destructive flex-1 text-xs h-8">
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Discard
                    </Button>
                    <Button
                      onClick={() => setConfirmOpen(true)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 shadow-lg shadow-indigo-500/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Publish Changes Now
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────────── */}
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
              onClick={(e) => { e.preventDefault(); handlePushCode(); }}
              disabled={isPublishing}
              className="bg-indigo-600 hover:bg-indigo-700 gap-2 text-white"
            >
              {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
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

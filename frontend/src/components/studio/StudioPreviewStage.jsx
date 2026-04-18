import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VisualInspector } from '@/components/VisualInspector';
import { LiveSitePreview } from '@/components/LiveSitePreview';
import { Globe, Wand2, Plus, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/** Reusable fake browser chrome bar */
const BrowserChrome = ({ domain, badge, badgeClass = '' }) => (
  <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 border-b border-border shrink-0">
    <div className="flex gap-1">
      <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
      <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
    </div>
    <div className="flex-1 flex items-center gap-2 bg-card rounded-md px-2.5 h-6 border border-border">
      <Globe className="w-2.5 h-2.5 text-muted-foreground shrink-0" />
      <span className="text-[10px] text-muted-foreground truncate">{domain || 'your-site.com'}</span>
      <Badge variant="outline" className={`ml-auto text-[9px] h-4 px-1.5 ${badgeClass}`}>
        {badge}
      </Badge>
    </div>
  </div>
);

/**
 * StudioPreviewStage
 * The two-pane Before/After preview area inside Workspace Studio.
 * Left pane: live site (Before). Right pane: AI generated preview (After).
 */
export const StudioPreviewStage = ({
  activeProject,
  activeTab,
  isGenerating,
  genProgress,
  futureAppCode,
  onActivateBuild,
  onDiscard,
  onConfirmPublish,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex gap-4 p-4 overflow-hidden min-h-0">

      {/* ── LEFT: Before (your live site) ───────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 rounded-2xl border border-border bg-card overflow-hidden shadow-sm">

        {/* Pane header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border shrink-0 bg-card">
          <div>
            <p className="text-xs font-semibold text-foreground">Your site now</p>
            <p className="text-[10px] text-muted-foreground">Live production view for comparison</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] h-5 px-2 bg-muted/40">Before</Badge>
            {!isGenerating && activeTab === 'guided' && (
              <Button
                size="sm"
                variant="outline"
                className="h-6 text-[10px] px-2 gap-1 bg-card"
                onClick={onActivateBuild}
              >
                <Wand2 className="w-3 h-3" /> Describe change
              </Button>
            )}
          </div>
        </div>

        <BrowserChrome domain={activeProject?.domain} badge="Before" />

        {/* Live preview */}
        <div className="flex-1 min-h-0 overflow-hidden bg-white dark:bg-zinc-900 relative">
          <LiveSitePreview initialUrl={activeProject?.domain} title="Your Site" />

          {/* No-project overlay */}
          {!activeProject && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/40 backdrop-blur-sm gap-3 px-6 text-center">
              <Globe className="w-10 h-10 text-muted-foreground/50" />
              <p className="text-sm font-medium text-muted-foreground">Select a project to see your live site</p>
              <Button size="sm" variant="outline" onClick={() => navigate('/app/projects')} className="gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Create or select project
              </Button>
            </div>
          )}
        </div>

        {/* Guided CTA at bottom of Before pane */}
        {activeTab === 'guided' && (
          <div className="border-t border-border px-4 py-3 bg-card shrink-0">
            <button
              onClick={onActivateBuild}
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

      {/* ── RIGHT: After (AI generated preview) ─────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 rounded-2xl border border-border bg-card overflow-hidden shadow-sm">

        {/* Pane header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border shrink-0 bg-card">
          <div>
            <p className="text-xs font-semibold text-foreground">Your site with changes</p>
            <p className="text-[10px] text-muted-foreground">Safe AI preview before publish</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-[10px] h-5 px-2 bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20"
            >
              After
            </Badge>
            {futureAppCode && !isGenerating && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 text-[10px] px-2 text-destructive hover:text-destructive"
                onClick={onDiscard}
              >
                <Trash2 className="w-3 h-3 mr-1" /> Discard
              </Button>
            )}
          </div>
        </div>

        <BrowserChrome
          domain={activeProject?.domain}
          badge="After"
          badgeClass="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400"
        />

        {/* Preview content */}
        <div className="flex-1 min-h-0 overflow-hidden bg-white dark:bg-zinc-900 relative">

          {isGenerating ? (
            /* Generation progress */
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/60 backdrop-blur-sm z-10 gap-4 px-8">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-secondary-foreground text-center animate-pulse">
                {genProgress?.step || 'Building your changes…'}
              </p>
              {genProgress?.progress > 0 && (
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
            /* Show generated preview */
            <VisualInspector htmlContent={futureAppCode} title="Your Preview" isPreview />

          ) : (
            /* Empty state */
            <div className="h-full flex flex-col items-center justify-center gap-4 px-8 text-center bg-muted/5">
              {activeTab === 'guided' ? (
                <>
                  {/* Mini AI preview mock card */}
                  <div className="w-full max-w-[280px] rounded-xl border border-indigo-200 bg-indigo-600 dark:border-indigo-500/30 dark:bg-indigo-600/90 p-5 text-left shadow-lg">
                    <p className="text-[10px] font-semibold text-indigo-200 uppercase tracking-wide mb-2">
                      AI website builder
                    </p>
                    <h2 className="text-base font-bold text-white mb-1.5">
                      Launch faster with a cleaner, smarter homepage
                    </h2>
                    <p className="text-[10px] text-indigo-200/80 mb-4">
                      Stronger hierarchy, clearer CTA focus, and a more premium visual style.
                    </p>
                    <div className="flex gap-2">
                      <div className="h-7 px-3 rounded-md bg-white text-indigo-700 text-[10px] font-semibold flex items-center">
                        Start free
                      </div>
                      <div className="h-7 px-3 rounded-md bg-indigo-500/40 text-white text-[10px] font-semibold flex items-center">
                        Book demo
                      </div>
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

          {/* Floating Publish bar — overlays the after pane when preview is ready */}
          {futureAppCode && !isGenerating && (
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <div className="bg-card/95 backdrop-blur-md border border-indigo-500/30 rounded-xl p-3 shadow-2xl flex gap-2">
                <Button
                  variant="ghost"
                  onClick={onDiscard}
                  className="text-muted-foreground hover:text-destructive flex-1 text-xs h-8"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Discard
                </Button>
                <Button
                  onClick={onConfirmPublish}
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
  );
};

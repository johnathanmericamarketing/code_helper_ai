import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  ShieldCheck, Target, Server, ArrowLeft, ArrowRight, Check,
  Loader2, Sparkles, Info, ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { projectService } from '@/lib/project-service';
import { serversService } from '@/lib/firebase-service';

const PLATFORMS = [
  { id: 'wordpress', label: 'WordPress' },
  { id: 'shopify',   label: 'Shopify' },
  { id: 'webflow',   label: 'Webflow' },
  { id: 'wix',       label: 'Wix' },
  { id: 'squarespace', label: 'Squarespace' },
  { id: 'custom',    label: 'Custom / Coded by hand' },
  { id: 'other',     label: 'Other / Not sure' },
];

const BACKUP_HELP = {
  wordpress: 'Most WordPress hosts have a one-click backup in the host dashboard (Bluehost, SiteGround, etc.). Plugins like UpdraftPlus or Duplicator also work.',
  shopify:   'Shopify auto-backs-up your store. For theme safety, duplicate your current theme from Online Store → Themes → Actions → Duplicate.',
  webflow:   'Webflow keeps backups automatically. Go to Project Settings → Backups and create a named backup before making changes.',
  wix:       'Wix Editor: Site → Site History → Save Version. Name it something like "before AI changes".',
  squarespace: 'Squarespace keeps page history but not full-site backups. Duplicate pages you plan to change, or export your site (Settings → Advanced → Import/Export).',
  custom:    'Snapshot your files over SFTP/SSH and export your database. If the site is in Git, commit and tag the current version.',
  other:     'Check with your host or web person before we make changes. Having a backup means anything we do can be undone.',
};

const GOAL_CATEGORIES = [
  { id: 'design',  label: 'Look & feel (colors, fonts, spacing)' },
  { id: 'add',     label: 'Add something new (section, page, form)' },
  { id: 'fix',     label: 'Fix something broken' },
  { id: 'content', label: 'Content or SEO updates' },
  { id: 'speed',   label: 'Speed / performance' },
  { id: 'mobile',  label: 'Mobile / responsive fixes' },
];

const STEPS = [
  { id: 1, label: 'Backup', icon: ShieldCheck },
  { id: 2, label: 'Your goals', icon: Target },
  { id: 3, label: 'Where your site lives', icon: Server },
];

export const IntakeWizard = ({ open, onOpenChange, project, onComplete }) => {
  const existing = project?.intake || {};

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [servers, setServers] = useState([]);
  const [serversLoading, setServersLoading] = useState(false);

  const [backupHave, setBackupHave]   = useState(existing?.backup?.have ?? null); // 'yes'|'no'|null
  const [platform,   setPlatform]     = useState(existing?.backup?.platform || '');
  const [acknowledged, setAcknowledged] = useState(existing?.backup?.acknowledged || false);

  const [goalSummary, setGoalSummary] = useState(existing?.goals?.summary || '');
  const [goalCats,    setGoalCats]    = useState(existing?.goals?.categories || []);
  const [pages,       setPages]       = useState(existing?.goals?.pages || '');

  const [serverId,    setServerId]    = useState(existing?.connection?.serverId || '');

  useEffect(() => {
    if (!open) return;
    setStep(1);
    setServersLoading(true);
    serversService.list(project?.id)
      .then(setServers)
      .catch(() => setServers([]))
      .finally(() => setServersLoading(false));
  }, [open, project?.id]);

  const canAdvance = useMemo(() => {
    if (step === 1) return backupHave !== null && acknowledged;
    if (step === 2) return goalSummary.trim().length > 0;
    if (step === 3) return true;
    return false;
  }, [step, backupHave, acknowledged, goalSummary]);

  const toggleCat = (id) => {
    setGoalCats((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  };

  const handleFinish = async () => {
    if (!project?.id) return;
    setSaving(true);
    try {
      const intake = {
        backup: { have: backupHave, platform: platform || null, acknowledged },
        goals:  {
          summary: goalSummary.trim(),
          categories: goalCats,
          pages: pages.split(',').map((s) => s.trim()).filter(Boolean),
        },
        connection: { serverId: serverId || null },
      };
      await projectService.saveIntake(project.id, intake);
      toast.success('Site info saved. Notes are ready for future changes.');
      onComplete?.(intake);
      onOpenChange(false);
    } catch (e) {
      console.error(e);
      toast.error("We couldn't save your info. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto border-[var(--border-subtle)]"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-500)' }} />
            Let's set up this site
          </DialogTitle>
          <DialogDescription style={{ color: 'var(--text-muted)' }}>
            Three quick questions so we can make smart changes and keep notes for next time.
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center justify-between py-2">
          {STEPS.map((s, i) => {
            const active = s.id === step;
            const done   = s.id < step;
            const Icon = s.icon;
            return (
              <React.Fragment key={s.id}>
                <div
                  className="flex items-center gap-2"
                  style={{ color: active ? 'var(--accent-500)' : done ? 'var(--success-text)' : 'var(--text-muted)' }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center border-2"
                    style={{
                      borderColor: active ? 'var(--accent-500)' : done ? 'var(--success-text)' : 'var(--border-strong)',
                      backgroundColor: active ? 'rgba(139,92,246,0.1)' : done ? 'rgba(52,211,153,0.1)' : 'transparent',
                    }}
                  >
                    {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-semibold hidden sm:inline">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="flex-1 h-[2px] mx-2"
                    style={{ backgroundColor: done ? 'var(--success-text)' : 'var(--border-strong)' }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step 1 — Backup */}
        {step === 1 && (
          <div className="space-y-4 py-2">
            <div>
              <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <ShieldCheck className="w-4 h-4" style={{ color: 'var(--accent-500)' }}/> Have you made a backup of your site?
              </h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>A backup means we can undo anything if something doesn't look right.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBackupHave('yes')}
                className="rounded-xl p-4 text-left transition-all border"
                style={{
                  borderColor: backupHave === 'yes' ? 'var(--accent-500)' : 'var(--border-subtle)',
                  backgroundColor: backupHave === 'yes' ? 'rgba(139,92,246,0.1)' : 'var(--bg-app)',
                }}
              >
                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>Yes, I have one</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Great — we're good to go.</div>
              </button>
              <button
                type="button"
                onClick={() => setBackupHave('no')}
                className="rounded-xl p-4 text-left transition-all border"
                style={{
                  borderColor: backupHave === 'no' ? 'var(--accent-500)' : 'var(--border-subtle)',
                  backgroundColor: backupHave === 'no' ? 'rgba(139,92,246,0.1)' : 'var(--bg-app)',
                }}
              >
                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>No, not yet</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>We'll show you how.</div>
              </button>
            </div>

            {backupHave === 'no' && (
              <div className="space-y-3 pt-2">
                <div>
                  <Label htmlFor="platform" className="text-sm" style={{ color: 'var(--text-secondary)' }}>What kind of site is it?</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger
                      id="platform"
                      className="mt-1 border-[var(--border-subtle)] rounded-[var(--radius-button)]"
                      style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}
                    >
                      <SelectValue placeholder="Pick the closest match" />
                    </SelectTrigger>
                    <SelectContent
                      className="border-[var(--border-subtle)]"
                      style={{ backgroundColor: 'var(--bg-surface)' }}
                    >
                      {PLATFORMS.map((p) => (
                        <SelectItem
                          key={p.id}
                          value={p.id}
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {platform && (
                  <Alert
                    className="rounded-xl border"
                    style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-subtle)' }}
                  >
                    <Info className="w-4 h-4" style={{ color: 'var(--accent-500)' }} />
                    <AlertTitle style={{ color: 'var(--text-primary)' }}>How to back up your {PLATFORMS.find((p) => p.id === platform)?.label} site</AlertTitle>
                    <AlertDescription style={{ color: 'var(--text-muted)' }}>{BACKUP_HELP[platform]}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            <label
              className="flex items-start gap-3 p-3 rounded-xl cursor-pointer border transition-colors"
              style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-app)' }}
            >
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mt-0.5 h-4 w-4"
                style={{ accentColor: 'var(--accent-500)' }}
              />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                I understand that publishing changes will update my live site, and I've taken (or am OK proceeding without) a backup.
              </span>
            </label>
          </div>
        )}

        {/* Step 2 — Goals */}
        {step === 2 && (
          <div className="space-y-4 py-2">
            <div>
              <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Target className="w-4 h-4" style={{ color: 'var(--accent-500)' }}/> What do you want to change?
              </h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Plain English is fine. We'll use this to plan the work.</p>
            </div>

            <Textarea
              value={goalSummary}
              onChange={(e) => setGoalSummary(e.target.value)}
              placeholder="For example: Make the homepage look more modern, add a contact form on the About page, and change the header to dark blue."
              className="min-h-[110px] border-[var(--border-subtle)] rounded-[var(--radius-button)] resize-none"
              style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', caretColor: 'var(--accent-500)' }}
            />

            <div className="space-y-2">
              <Label className="text-sm" style={{ color: 'var(--text-secondary)' }}>Anything specific you're focused on? <span style={{ color: 'var(--text-muted)' }}>(optional)</span></Label>
              <div className="flex flex-wrap gap-2">
                {GOAL_CATEGORIES.map((cat) => {
                  const picked = goalCats.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCat(cat.id)}
                      className="text-xs px-3 py-1.5 rounded-full border transition-all"
                      style={{
                        borderColor: picked ? 'var(--accent-500)' : 'var(--border-subtle)',
                        backgroundColor: picked ? 'var(--accent-600)' : 'var(--bg-app)',
                        color: picked ? '#fff' : 'var(--text-secondary)',
                      }}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pages" className="text-sm" style={{ color: 'var(--text-secondary)' }}>Specific pages to focus on? <span style={{ color: 'var(--text-muted)' }}>(optional)</span></Label>
              <Input
                id="pages"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="e.g. homepage, about, /contact"
                className="border-[var(--border-subtle)] rounded-[var(--radius-button)]"
                style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}
              />
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Separate with commas. Leave blank if unsure.</p>
            </div>
          </div>
        )}

        {/* Step 3 — Connection */}
        {step === 3 && (
          <div className="space-y-4 py-2">
            <div>
              <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Server className="w-4 h-4" style={{ color: 'var(--accent-500)' }}/> Where does your site live?
              </h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Pick the server we should connect to for making changes. You only set this up once per site.
              </p>
            </div>

            {serversLoading ? (
              <div className="flex items-center gap-2 text-sm py-4" style={{ color: 'var(--text-muted)' }}>
                <Loader2 className="w-4 h-4 animate-spin"/> Loading your servers…
              </div>
            ) : servers.length > 0 ? (
              <div className="space-y-2">
                <Label className="text-sm" style={{ color: 'var(--text-secondary)' }}>Connect to:</Label>
                <Select value={serverId || 'none'} onValueChange={(v) => setServerId(v === 'none' ? '' : v)}>
                  <SelectTrigger
                    className="border-[var(--border-subtle)] rounded-[var(--radius-button)]"
                    style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}
                  >
                    <SelectValue placeholder="Pick a server" />
                  </SelectTrigger>
                  <SelectContent
                    className="border-[var(--border-subtle)]"
                    style={{ backgroundColor: 'var(--bg-surface)' }}
                  >
                    <SelectItem value="none" style={{ color: 'var(--text-primary)' }}>I'll connect later</SelectItem>
                    {servers.map((s) => (
                      <SelectItem key={s.id} value={s.id} style={{ color: 'var(--text-primary)' }}>
                        {s.name} <span style={{ color: 'var(--text-muted)' }}>· {s.server_type?.toUpperCase()} · {s.host}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Need to add a new server?{' '}
                  <Link to="/app/connections" className="underline inline-flex items-center gap-1" style={{ color: 'var(--accent-500)' }}>
                    Manage connections <ExternalLink className="w-3 h-3"/>
                  </Link>
                </p>
              </div>
            ) : (
              <Alert
                className="rounded-xl border"
                style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-subtle)' }}
              >
                <Server className="w-4 h-4" style={{ color: 'var(--accent-500)' }} />
                <AlertTitle style={{ color: 'var(--text-primary)' }}>No servers set up yet</AlertTitle>
                <AlertDescription style={{ color: 'var(--text-muted)' }}>
                  You can skip this for now and still use the preview. When you're ready to publish changes to your live site, add a connection in{' '}
                  <Link to="/app/connections" className="underline font-medium" style={{ color: 'var(--accent-500)' }}>Connections</Link>.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <DialogFooter
          className="flex justify-between sm:justify-between gap-2 border-t pt-4"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1 || saving}
            className="gap-1 rounded-[var(--radius-button)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft className="w-4 h-4"/> Back
          </Button>

          {step < STEPS.length ? (
            <Button
              type="button"
              onClick={() => setStep((s) => Math.min(STEPS.length, s + 1))}
              disabled={!canAdvance}
              className="gap-1 rounded-[var(--radius-button)] text-white"
              style={{ backgroundColor: 'var(--accent-600)' }}
            >
              Next <ArrowRight className="w-4 h-4"/>
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleFinish}
              disabled={saving}
              className="gap-1 rounded-[var(--radius-button)] text-white"
              style={{ backgroundColor: 'var(--accent-600)' }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Check className="w-4 h-4"/>}
              {saving ? 'Saving…' : 'Save & start'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

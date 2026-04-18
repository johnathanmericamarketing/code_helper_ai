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
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Let's set up this site
          </DialogTitle>
          <DialogDescription>
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
                <div className={`flex items-center gap-2 ${active ? 'text-primary' : done ? 'text-success' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${active ? 'border-primary bg-primary/10' : done ? 'border-success bg-success/10' : 'border-muted'}`}>
                    {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-semibold hidden sm:inline">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`flex-1 h-[2px] mx-2 ${done ? 'bg-success' : 'bg-muted'}`} />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step 1 — Backup */}
        {step === 1 && (
          <div className="space-y-4 py-2">
            <div>
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary"/> Have you made a backup of your site?
              </h3>
              <p className="text-sm text-muted-foreground mt-1">A backup means we can undo anything if something doesn't look right.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBackupHave('yes')}
                className={`border rounded-lg p-4 text-left transition-colors ${backupHave === 'yes' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
              >
                <div className="font-semibold">Yes, I have one</div>
                <div className="text-xs text-muted-foreground mt-1">Great — we're good to go.</div>
              </button>
              <button
                type="button"
                onClick={() => setBackupHave('no')}
                className={`border rounded-lg p-4 text-left transition-colors ${backupHave === 'no' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
              >
                <div className="font-semibold">No, not yet</div>
                <div className="text-xs text-muted-foreground mt-1">We'll show you how.</div>
              </button>
            </div>

            {backupHave === 'no' && (
              <div className="space-y-3 pt-2">
                <div>
                  <Label htmlFor="platform" className="text-sm">What kind of site is it?</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger id="platform" className="mt-1">
                      <SelectValue placeholder="Pick the closest match" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLATFORMS.map((p) => <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {platform && (
                  <Alert>
                    <Info className="w-4 h-4" />
                    <AlertTitle>How to back up your {PLATFORMS.find((p) => p.id === platform)?.label} site</AlertTitle>
                    <AlertDescription>{BACKUP_HELP[platform]}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            <label className="flex items-start gap-3 p-3 border border-border rounded-md cursor-pointer hover:bg-muted/40">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-primary"
              />
              <span className="text-sm">
                I understand that publishing changes will update my live site, and I've taken (or am OK proceeding without) a backup.
              </span>
            </label>
          </div>
        )}

        {/* Step 2 — Goals */}
        {step === 2 && (
          <div className="space-y-4 py-2">
            <div>
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Target className="w-4 h-4 text-primary"/> What do you want to change?
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Plain English is fine. We'll use this to plan the work.</p>
            </div>

            <Textarea
              value={goalSummary}
              onChange={(e) => setGoalSummary(e.target.value)}
              placeholder="For example: Make the homepage look more modern, add a contact form on the About page, and change the header to dark blue."
              className="min-h-[110px]"
            />

            <div className="space-y-2">
              <Label className="text-sm">Anything specific you're focused on? (optional)</Label>
              <div className="flex flex-wrap gap-2">
                {GOAL_CATEGORIES.map((cat) => {
                  const picked = goalCats.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCat(cat.id)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${picked ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:border-primary/50'}`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pages" className="text-sm">Specific pages to focus on? (optional)</Label>
              <Input
                id="pages"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="e.g. homepage, about, /contact"
              />
              <p className="text-[11px] text-muted-foreground">Separate with commas. Leave blank if unsure.</p>
            </div>
          </div>
        )}

        {/* Step 3 — Connection */}
        {step === 3 && (
          <div className="space-y-4 py-2">
            <div>
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Server className="w-4 h-4 text-primary"/> Where does your site live?
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Pick the server we should connect to for making changes. You only set this up once per site.
              </p>
            </div>

            {serversLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
                <Loader2 className="w-4 h-4 animate-spin"/> Loading your servers…
              </div>
            ) : servers.length > 0 ? (
              <div className="space-y-2">
                <Label className="text-sm">Connect to:</Label>
                <Select value={serverId || 'none'} onValueChange={(v) => setServerId(v === 'none' ? '' : v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pick a server" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">I'll connect later</SelectItem>
                    {servers.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} <span className="text-muted-foreground text-xs">· {s.server_type?.toUpperCase()} · {s.host}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  Need to add a new server?{' '}
                  <Link to="/app/servers" className="underline text-primary inline-flex items-center gap-1">
                    Manage servers <ExternalLink className="w-3 h-3"/>
                  </Link>
                </p>
              </div>
            ) : (
              <Alert>
                <Server className="w-4 h-4" />
                <AlertTitle>No servers set up yet</AlertTitle>
                <AlertDescription>
                  You can skip this for now and still use the preview. When you're ready to publish changes to your live site, add a connection in{' '}
                  <Link to="/app/servers" className="underline font-medium">Servers</Link>.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <DialogFooter className="flex justify-between sm:justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1 || saving}
            className="gap-1"
          >
            <ArrowLeft className="w-4 h-4"/> Back
          </Button>

          {step < STEPS.length ? (
            <Button
              type="button"
              onClick={() => setStep((s) => Math.min(STEPS.length, s + 1))}
              disabled={!canAdvance}
              className="gap-1"
            >
              Next <ArrowRight className="w-4 h-4"/>
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleFinish}
              disabled={saving}
              className="gap-1 bg-gradient-to-r from-primary to-blue-600"
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

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { projectService } from '@/lib/project-service';
import { useProject } from '@/context/ProjectContext';

export const ProjectSetupWizard = ({ open, onOpenChange, onCreated }) => {
  const { refreshProjects } = useProject();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    domain: '',
    siteNotes: '',
    status: 'draft',
  });

  const update = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const handleCreate = async () => {
    if (!form.name.trim()) { toast.error('Please enter a project name.'); return; }
    setSaving(true);
    try {
      const project = await projectService.create({
        name: form.name.trim(),
        domain: form.domain.trim(),
        siteNotes: form.siteNotes.trim(),
        status: 'draft',
      });
      await refreshProjects?.();
      toast.success(`"${project.name}" created!`);
      onCreated?.(project);
      onOpenChange(false);
      // reset
      setForm({ name: '', domain: '', siteNotes: '', status: 'draft' });
      setStep(1);
    } catch (err) {
      console.error(err);
      toast.error('Could not create project. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md border-[var(--border-subtle)]"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[var(--text-primary)]">
            <Wand2 className="w-5 h-5 text-[var(--accent-500)]" />
            New Project
          </DialogTitle>
          <DialogDescription className="text-[var(--text-muted)]">
            Set up your project in seconds. You can always edit details later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Step 1: Name + domain */}
          {step === 1 && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="proj-name" className="text-sm text-[var(--text-secondary)]">Project Name *</Label>
                <Input
                  id="proj-name"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="My Awesome Website"
                  className="border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-primary)] rounded-[var(--radius-button)]"
                  onKeyDown={e => { if (e.key === 'Enter' && form.name.trim()) setStep(2); }}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="proj-domain" className="text-sm text-[var(--text-secondary)]">Website URL <span className="text-[var(--text-muted)] font-normal">(optional)</span></Label>
                <Input
                  id="proj-domain"
                  value={form.domain}
                  onChange={e => update('domain', e.target.value)}
                  placeholder="https://example.com"
                  className="border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-primary)] rounded-[var(--radius-button)]"
                />
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!form.name.trim()}
                className="w-full rounded-[var(--radius-button)] text-white"
                style={{ backgroundColor: 'var(--accent-600)' }}
              >
                Continue →
              </Button>
            </>
          )}

          {/* Step 2: Notes */}
          {step === 2 && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="proj-notes" className="text-sm text-[var(--text-secondary)]">
                  Tell us about your site <span className="text-[var(--text-muted)] font-normal">(optional)</span>
                </Label>
                <Textarea
                  id="proj-notes"
                  value={form.siteNotes}
                  onChange={e => update('siteNotes', e.target.value)}
                  placeholder="e.g. A local bakery website. Cozy aesthetic, warm colours, needs online ordering."
                  className="min-h-[100px] resize-none border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-primary)] rounded-[var(--radius-button)]"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-[var(--radius-button)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"
                  disabled={saving}
                >
                  ← Back
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={saving}
                  className="flex-1 gap-2 rounded-[var(--radius-button)] text-white"
                  style={{ backgroundColor: 'var(--accent-600)' }}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  {saving ? 'Creating…' : 'Create Project'}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

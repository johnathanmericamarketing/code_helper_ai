import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Folder, Plus } from 'lucide-react';

export const ProjectSetupWizard = ({ onCreate, onCancel, creating }) => {
  const [newProject, setNewProject] = useState({ name: '', domain: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;
    onCreate(newProject);
  };

  return (
    <div className="max-w-xl mx-auto w-full fade-in">
      <div className="bg-surface border border-strong rounded-[var(--radius-card)] shadow-lg overflow-hidden">
        <div className="bg-[var(--accent-50)] px-6 py-5 border-b border-subtle">
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-[var(--accent-600)]" />
            <h2 className="font-bold text-primary-custom text-lg">Create New Project</h2>
          </div>
          <p className="text-sm text-muted-custom mt-1">
            Everything is isolated per project: brand kit, servers, and code requests.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-surface">
          <div className="space-y-2">
            <Label htmlFor="proj-name" className="text-sm font-semibold text-primary-custom">Project Name *</Label>
            <Input
              id="proj-name"
              value={newProject.name}
              onChange={e => setNewProject({ ...newProject, name: e.target.value })}
              placeholder="e.g. Mellow Facial Treatments"
              className="h-11 border-subtle rounded-[var(--radius-button)] focus-visible:ring-[var(--accent-500)] bg-app"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="proj-domain" className="text-sm font-semibold text-primary-custom">Primary Domain</Label>
            <Input
              id="proj-domain"
              value={newProject.domain}
              onChange={e => setNewProject({ ...newProject, domain: e.target.value })}
              placeholder="e.g. https://mellowfacial.com"
              className="h-11 border-subtle rounded-[var(--radius-button)] focus-visible:ring-[var(--accent-500)] bg-app"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="proj-desc" className="text-sm font-semibold text-primary-custom">Description</Label>
            <Textarea
              id="proj-desc"
              value={newProject.description}
              onChange={e => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="What is this project about?"
              className="resize-none border-subtle rounded-[var(--radius-button)] focus-visible:ring-[var(--accent-500)] bg-app"
              rows={3}
            />
          </div>
          
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-subtle mt-6">
            {onCancel && (
              <Button type="button" variant="ghost" onClick={onCancel} className="text-secondary-custom rounded-[var(--radius-button)]">
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={creating || !newProject.name.trim()}
              className="ml-auto gap-2 bg-[var(--accent-600)] hover:bg-[var(--accent-700)] text-white shadow-md rounded-[var(--radius-button)] px-6"
            >
              {creating ? (
                <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {creating ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

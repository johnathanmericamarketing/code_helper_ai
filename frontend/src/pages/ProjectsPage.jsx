import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderKanban, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { ProjectGrid }       from '@/components/projects/ProjectGrid';
import { ProjectSetupWizard } from '@/components/projects/ProjectSetupWizard';
import { useProject }         from '@/context/ProjectContext';
import { projectService }     from '@/lib/project-service';

export const ProjectsPage = () => {
  const navigate = useNavigate();
  const { projects, loading, selectProject, refreshProjects } = useProject();
  const [wizardOpen, setWizardOpen] = useState(false);

  const handleSelect = (project) => {
    selectProject(project);
  };

  const handleCreated = (project) => {
    selectProject(project);
    navigate('/app/studio');
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    try {
      await projectService.delete(project.id);
      await refreshProjects();
      toast.success(`"${project.name}" deleted.`);
    } catch {
      toast.error('Could not delete project.');
    }
  };

  return (
    <div className="space-y-8 fade-in pb-12">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Projects
          </h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            Select a project to open Studio, or create a new one.
          </p>
        </div>

        <Button
          onClick={() => setWizardOpen(true)}
          className="gap-2 rounded-[var(--radius-button)] text-white self-start sm:self-auto"
          style={{ backgroundColor: 'var(--accent-600)' }}
        >
          <Plus className="w-4 h-4" /> New Project
        </Button>
      </div>

      {/* States */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-[var(--text-muted)]">
          <Loader2 className="w-6 h-6 animate-spin mr-3" /> Loading projects…
        </div>
      ) : projects.length === 0 ? (
        <div
          className="rounded-[var(--radius-card)] border border-dashed p-16 text-center"
          style={{ borderColor: 'var(--border-strong)', backgroundColor: 'var(--bg-surface)' }}
        >
          <FolderKanban className="w-12 h-12 mx-auto mb-4 opacity-40" style={{ color: 'var(--text-muted)' }} />
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No projects yet</h3>
          <p className="text-sm text-[var(--text-muted)] mb-6 max-w-sm mx-auto">
            Create your first project to start building with the AI Studio.
          </p>
          <Button
            onClick={() => setWizardOpen(true)}
            className="gap-2 rounded-[var(--radius-button)] text-white"
            style={{ backgroundColor: 'var(--accent-600)' }}
          >
            <Plus className="w-4 h-4" /> Create First Project
          </Button>
        </div>
      ) : (
        <ProjectGrid
          projects={projects}
          onSelect={handleSelect}
          onDelete={handleDelete}
        />
      )}

      <ProjectSetupWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        onCreated={handleCreated}
      />
    </div>
  );
};

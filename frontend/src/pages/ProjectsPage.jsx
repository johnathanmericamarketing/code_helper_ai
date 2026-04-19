import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, LayoutDashboard } from 'lucide-react';
import { projectService } from '@/lib/project-service';
import { useProject } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { ProjectSetupWizard } from '@/components/projects/ProjectSetupWizard';

export const ProjectsPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { projects, refreshProjects, selectProject } = useProject();
  
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleCreateProject = async (newProjectData) => {
    setCreating(true);
    try {
      const proj = await projectService.create({
        name: newProjectData.name,
        domain: newProjectData.domain,
        description: newProjectData.description,
      });
      toast.success('Project created successfully!');
      setShowProjectForm(false);
      await refreshProjects();
      selectProject(proj);
      navigate('/app/studio');
    } catch (e) {
      toast.error('Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const handleSelectProject = (project) => {
    selectProject(project);
    // Let the card decide where to route (Studio vs Versions), 
    // but if clicked generally, we update active project.
  };

  // ─── VIEW: EMPTY OR CREATE NEW ───────────────────────────────────────
  if (projects.length === 0 || showProjectForm) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 fade-in max-w-4xl mx-auto">
        <div className="text-center space-y-3 mb-8">
          <div className="mx-auto w-16 h-16 rounded-[var(--radius-button)] bg-[var(--accent-100)] flex items-center justify-center mb-6">
            <LayoutDashboard className="w-8 h-8 text-[var(--accent-600)]" />
          </div>
          <h1 className="text-3xl font-bold text-primary-custom tracking-tight">
            Welcome, {currentUser?.displayName?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-muted-custom text-base max-w-md mx-auto">
            Create your first project to unlock the full workspace and AI studio features.
          </p>
        </div>
        
        <ProjectSetupWizard 
          onCreate={handleCreateProject} 
          onCancel={projects.length > 0 ? () => setShowProjectForm(false) : null}
          creating={creating}
        />
      </div>
    );
  }

  // ─── VIEW: ACTIVE PROJECT GRID ────────────────────────────────────────
  return (
    <div className="space-y-8 fade-in max-w-7xl mx-auto">
      
      {/* Page Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary-custom tracking-tight">Projects</h1>
          <p className="text-muted-custom text-sm md:text-base mt-1 max-w-xl">
            Each project keeps its own website, brand rules, versions, and deployment settings.
          </p>
        </div>
        <Button 
          onClick={() => setShowProjectForm(true)}
          className="gap-2 bg-[var(--accent-600)] hover:bg-[var(--accent-700)] text-white shadow-sm rounded-[var(--radius-button)]"
        >
          <Plus className="w-4 h-4" /> New project
        </Button>
      </div>

      {/* Project Grid */}
      <ProjectGrid 
        projects={projects} 
        onSelectProject={handleSelectProject} 
      />

    </div>
  );
};

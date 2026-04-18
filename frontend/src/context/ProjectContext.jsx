import React, { createContext, useContext, useState, useEffect } from 'react';
import { projectService } from '@/lib/project-service';
import { useAuth } from '@/context/AuthContext';

const ProjectContext = createContext(null);

export const useProject = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load projects on sign-in; refreshProjects is stable so we intentionally exclude it.
  useEffect(() => {
    if (currentUser) {
      refreshProjects();
    } else {
      setProjects([]);
      setActiveProject(null);
      setLoading(false);
    }
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  const refreshProjects = async () => {
    setLoading(true);
    try {
      const p = await projectService.list();
      setProjects(p);
      // Automatically select the first project if none is selected
      if (p.length > 0 && !activeProject) {
        // Try restoring from local storage
        const savedId = localStorage.getItem('codehelper_active_project');
        if (savedId) {
          const matched = p.find(proj => proj.id === savedId);
          if (matched) setActiveProject(matched);
          else setActiveProject(p[0]);
        } else {
          setActiveProject(p[0]);
        }
      } else if (p.length === 0) {
        setActiveProject(null);
      }
    } catch (e) {
      console.error("Failed to load projects", e);
    } finally {
      setLoading(false);
    }
  };

  const selectProject = (project) => {
    setActiveProject(project);
    if (project) {
      localStorage.setItem('codehelper_active_project', project.id);
    } else {
      localStorage.removeItem('codehelper_active_project');
    }
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      activeProject,
      selectProject,
      refreshProjects,
      loading
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

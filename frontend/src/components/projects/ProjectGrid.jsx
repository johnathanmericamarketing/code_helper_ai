import React from 'react';
import { ProjectCard } from './ProjectCard';

export const ProjectGrid = ({ projects, onSelectProject }) => {
  if (!projects || projects.length === 0) {
    return null; // Handled by parent empty state
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          onSelect={onSelectProject} 
        />
      ))}
    </div>
  );
};

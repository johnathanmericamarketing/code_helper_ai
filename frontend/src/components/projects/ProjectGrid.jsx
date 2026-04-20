import React from 'react';
import { ProjectCard } from './ProjectCard';

export const ProjectGrid = ({ projects, onSelect, onDelete }) => {
  if (!projects?.length) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map(p => (
        <ProjectCard
          key={p.id}
          project={p}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

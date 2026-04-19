import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, Zap, History, Settings2, Globe, Paintbrush, CircleDashed } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ProjectCard = ({ project, onSelect }) => {
  const navigate = useNavigate();

  // Compute status badges based on project data
  const hasBrand = Boolean(project.brand?.colors || project.brand?.tone);
  const isConnected = Boolean(project.domain);

  const handleOpenStudio = (e) => {
    e.stopPropagation();
    onSelect(project);
    navigate('/app/studio');
  };

  const handleViewVersions = (e) => {
    e.stopPropagation();
    onSelect(project);
    navigate('/app/versions');
  };

  return (
    <div 
      className="group bg-surface border border-subtle rounded-[var(--radius-card)] p-6 hover:shadow-md hover:border-[var(--accent-200)] transition-all cursor-pointer flex flex-col h-full relative overflow-hidden"
      onClick={() => onSelect(project)}
    >
      {/* Subtle hover gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-500)]/0 rounded-full blur-3xl group-hover:bg-[var(--accent-500)]/5 transition-colors pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[var(--radius-button)] bg-[var(--accent-100)] flex items-center justify-center shrink-0 text-[var(--accent-700)]">
            <span className="text-xl font-bold">{project.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h3 className="font-bold text-primary-custom text-lg leading-tight group-hover:text-[var(--accent-600)] transition-colors">{project.name}</h3>
            {project.domain && (
              <a 
                href={project.domain.startsWith('http') ? project.domain : `https://${project.domain}`}
                target="_blank" rel="noreferrer"
                className="text-xs text-muted-custom flex items-center gap-1 mt-1 hover:text-[var(--accent-600)]"
                onClick={e => e.stopPropagation()}
              >
                <Globe className="w-3 h-3" /> {project.domain}
              </a>
            )}
          </div>
        </div>
      </div>

      <p className="text-sm text-secondary-custom line-clamp-2 mb-6 flex-1">
        {project.description || 'No description provided.'}
      </p>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        {hasBrand ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--success-bg)] text-[var(--success-text)] text-[10px] font-semibold tracking-wide">
            <Paintbrush className="w-3 h-3" /> Brand Ready
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--warning-bg)] text-[var(--warning-text)] text-[10px] font-semibold tracking-wide">
            <CircleDashed className="w-3 h-3" /> Needs Brand Setup
          </span>
        )}

        {isConnected ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--info-bg)] text-[var(--info-text)] text-[10px] font-semibold tracking-wide">
            <Globe className="w-3 h-3" /> Connected
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--muted)] text-[var(--text-muted)] text-[10px] font-semibold tracking-wide">
            <Globe className="w-3 h-3" /> Needs Connection
          </span>
        )}
      </div>

      {/* Action Row */}
      <div className="flex items-center gap-2 pt-4 border-t border-subtle">
        <Button 
          onClick={handleOpenStudio}
          className="flex-1 gap-2 bg-[var(--accent-600)] hover:bg-[var(--accent-700)] text-white shadow-sm rounded-[var(--radius-button)]"
        >
          <Zap className="w-4 h-4" /> Open Studio
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleViewVersions}
          className="shrink-0 rounded-[var(--radius-button)] border-subtle hover:bg-muted-custom"
          title="View Versions"
        >
          <History className="w-4 h-4 text-secondary-custom" />
        </Button>
      </div>
    </div>
  );
};

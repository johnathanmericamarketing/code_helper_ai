import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Wand2, MoreVertical, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const STATUS_STYLES = {
  active:   { dot: 'bg-[var(--success-text)]', badge: 'bg-[var(--success-bg)] text-[var(--success-text)]', label: 'Active' },
  draft:    { dot: 'bg-[var(--warning-text)]',  badge: 'bg-[var(--warning-bg)]  text-[var(--warning-text)]',  label: 'Draft'  },
  archived: { dot: 'bg-[var(--text-muted)]',    badge: 'bg-[var(--bg-muted)]    text-[var(--text-muted)]',    label: 'Archived' },
};

export const ProjectCard = ({ project, onSelect, onDelete }) => {
  const navigate = useNavigate();
  const status   = project.status || 'draft';
  const style    = STATUS_STYLES[status] ?? STATUS_STYLES.draft;

  const handleOpenStudio = (e) => {
    e.stopPropagation();
    onSelect(project);
    navigate('/app/studio');
  };

  return (
    <div
      onClick={() => onSelect(project)}
      className="group relative rounded-[var(--radius-card)] border cursor-pointer transition-all duration-200 hover:border-[var(--accent-500)] hover:shadow-lg overflow-hidden"
      style={{
        backgroundColor:  'var(--bg-surface)',
        borderColor:      'var(--border-subtle)',
      }}
    >
      {/* Accent top bar */}
      <div
        className="h-1 w-full transition-all duration-200 group-hover:h-1.5"
        style={{ background: 'linear-gradient(90deg, var(--accent-600), var(--accent-500))' }}
      />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[var(--text-primary)] text-base truncate">
              {project.name || 'Untitled Project'}
            </h3>
            {project.domain && (
              <a
                href={project.domain.startsWith('http') ? project.domain : `https://${project.domain}`}
                target="_blank"
                rel="noreferrer"
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--accent-500)] mt-0.5 transition-colors truncate max-w-[180px]"
              >
                <ExternalLink className="w-3 h-3 shrink-0" />
                {project.domain}
              </a>
            )}
          </div>

          {/* Status badge */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${style.badge}`}>
            <Circle className={`w-1.5 h-1.5 fill-current ${style.dot}`} />
            {style.label}
          </span>
        </div>

        {/* Description / notes */}
        {project.siteNotes && (
          <p className="text-xs text-[var(--text-muted)] mb-4 line-clamp-2 leading-relaxed">
            {project.siteNotes}
          </p>
        )}

        {/* Footer row */}
        <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <Button
            size="sm"
            onClick={handleOpenStudio}
            className="gap-1.5 text-xs h-8 rounded-[var(--radius-button)] text-white"
            style={{ backgroundColor: 'var(--accent-600)' }}
          >
            <Wand2 className="w-3.5 h-3.5" /> Open Studio
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="border-[var(--border-subtle)]"
              style={{ backgroundColor: 'var(--bg-surface)' }}
            >
              <DropdownMenuItem
                onClick={e => { e.stopPropagation(); onSelect(project); navigate('/app/studio'); }}
                className="text-[var(--text-primary)] hover:bg-[var(--bg-muted)] cursor-pointer"
              >
                Open Studio
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={e => { e.stopPropagation(); onDelete?.(project); }}
                className="text-[var(--danger-text)] hover:bg-[var(--danger-bg)] cursor-pointer"
              >
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

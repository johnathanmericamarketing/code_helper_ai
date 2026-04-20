import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useProject } from '@/context/ProjectContext';
import {
  FolderKanban,
  Wand2,
  Palette,
  GitBranch,
  Link2,
  ImagePlus,
  Settings,
  ChevronRight,
  ChevronLeft,
  Zap,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const NAV_ITEMS = [
  { to: '/app/projects',    label: 'Projects',     icon: FolderKanban },
  { to: '/app/studio',      label: 'Studio',        icon: Wand2 },
  { to: '/app/brand',       label: 'Brand',         icon: Palette },
  { to: '/app/versions',    label: 'Versions',      icon: GitBranch },
  { to: '/app/connections', label: 'Connections',   icon: Link2 },
  { to: '/app/assets',      label: 'Assets',        icon: ImagePlus },
];

const NavItem = ({ item, expanded }) => {
  const Icon = item.icon;
  const location = useLocation();
  const isActive = location.pathname.startsWith(item.to);

  const content = (
    <NavLink
      to={item.to}
      className={({ isActive: navActive }) =>
        [
          'flex items-center gap-3 rounded-xl transition-all duration-150 select-none cursor-pointer',
          expanded ? 'w-full px-3 py-2.5' : 'w-10 h-10 justify-center',
          (navActive || isActive)
            ? 'bg-[var(--accent-50)] text-[var(--accent-500)] font-semibold'
            : 'text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]',
        ].join(' ')
      }
    >
      <Icon className="w-5 h-5 shrink-0" />
      {expanded && (
        <span className="text-sm whitespace-nowrap overflow-hidden transition-all">
          {item.label}
        </span>
      )}
    </NavLink>
  );

  if (expanded) return content;

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent side="right" className="bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-subtle)]">
        {item.label}
      </TooltipContent>
    </Tooltip>
  );
};

export const AppSidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const { activeProject } = useProject();

  return (
    <TooltipProvider>
      <aside
        className="hidden md:flex flex-col h-full shrink-0 overflow-hidden transition-all duration-200"
        style={{
          width: expanded ? '220px' : '64px',
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-subtle)',
        }}
      >
        {/* Logo / Brand mark */}
        <div
          className={[
            'flex items-center shrink-0 mb-4 transition-all duration-200',
            expanded ? 'px-4 pt-5 pb-2 gap-2' : 'justify-center px-0 pt-5 pb-2',
          ].join(' ')}
        >
          <div className="w-8 h-8 rounded-xl bg-[var(--accent-600)] flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          {expanded && (
            <span className="text-sm font-bold text-[var(--text-primary)] whitespace-nowrap">
              Code Helper
            </span>
          )}
        </div>

        {/* Active project pill */}
        {activeProject && (
          <div
            className={[
              'mx-auto mb-4 transition-all duration-200 shrink-0',
              expanded
                ? 'w-[calc(100%-24px)] px-3 py-2 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)]'
                : 'w-8 h-8 rounded-full bg-[var(--accent-600)] flex items-center justify-center',
            ].join(' ')}
          >
            {expanded ? (
              <p className="text-xs font-medium text-[var(--text-secondary)] truncate">
                {activeProject.name}
              </p>
            ) : (
              <Tooltip delayDuration={200}>
                <TooltipTrigger>
                  <span className="text-[10px] text-white font-bold uppercase">
                    {(activeProject.name?.[0] ?? 'P')}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-subtle)]">
                  {activeProject.name}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        )}

        {/* Nav items */}
        <nav
          className={[
            'flex flex-col flex-1 gap-1 overflow-y-auto transition-all duration-200',
            expanded ? 'px-3' : 'px-2 items-center',
          ].join(' ')}
        >
          {NAV_ITEMS.map(item => (
            <NavItem key={item.to} item={item} expanded={expanded} />
          ))}
        </nav>

        {/* Bottom: settings + toggle */}
        <div
          className={[
            'shrink-0 pb-4 flex flex-col gap-1 transition-all duration-200',
            expanded ? 'px-3' : 'px-2 items-center',
          ].join(' ')}
        >
          <NavItem item={{ to: '/app/settings', label: 'Settings', icon: Settings }} expanded={expanded} />

          {/* Expand / collapse toggle */}
          <button
            onClick={() => setExpanded(e => !e)}
            className={[
              'mt-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors',
              expanded ? 'flex items-center gap-2 px-3 py-2 w-full text-xs' : 'w-10 h-10 flex items-center justify-center',
            ].join(' ')}
            aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {expanded ? (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse</span>
              </>
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  );
};

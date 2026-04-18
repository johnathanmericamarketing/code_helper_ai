import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutTemplate, FolderKanban, Palette, Layers3,
  ImageIcon, Settings, ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const studioNavItems = [
  { to: '/app/studio',      icon: LayoutTemplate, label: 'Workspace Studio' },
  { to: '/app/projects',    icon: FolderKanban,   label: 'Projects'         },
  { to: '/app/brand',       icon: Palette,        label: 'Brand Kit'        },
  { to: '/app/versions',    icon: Layers3,        label: 'Versions'         },
  { to: '/app/assets',      icon: ImageIcon,      label: 'Assets'           },
  { to: '/app/settings',    icon: Settings,       label: 'Settings'         },
];

const guidedSteps = [
  { num: 1, text: 'See your current site' },
  { num: 2, text: 'Describe the change'   },
  { num: 3, text: 'Review the preview'    },
  { num: 4, text: 'Publish when ready'    },
];

/**
 * StudioLeftPanel
 * The narrow left navigation column inside Workspace Studio.
 * Contains: logo, project selector, nav links, guided workflow steps.
 */
export const StudioLeftPanel = ({ activeProject }) => {
  const location = useLocation();

  const isNavActive = (item) => {
    if (item.to === '/app/projects') {
      return location.pathname === '/app' || location.pathname === '/app/projects';
    }
    return location.pathname.startsWith(item.to);
  };

  return (
    <div className="w-[220px] shrink-0 flex flex-col border-r border-border bg-card h-full overflow-y-auto">

      {/* Logo / Title */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-border shrink-0">
        <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
          <LayoutTemplate className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground leading-none">Workspace Studio</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">AI powered website builder</div>
        </div>
      </div>

      {/* Project Selector (display only — switching via global sidebar) */}
      <div className="px-3 py-3 border-b border-border shrink-0">
        <div className="w-full flex items-center gap-2.5 rounded-xl border border-border bg-muted/30 px-3 py-2.5">
          <div className="w-7 h-7 rounded-lg bg-foreground/10 flex items-center justify-center shrink-0">
            <Layers3 className="w-3.5 h-3.5 text-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-foreground truncate">
              {activeProject?.name || 'No project selected'}
            </div>
            <div className="text-[10px] text-muted-foreground truncate">Project workspace</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {studioNavItems.map((item) => {
          const active = isNavActive(item);
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors',
                active
                  ? 'bg-indigo-50 text-indigo-700 font-medium dark:bg-indigo-500/10 dark:text-indigo-400'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Guided Workflow Steps */}
      <div className="px-3 pb-4 shrink-0">
        <div className="rounded-xl border border-border bg-muted/20 p-3">
          <p className="text-[11px] font-semibold text-foreground mb-0.5">Guided workflow</p>
          <p className="text-[10px] text-muted-foreground mb-3">Designed for any type of user</p>
          <div className="space-y-2">
            {guidedSteps.map((step) => (
              <div key={step.num} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full border border-border bg-card flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-semibold text-muted-foreground">{step.num}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">{step.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useProject } from '@/context/ProjectContext';
import { Bell, Zap } from 'lucide-react';

const PAGE_LABELS = {
  '/app/projects':    'Projects',
  '/app/studio':      'Studio',
  '/app/brand':       'Brand',
  '/app/versions':    'Versions',
  '/app/connections': 'Connections',
  '/app/assets':      'Assets',
  '/app/settings':    'Settings',
};

export const AppHeader = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const { activeProject } = useProject();

  const pageLabel = Object.entries(PAGE_LABELS).find(
    ([path]) => location.pathname.startsWith(path)
  )?.[1] ?? 'Code Helper';

  const initials = currentUser?.displayName
    ? currentUser.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : currentUser?.email?.[0]?.toUpperCase() ?? 'U';

  return (
    <header
      className="h-14 flex items-center justify-between px-4 shrink-0"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      {/* Left: logo on mobile / page title on desktop */}
      <div className="flex items-center gap-3">
        {/* Logo — visible only on mobile (sidebar hidden) */}
        <div className="flex md:hidden items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[var(--accent-600)] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{pageLabel}</p>
          {activeProject && (
            <p className="text-xs text-[var(--text-muted)] leading-none mt-0.5 truncate max-w-[180px]">
              {activeProject.name}
            </p>
          )}
        </div>
      </div>

      {/* Right: notification + avatar */}
      <div className="flex items-center gap-2">
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>

        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ background: 'var(--accent-600)' }}
          title={currentUser?.email}
        >
          {initials}
        </div>
      </div>
    </header>
  );
};

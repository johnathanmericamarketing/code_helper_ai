import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FolderKanban,
  Wand2,
  Palette,
  GitBranch,
  ImagePlus,
} from 'lucide-react';

const MOBILE_NAV = [
  { to: '/app/projects', label: 'Projects', icon: FolderKanban },
  { to: '/app/studio',   label: 'Studio',   icon: Wand2 },
  { to: '/app/brand',    label: 'Brand',    icon: Palette },
  { to: '/app/versions', label: 'Versions', icon: GitBranch },
  { to: '/app/assets',   label: 'Assets',   icon: ImagePlus },
];

export const MobileBottomNav = () => {
  return (
    <nav
      className="md:hidden flex items-center justify-around shrink-0 safe-area-bottom"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        height: '60px',
      }}
    >
      {MOBILE_NAV.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            [
              'flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl transition-colors text-center',
              isActive
                ? 'text-[var(--accent-500)]'
                : 'text-[var(--text-muted)]',
            ].join(' ')
          }
        >
          <Icon className="w-5 h-5" />
          <span className="text-[10px] font-medium">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

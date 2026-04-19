import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileCode2, ImagePlus, History, BookOpen,
  GitBranch, Server, Settings, Crown, ChevronDown, Plus, LogOut, Link
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile } from '@/lib/user-service';
import { useProject } from '@/context/ProjectContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const navItems = [
  { to: '/app',              icon: LayoutDashboard, label: 'Projects',        desc: 'Project overview & setup' },
  { to: '/app/studio',       icon: FileCode2,        label: 'Studio',          desc: 'AI visual code editor' },
  { to: '/app/brand',        icon: BookOpen,          label: 'Brand',           desc: 'Brand logic & code styles' },
  { to: '/app/assets',       icon: ImagePlus,         label: 'Assets',          desc: 'Generate & manage images' },
  { to: '/app/versions',     icon: History,           label: 'Versions',        desc: 'Compare and restore drafts' },
  { to: '/app/connections',  icon: Link,              label: 'Connections',     desc: 'Hosting and integrations' },
  { to: '/app/settings',     icon: Settings,          label: 'Settings',        desc: 'API keys & preferences' },
];

const NavItem = ({ item }) => {
  const location = useLocation();
  const isActive = item.to === '/app'
    ? location.pathname === '/app'
    : location.pathname.startsWith(item.to);
  const Icon = item.icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <NavLink
          to={item.to}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all text-sm w-full',
            isActive
              ? 'bg-[var(--accent-50)] text-[var(--accent-700)] shadow-sm'
              : 'text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]'
          )}
        >
          <div className={cn(
            'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all',
            isActive ? 'bg-[var(--accent-100)]' : 'bg-transparent'
          )}>
            <Icon className={cn('w-4 h-4', isActive ? 'text-[var(--accent-600)]' : 'text-[var(--text-muted)]')} />
          </div>
          <span className="truncate flex-1">{item.label}</span>
          {isActive && (
            <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-[var(--accent-500)]" />
          )}
        </NavLink>
      </TooltipTrigger>
      <TooltipContent side="right" className="shadow-md ml-1 max-w-[160px]">
        <p className="font-semibold text-xs">{item.label}</p>
        <p className="text-muted-foreground text-[11px]">{item.desc}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export const AppSidebar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const { projects, activeProject, selectProject } = useProject();

  useEffect(() => {
    if (!currentUser) return;
    getUserProfile()
      .then(p => setIsAdmin(p?.role === 'super_admin'))
      .catch(() => {});
  }, [currentUser]);

  const handleSignOut = () => {
    import('@/firebase').then(({ auth }) => {
      import('firebase/auth').then(({ signOut }) => {
        signOut(auth).then(() => { window.location.href = '/'; });
      });
    });
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="hidden md:flex w-64 bg-surface border-r border-subtle h-screen flex-col sticky top-0 overflow-hidden shadow-sm">

        {/* ── Brand Header ── */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent-500)] to-[var(--accent-700)] flex items-center justify-center shrink-0 shadow-sm">
              <FileCode2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[16px] font-bold text-primary-custom leading-none tracking-tight">Code Helper</h1>
              <p className="text-[11px] text-muted-custom font-medium tracking-wide mt-1">Workspace Studio</p>
            </div>
          </div>

          {/* ── Project Selector ── */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-subtle bg-muted-custom hover:bg-[var(--border-subtle)] transition-all text-left group">
                <div className="w-6 h-6 rounded-md bg-[var(--accent-600)] flex items-center justify-center shrink-0">
                  <span className="text-[10px] text-white font-bold">
                    {activeProject?.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
                <span className="truncate flex-1 text-sm font-semibold text-primary-custom">
                  {activeProject ? activeProject.name : 'Select Project'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-custom shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 shadow-md" align="start" sideOffset={6}>
              {projects.map((p) => (
                <DropdownMenuItem
                  key={p.id}
                  onSelect={() => selectProject(p)}
                  className={cn(
                    'cursor-pointer flex items-center gap-2.5 py-2',
                    activeProject?.id === p.id && 'bg-[var(--accent-50)] text-[var(--accent-700)] font-medium'
                  )}
                >
                  <div className="w-5 h-5 rounded bg-[var(--accent-600)] flex items-center justify-center shrink-0">
                    <span className="text-[9px] text-white font-bold">{p.name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <span className="truncate">{p.name}</span>
                </DropdownMenuItem>
              ))}
              {projects.length === 0 && (
                <div className="p-3 text-xs text-muted-custom text-center">No projects yet</div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => navigate('/app')}
                className="cursor-pointer text-[var(--accent-600)] flex items-center gap-2 font-medium py-2"
              >
                <Plus className="w-4 h-4" /> New Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-2">
          {navItems.map((item) => (
            <NavItem key={item.to} item={item} />
          ))}

          {isAdmin && (
            <>
              <div className="pt-4 pb-2 px-3">
                <p className="text-[10px] font-semibold text-muted-custom uppercase tracking-wider">Admin</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) => cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all text-sm w-full',
                      isActive
                        ? 'bg-[var(--warning-bg)] text-[var(--warning-text)] font-semibold'
                        : 'text-yellow-600/70 hover:bg-[var(--warning-bg)] hover:text-[var(--warning-text)]'
                    )}
                  >
                    <div className="w-7 h-7 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0">
                      <Crown className="w-4 h-4 text-yellow-500" />
                    </div>
                    <span className="truncate flex-1">Super Admin</span>
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right" className="shadow-md ml-1">Platform administration</TooltipContent>
              </Tooltip>
            </>
          )}
        </nav>

        {/* ── User Footer ── */}
        <div className="p-4 border-t border-subtle">
          {currentUser && (
            <div className="flex items-center gap-3 px-2 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-[var(--accent-100)] flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-[var(--accent-700)]">
                  {(currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-primary-custom truncate leading-none">
                  {currentUser.displayName || 'User'}
                </p>
                <p className="text-[11px] text-muted-custom truncate mt-1">{currentUser.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-muted-custom hover:bg-[var(--danger-bg)] hover:text-[var(--danger-text)] transition-all"
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
              <LogOut className="w-4 h-4" />
            </div>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </TooltipProvider>
  );
};

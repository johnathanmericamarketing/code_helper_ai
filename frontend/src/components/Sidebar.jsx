import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutTemplate, FolderKanban, Layers3, History, Palette,
  Settings, Crown, ChevronDown, Plus, LogOut, PanelLeftClose, PanelLeftOpen,
  Bot, Bell, Link2, ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile } from '@/lib/user-service';
import { useProject } from '@/context/ProjectContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/ThemeToggle';

const navItems = [
  { to: '/app/projects', exact: true,  icon: FolderKanban,   label: 'Projects'     },
  { to: '/app/studio',               icon: LayoutTemplate, label: 'Studio'       },
  { to: '/app/brand',                icon: Palette,        label: 'Brand'        },
  { to: '/app/assets',               icon: ImageIcon,      label: 'Assets'       },
  { to: '/app/versions',             icon: Layers3,        label: 'Versions'     },
  { to: '/app/connections',          icon: Link2,          label: 'Connections'  },
  { to: '/app/settings',             icon: Settings,       label: 'Settings'     },
];

export const Sidebar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const { projects, activeProject, selectProject } = useProject();
  const [collapsed, setCollapsed] = useState(false);

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

  const initials = (currentUser?.displayName || currentUser?.email || 'U')
    .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  // Determine active state for nav items (handle /app index → /app/projects)
  const isNavActive = (item) => {
    if (item.to === '/app/projects') {
      return location.pathname === '/app' || location.pathname === '/app/projects';
    }
    return location.pathname.startsWith(item.to);
  };

  return (
    <motion.aside
      initial={{ width: 280 }}
      animate={{ width: collapsed ? 88 : 280 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="hidden md:flex border-r border-border bg-card flex-col h-screen sticky top-0 overflow-hidden shadow-sm z-30"
    >
      <div className="flex h-full flex-col">

        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-4 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-indigo-600 text-white shadow-sm">
              <LayoutTemplate className="h-5 w-5" />
            </div>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
                <div className="text-sm font-semibold text-foreground truncate">Code Helper AI</div>
                <div className="text-xs text-muted-foreground truncate">Website workspace</div>
              </motion.div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl shrink-0 text-muted-foreground hover:text-foreground"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>

        {/* Project Selector */}
        <div className="px-3 py-3 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center justify-between gap-2 rounded-2xl border border-border bg-muted/40 hover:bg-muted/70 px-3 py-3 transition-colors text-left group">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-foreground text-background">
                    <Layers3 className="h-4 w-4" />
                  </div>
                  {!collapsed && (
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-foreground">
                        {activeProject ? activeProject.name : 'Select Project'}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">Current project</div>
                    </div>
                  )}
                </div>
                {!collapsed && <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 shadow-xl" align="start" sideOffset={6}>
              {projects.map((p) => (
                <DropdownMenuItem
                  key={p.id}
                  onSelect={() => selectProject(p)}
                  className={cn('cursor-pointer flex items-center gap-2.5 py-2', activeProject?.id === p.id && 'bg-primary/10 text-primary font-medium')}
                >
                  <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-[10px] text-primary font-bold">{p.name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <span className="truncate">{p.name}</span>
                </DropdownMenuItem>
              ))}
              {projects.length === 0 && <div className="p-3 text-xs text-muted-foreground text-center">No projects yet</div>}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => navigate('/app/projects')} className="cursor-pointer text-primary flex items-center gap-2 font-medium py-2">
                <Plus className="w-4 h-4" /> New Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
          {navItems.map((item) => {
            const active = isNavActive(item);
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition',
                  active
                    ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
              </NavLink>
            );
          })}

          {/* Admin section */}
          {isAdmin && (
            <>
              {!collapsed && <div className="pt-4 pb-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Admin</div>}
              {collapsed && <div className="pt-2" />}
              <NavLink
                to="/admin"
                className={({ isActive }) => cn(
                  'flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition',
                  isActive ? 'bg-amber-500/10 text-amber-600' : 'text-amber-600/70 hover:bg-amber-500/10 hover:text-amber-600'
                )}
                title={collapsed ? "Super Admin" : undefined}
              >
                <Crown className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="text-sm font-medium truncate">Super Admin</span>}
              </NavLink>
            </>
          )}
        </nav>

        {/* Maya Assistant card */}
        {!collapsed && (
          <div className="mt-4 px-3 mb-2 shrink-0">
            <div className="rounded-2xl border border-border bg-muted/30 p-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">Maya Assistant</div>
                  <div className="text-xs text-muted-foreground truncate">Safer, clearer website changes</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Tools */}
        <div className="px-3 pb-2 flex gap-2 justify-center shrink-0">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-card" />
          </Button>
        </div>

        {/* User Footer */}
        <div className="p-3 border-t border-border shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center justify-between gap-3 rounded-2xl hover:bg-muted px-3 py-2.5 transition-colors text-left">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-xs">
                    {initials}
                  </div>
                  {!collapsed && (
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-foreground truncate leading-none">{currentUser?.displayName || 'User'}</div>
                      <div className="text-[11px] text-muted-foreground truncate mt-1">{currentUser?.email}</div>
                    </div>
                  )}
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="right" sideOffset={14} className="w-56 shadow-xl">
              <DropdownMenuItem onClick={() => navigate('/app/settings')} className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </motion.aside>
  );
};

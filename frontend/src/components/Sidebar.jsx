import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileCode2, ImagePlus, History, BookOpen,
  GitBranch, Server, Settings, Crown, ChevronDown, Plus, LogOut, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile } from '@/lib/user-service';
import { useProject } from '@/context/ProjectContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const navItems = [
  { to: '/app',             icon: LayoutDashboard, label: 'Dashboard',       desc: 'Project overview & onboarding',  color: 'text-violet-500',  bg: 'bg-violet-500/10',  activeBg: 'bg-violet-500/15 text-violet-600' },
  { to: '/app/studio',      icon: FileCode2,        label: 'Workspace Studio',desc: 'AI visual code editor',           color: 'text-blue-500',    bg: 'bg-blue-500/10',    activeBg: 'bg-blue-500/15 text-blue-600' },
  { to: '/app/assets',      icon: ImagePlus,        label: 'Asset Studio',    desc: 'Generate & manage images',        color: 'text-pink-500',    bg: 'bg-pink-500/10',    activeBg: 'bg-pink-500/15 text-pink-600' },
  { to: '/app/history',     icon: History,          label: 'History',         desc: 'Past generations & logs',         color: 'text-amber-500',   bg: 'bg-amber-500/10',   activeBg: 'bg-amber-500/15 text-amber-600' },
  { to: '/app/knowledge',   icon: BookOpen,         label: 'Knowledge Base',  desc: 'Brand logic & code styles',       color: 'text-emerald-500', bg: 'bg-emerald-500/10', activeBg: 'bg-emerald-500/15 text-emerald-600' },
  { to: '/app/integrations',icon: GitBranch,        label: 'Integrations',    desc: 'Connect to GitHub',               color: 'text-orange-500',  bg: 'bg-orange-500/10',  activeBg: 'bg-orange-500/15 text-orange-600' },
  { to: '/app/servers',     icon: Server,           label: 'Servers',         desc: 'Manage project hosting',          color: 'text-cyan-500',    bg: 'bg-cyan-500/10',    activeBg: 'bg-cyan-500/15 text-cyan-600' },
  { to: '/app/settings',    icon: Settings,         label: 'Settings',        desc: 'API keys & preferences',          color: 'text-slate-500',   bg: 'bg-slate-500/10',   activeBg: 'bg-slate-500/15 text-slate-600' },
];

export const Sidebar = () => {
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
        signOut(auth).then(() => window.location.href = '/');
      });
    });
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="hidden md:flex w-64 bg-card border-r border-border h-screen flex-col sticky top-0 overflow-hidden">
        
        {/* ── Brand Header ── */}
        <div className="px-4 pt-5 pb-4">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/25">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[15px] font-bold text-foreground leading-none tracking-tight">Code Helper</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">AI Studio</p>
            </div>
          </div>

          {/* ── Project Selector ── */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-border/60 bg-muted/40 hover:bg-muted/70 transition-all group text-left">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary/80 to-violet-500/80 flex items-center justify-center shrink-0">
                  <span className="text-[10px] text-white font-bold">
                    {activeProject?.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
                <span className="truncate flex-1 text-sm font-medium text-foreground">
                  {activeProject ? activeProject.name : 'Select Project'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 shadow-xl" align="start" sideOffset={6}>
              {projects.map((p) => (
                <DropdownMenuItem
                  key={p.id}
                  onSelect={() => selectProject(p)}
                  className={cn("cursor-pointer flex items-center gap-2.5 py-2", activeProject?.id === p.id && "bg-primary/10 text-primary font-medium")}
                >
                  <div className="w-5 h-5 rounded bg-gradient-to-br from-primary/80 to-violet-500/80 flex items-center justify-center shrink-0">
                    <span className="text-[9px] text-white font-bold">{p.name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  {p.name}
                </DropdownMenuItem>
              ))}
              {projects.length === 0 && (
                <div className="p-3 text-xs text-muted-foreground text-center">No projects yet</div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => navigate('/app')}
                className="cursor-pointer text-primary flex items-center gap-2 font-medium py-2"
              >
                <Plus className="w-4 h-4" /> New Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto pb-2">
          {navItems.map((item) => (
            <Tooltip key={item.to}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.to}
                  end={item.to === '/app'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all text-sm group',
                      isActive
                        ? `${item.activeBg} font-semibold shadow-sm`
                        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={cn(
                        'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all',
                        isActive ? item.bg : 'bg-transparent group-hover:bg-muted'
                      )}>
                        <item.icon className={cn('w-4 h-4', isActive ? item.color : 'text-muted-foreground group-hover:text-foreground')} />
                      </div>
                      <span className="truncate">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                      )}
                    </>
                  )}
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs font-medium shadow-xl ml-1">
                <p className="font-semibold">{item.label}</p>
                <p className="text-muted-foreground text-[11px]">{item.desc}</p>
              </TooltipContent>
            </Tooltip>
          ))}

          {/* Admin section */}
          {isAdmin && (
            <>
              <div className="pt-3 pb-1 px-2">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Admin</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all text-sm group',
                        isActive ? 'bg-yellow-500/15 text-yellow-600 font-semibold' : 'text-yellow-600/70 hover:bg-yellow-500/10 hover:text-yellow-600'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0', isActive ? 'bg-yellow-500/20' : 'group-hover:bg-yellow-500/10')}>
                          <Crown className="w-4 h-4" />
                        </div>
                        <span>Super Admin</span>
                      </>
                    )}
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs shadow-xl ml-1">Platform administration</TooltipContent>
              </Tooltip>
            </>
          )}
        </nav>

        {/* ── User Footer ── */}
        <div className="p-3 border-t border-border/60">
          {currentUser && (
            <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-xs font-bold text-white">
                  {currentUser.displayName?.charAt(0)?.toUpperCase() || currentUser.email?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate leading-none">
                  {currentUser.displayName || 'User'}
                </p>
                <p className="text-[11px] text-muted-foreground truncate mt-0.5">{currentUser.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all group"
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-destructive/10">
              <LogOut className="w-4 h-4" />
            </div>
            Sign Out
          </button>
        </div>
      </div>
    </TooltipProvider>
  );
};

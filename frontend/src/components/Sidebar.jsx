import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FileCode2, LayoutDashboard, History, Settings, BookOpen, Server, GitBranch, Crown, ImagePlus, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile } from '@/lib/user-service';
import { useProject } from '@/context/ProjectContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard', desc: 'Project overview & onboarding' },
  { to: '/app/studio', icon: FileCode2, label: 'Workspace Studio', desc: 'AI visual code editor' },
  { to: '/app/assets', icon: ImagePlus, label: 'Asset Studio', desc: 'Generate & manage images' },
  { to: '/app/history', icon: History, label: 'History', desc: 'Past generations & logs' },
  { to: '/app/knowledge', icon: BookOpen, label: 'Knowledge Base', desc: 'Brand logic & code styles' },
  { to: '/app/integrations', icon: GitBranch, label: 'Integrations', desc: 'Connect to Github' },
  { to: '/app/servers', icon: Server, label: 'Servers', desc: 'Manage project hosting' },
  { to: '/app/settings', icon: Settings, label: 'Settings', desc: 'API keys & preferences' },
];

export const Sidebar = () => {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const { projects, activeProject, selectProject } = useProject();

  useEffect(() => {
    if (!currentUser) return;
    getUserProfile()
      .then(p => setIsAdmin(p?.role === 'super_admin'))
      .catch(() => {});
  }, [currentUser]);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="hidden md:flex w-64 bg-card border-r border-border h-screen flex-col sticky top-0">
        {/* Logo & Project Selector */}
        <div className="p-4 border-b border-border space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
              <FileCode2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground leading-tight">Code Helper</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">AI Studio</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between px-3 h-10 border-border/60 bg-muted/20 hover:bg-muted/50">
                <span className="truncate flex-1 text-left text-sm font-medium">
                  {activeProject ? activeProject.name : "Select Project"}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              {projects.map((p) => (
                <DropdownMenuItem key={p.id} onSelect={() => selectProject(p)} className="cursor-pointer">
                  {p.name}
                </DropdownMenuItem>
              ))}
              {projects.length === 0 && (
                <div className="p-2 text-xs text-muted-foreground text-center">No projects found.</div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Tooltip key={item.to}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-md font-medium transition-all text-sm',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )
                  }
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs bg-popover border-border shadow-lg ml-2">
                {item.desc}
              </TooltipContent>
            </Tooltip>
          ))}

          {/* Super Admin Link — only visible to admins */}
          {isAdmin && (
            <>
              <div className="pt-4 pb-1 px-3">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Admin</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-md font-medium transition-all text-sm',
                        isActive
                          ? 'bg-yellow-500/20 text-yellow-600'
                          : 'text-yellow-600/70 hover:bg-yellow-500/10 hover:text-yellow-600'
                      )
                    }
                  >
                    <Crown className="w-4 h-4 shrink-0" />
                    <span>Super Admin</span>
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs bg-popover border-border shadow-lg ml-2">
                  Platform administration settings
                </TooltipContent>
              </Tooltip>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border mt-auto space-y-4">
          <button
            onClick={() => {
              import('@/firebase').then(({ auth }) => {
                import('firebase/auth').then(({ signOut }) => {
                  signOut(auth).then(() => window.location.href = '/');
                });
              });
            }}
            className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md font-medium text-sm text-red-500/80 hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <svg className="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            <span className="truncate">Sign Out</span>
          </button>
        </div>
      </div>
    </TooltipProvider>
  );
};

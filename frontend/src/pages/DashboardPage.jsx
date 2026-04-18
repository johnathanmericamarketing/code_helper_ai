import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Server, Key, BookOpen, Plus, FileCode2, ArrowRight,
  Folder, Zap, CheckCircle, Activity, Sparkles
} from 'lucide-react';
import { requestsService } from '@/lib/firebase-service';
import { projectService } from '@/lib/project-service';
import { useProject } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { projects, activeProject, refreshProjects, selectProject } = useProject();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Project Form State
  const [newProject, setNewProject] = useState({ name: '', domain: '', description: '' });
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (activeProject) {
      fetchRequests();
    } else {
      setRequests([]);
      setLoading(false);
    }
  }, [activeProject]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await requestsService.list(activeProject.id);
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;
    setCreating(true);
    try {
      const proj = await projectService.create({
        name: newProject.name,
        domain: newProject.domain,
        description: newProject.description,
      });
      toast.success('Project created successfully!');
      setShowProjectForm(false);
      setNewProject({ name: '', domain: '', description: '' });
      await refreshProjects();
      selectProject(proj);
    } catch (e) {
      toast.error('Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const getStatusColor = (status) => {
    const map = {
      pending: 'bg-amber-500/10 text-amber-600 border-amber-200',
      structured: 'bg-blue-500/10 text-blue-600 border-blue-200',
      planned: 'bg-blue-500/10 text-blue-600 border-blue-200',
      generated: 'bg-violet-500/10 text-violet-600 border-violet-200',
      validated: 'bg-violet-500/10 text-violet-600 border-violet-200',
      approved: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
      rejected: 'bg-red-500/10 text-red-600 border-red-200',
    };
    return map[status] || 'bg-muted text-muted-foreground border-border';
  };

  const userName = currentUser?.displayName?.split(' ')[0] || 'there';

  // ─── VIEW: NO PROJECTS OR CREATE NEW ───────────────────────────────────────
  if (projects.length === 0 || showProjectForm) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 fade-in">
        <div className="w-full max-w-lg space-y-8">

          {/* Hero */}
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Welcome, {userName}! 👋
            </h1>
            <p className="text-muted-foreground text-base">
              Create your first project to unlock the full AI studio.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card border border-border/60 rounded-2xl shadow-xl shadow-black/5 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500/8 via-violet-500/8 to-transparent px-6 py-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground">Create New Project</h2>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">Everything is isolated per project: brand kit, servers, and code requests.</p>
            </div>

            <form onSubmit={handleCreateProject} className="p-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="proj-name" className="text-sm font-medium">Project Name *</Label>
                <Input
                  id="proj-name"
                  value={newProject.name}
                  onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="e.g. Mellow Facial Treatments"
                  className="h-11 border-border/70 focus-visible:ring-primary/30 focus-visible:border-primary/60"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proj-domain" className="text-sm font-medium">Primary Domain</Label>
                <Input
                  id="proj-domain"
                  value={newProject.domain}
                  onChange={e => setNewProject({ ...newProject, domain: e.target.value })}
                  placeholder="e.g. https://mellowfacial.com"
                  className="h-11 border-border/70 focus-visible:ring-primary/30 focus-visible:border-primary/60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proj-desc" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="proj-desc"
                  value={newProject.description}
                  onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="What is this project about?"
                  className="resize-none border-border/70 focus-visible:ring-primary/30 focus-visible:border-primary/60"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between gap-3 pt-2">
                {projects.length > 0 && (
                  <Button type="button" variant="ghost" onClick={() => setShowProjectForm(false)} className="text-muted-foreground">
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={creating || !newProject.name.trim()}
                  className="ml-auto gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg shadow-blue-500/25"
                >
                  {creating ? (
                    <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {creating ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </form>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {['AI Code Generation', 'Brand Kit', 'Visual Inspector', 'Server Deploy', 'Image Studio'].map(f => (
              <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted/60 text-muted-foreground text-xs rounded-full border border-border/50">
                <CheckCircle className="w-3 h-3 text-emerald-500" /> {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── VIEW: ACTIVE PROJECT DASHBOARD ────────────────────────────────────────
  const stats = [
    { label: 'Total Requests', value: requests.length, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Completed', value: requests.filter(r => r.status === 'approved').length, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'In Progress', value: requests.filter(r => ['structured', 'planned', 'generated', 'validated'].includes(r.status)).length, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { label: 'Pending', value: requests.filter(r => r.status === 'pending').length, color: 'text-violet-500', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  ];

  const quickActions = [
    {
      icon: Server, label: 'Setup Server', sub: 'Connect SSH/SFTP for AI deploys',
      color: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', action: () => navigate('/app/servers')
    },
    {
      icon: Key, label: 'Add API Keys', sub: 'GitHub, Stripe & more integrations',
      color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', action: () => navigate('/app/settings')
    },
    {
      icon: BookOpen, label: 'Brand Kit', sub: 'Colors, fonts & tone of voice',
      color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', action: () => navigate('/app/knowledge')
    },
  ];

  const recentRequests = requests.slice(0, 6);

  return (
    <div className="space-y-8 fade-in">

      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-violet-600 to-blue-700 p-7 text-white shadow-2xl shadow-blue-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-blue-200" />
              <span className="text-blue-200 text-sm font-medium uppercase tracking-widest">Code Helper Studio</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Welcome back, {userName}!
            </h1>
            <p className="text-blue-200 mt-1 text-base">
              Active: <span className="text-white font-semibold">{activeProject?.name}</span>
              {activeProject?.domain && (
                <span className="ml-3 text-blue-300 text-sm">· {activeProject.domain}</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowProjectForm(true)}
              className="gap-2 bg-white/15 hover:bg-white/25 text-white border-white/20 backdrop-blur-sm"
            >
              <Plus className="w-4 h-4" /> New Project
            </Button>
            <Button
              onClick={() => navigate('/app/studio')}
              className="gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-xl"
            >
              <Zap className="w-4 h-4" /> Open Studio
            </Button>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className={`bg-card rounded-xl border ${stat.border} p-5 hover:shadow-lg transition-all hover:-translate-y-0.5`}>
            <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Quick Setup ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Quick Setup</h2>
            <p className="text-sm text-muted-foreground">Configure your project workspace</p>
          </div>
          <Badge variant="outline" className="text-xs">3 steps</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, i) => (
            <button
              key={action.label}
              onClick={action.action}
              className={`group text-left p-5 bg-card rounded-xl border ${action.border} hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`w-11 h-11 rounded-xl ${action.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Step {i + 1}</span>
              </div>
              <div className="mt-3">
                <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{action.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{action.sub}</p>
              </div>
              <div className="flex items-center gap-1 mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                Get started <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
            <p className="text-sm text-muted-foreground">Latest requests for {activeProject?.name}</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => navigate('/app/history')} className="gap-2 text-xs">
            View All <ArrowRight className="w-3 h-3" />
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-16 bg-muted/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : recentRequests.length === 0 ? (
          <div className="bg-card rounded-xl border border-dashed border-border/70 p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FileCode2 className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">No activity yet</h3>
            <p className="text-sm text-muted-foreground mb-5">Launch the studio to start generating code</p>
            <Button onClick={() => navigate('/app/studio')} className="gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90">
              <Zap className="w-4 h-4" /> Open Workspace Studio
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border/60 divide-y divide-border/50 overflow-hidden shadow-sm">
            {recentRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 cursor-pointer transition-colors group"
                onClick={() => navigate(`/app/request/${req.id}`)}
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{req.raw_request}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <span className={`shrink-0 text-[11px] px-2.5 py-1 rounded-full font-semibold border ${getStatusColor(req.status)}`}>
                  {req.status}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

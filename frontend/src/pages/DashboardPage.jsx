import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, FileCode2, BookOpen, Server, Key, FolderOpen } from 'lucide-react';
import { requestsService } from '@/lib/firebase-service';
import { projectService } from '@/lib/project-service';
import { useProject } from '@/context/ProjectContext';
import { toast } from 'sonner';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { projects, activeProject, refreshProjects, selectProject } = useProject();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Project Form State
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', domain: '', description: '' });

  useEffect(() => {
    if (activeProject) {
      fetchRequests();
    } else {
      setRequests([]);
      setLoading(false);
    }
  }, [activeProject]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await requestsService.list(activeProject.id);
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const proj = await projectService.create({
        name: newProject.name,
        domain: newProject.domain,
        description: newProject.description,
      });
      toast.success("Project created successfully!");
      setShowNewProjectForm(false);
      await refreshProjects();
      selectProject(proj);
    } catch (e) {
      toast.error("Failed to create project");
    }
  };

  const getStatusBadge = (status) => {
    const variants = { pending: 'outline', structured: 'info', planned: 'info', generated: 'warning', validated: 'warning', approved: 'success', rejected: 'destructive' };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const recentRequests = requests.slice(0, 5);

  // VIEW: NO PROJECTS
  if (projects.length === 0 || showNewProjectForm) {
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Welcome to Code Helper Studio</h1>
          <p className="text-muted-foreground mt-2">Create your first Project workspace to get started.</p>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
            <CardDescription>A project contains its own isolated knowledge base, servers, and code requests.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} placeholder="e.g. Mellow Facial Treatments" required />
              </div>
              <div className="space-y-2">
                <Label>Primary Domain (URL)</Label>
                <Input value={newProject.domain} onChange={e => setNewProject({...newProject, domain: e.target.value})} placeholder="e.g. https://mellowfacial.com" required />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} placeholder="What is this project about?" rows={3} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                {projects.length > 0 && <Button type="button" variant="ghost" onClick={() => setShowNewProjectForm(false)}>Cancel</Button>}
                <Button type="submit">Create Project</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // VIEW: PROJECT DASHBOARD
  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl p-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground uppercase tracking-widest text-primary">
            WELCOME TO CODE HELPER STUDIO
          </h1>
          <p className="text-lg text-muted-foreground mt-2">Active Project: <span className="font-semibold text-foreground">{activeProject?.name}</span></p>
        </div>
        <Button variant="outline" onClick={() => setShowNewProjectForm(true)} className="gap-2 shrink-0 hidden md:flex">
          <Plus className="w-4 h-4" /> New Project
        </Button>
      </div>

      {/* 3 Core Onboarding Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all cursor-pointer border-primary/20 hover:border-primary/50" onClick={() => navigate('/servers')}>
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Server className="w-8 h-8 text-blue-500" />
            </div>
            <CardTitle className="text-xl">SETUP YOUR SERVER</CardTitle>
            <CardDescription>Connect SSH/SFTP so the AI can deploy directly to your hosting.</CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer border-primary/20 hover:border-primary/50" onClick={() => navigate('/settings')}>
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Key className="w-8 h-8 text-purple-500" />
            </div>
            <CardTitle className="text-xl">ADD YOUR API KEY</CardTitle>
            <CardDescription>Configure external integrations like Github and Stripe.</CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer border-primary/20 hover:border-primary/50 bg-primary/5 target-card-pulse" onClick={() => navigate('/knowledge')}>
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-xl">ADD KNOWLEDGE BASE</CardTitle>
            <CardDescription>Setup your Brand Kit, colors, and coding architecture rules.</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Requests */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle>Recent Activity in {activeProject?.name}</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/history')}>View All</Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : recentRequests.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
              <FileCode2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No workflow activity yet.</p>
              <Button onClick={() => navigate('/studio')} className="mt-4 gap-2">
                <Plus className="w-4 h-4" /> Launch Studio
              </Button>
            </div>
          ) : (
            <div className="space-y-3 mt-4">
              {recentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer" onClick={() => navigate(`/request/${request.id}`)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-row gap-2 mb-1 items-center">
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="font-medium text-sm text-foreground truncate">{request.raw_request}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(request.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

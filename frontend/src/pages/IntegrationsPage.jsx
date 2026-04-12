import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Github, FolderOpen, Trash2, GitBranch, GitPull, GitCommit, RefreshCw, Folder, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

export const IntegrationsPage = () => {
  const [githubConnections, setGithubConnections] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [githubDialogOpen, setGithubDialogOpen] = useState(false);
  const [workspaceDialogOpen, setWorkspaceDialogOpen] = useState(false);
  
  const [githubForm, setGithubForm] = useState({
    name: '',
    access_token: '',
    default_repo: '',
    default_branch: 'main',
  });
  
  const [workspaceForm, setWorkspaceForm] = useState({
    name: '',
    path: '',
    description: '',
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [githubResp, workspaceResp] = await Promise.all([
        apiClient.get(`/github`),
        apiClient.get(`/workspace`),
      ]);
      setGithubConnections(githubResp.data);
      setWorkspaces(workspaceResp.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load integrations');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post(`/github`, githubForm);
      toast.success('GitHub connected successfully!');
      setGithubDialogOpen(false);
      setGithubForm({ name: '', access_token: '', default_repo: '', default_branch: 'main' });
      fetchAll();
    } catch (error) {
      console.error('Error connecting GitHub:', error);
      toast.error(error.response?.data?.detail || 'Failed to connect GitHub');
    }
  };

  const handleWorkspaceSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post(`/workspace`, workspaceForm);
      toast.success('Workspace added successfully!');
      setWorkspaceDialogOpen(false);
      setWorkspaceForm({ name: '', path: '', description: '' });
      fetchAll();
    } catch (error) {
      console.error('Error adding workspace:', error);
      toast.error(error.response?.data?.detail || 'Failed to add workspace');
    }
  };

  const handleDeleteGithub = async (id) => {
    if (!window.confirm('Remove this GitHub connection?')) return;
    try {
      await apiClient.delete(`/github/${id}`);
      toast.success('GitHub connection removed');
      fetchAll();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Failed to remove connection');
    }
  };

  const handleDeleteWorkspace = async (id) => {
    if (!window.confirm('Remove this workspace?')) return;
    try {
      await apiClient.delete(`/workspace/${id}`);
      toast.success('Workspace removed');
      fetchAll();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Failed to remove workspace');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Integrations</h1>
        <p className="text-muted-foreground mt-1">Connect GitHub repositories and local file systems</p>
      </div>

      <Tabs defaultValue="github" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="github" className="gap-2">
            <Github className="w-4 h-4" />
            GitHub
          </TabsTrigger>
          <TabsTrigger value="local" className="gap-2">
            <FolderOpen className="w-4 h-4" />
            Local Workspaces
          </TabsTrigger>
        </TabsList>

        {/* GitHub Tab */}
        <TabsContent value="github" className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Connect your GitHub account to browse repositories and push/pull code
            </p>
            <Dialog open={githubDialogOpen} onOpenChange={setGithubDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Connect GitHub
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Github className="w-5 h-5" />
                    Connect GitHub Account
                  </DialogTitle>
                  <DialogDescription>
                    Add a GitHub Personal Access Token to enable repository access
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleGithubSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="gh-name">Connection Name *</Label>
                    <Input
                      id="gh-name"
                      value={githubForm.name}
                      onChange={(e) => setGithubForm({ ...githubForm, name: e.target.value })}
                      placeholder="My GitHub Account"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gh-token">Personal Access Token *</Label>
                    <Input
                      id="gh-token"
                      type="password"
                      value={githubForm.access_token}
                      onChange={(e) => setGithubForm({ ...githubForm, access_token: e.target.value })}
                      placeholder="ghp_xxxxxxxxxxxx"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Create token at: Settings → Developer settings → Personal access tokens
                    </p>
                  </div>

                  <Alert>
                    <GitBranch className="w-4 h-4" />
                    <AlertTitle>Required Permissions</AlertTitle>
                    <AlertDescription className="text-xs">
                      Your token needs: <strong>repo</strong> (full control of private repositories)
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setGithubDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Connect
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* GitHub Connections */}
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 text-muted-foreground mx-auto mb-4 animate-spin" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : githubConnections.length === 0 ? (
            <Card className="border-border">
              <CardContent className="py-12 text-center">
                <Github className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No GitHub connections yet</p>
                <Button onClick={() => setGithubDialogOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Connect Your First Account
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {githubConnections.map((conn) => (
                <Card key={conn.id} className="border-border hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center">
                          <Github className="w-6 h-6 text-background" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{conn.name}</CardTitle>
                          {conn.username && (
                            <p className="text-sm text-muted-foreground mt-1">@{conn.username}</p>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteGithub(conn.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      {conn.is_active ? (
                        <Badge variant="success" className="gap-1">
                          <Check className="w-3 h-3" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <X className="w-3 h-3" />
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Local Workspaces Tab */}
        <TabsContent value="local" className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Add local directories to browse and edit files directly
            </p>
            <Dialog open={workspaceDialogOpen} onOpenChange={setWorkspaceDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Workspace
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <FolderOpen className="w-5 h-5" />
                    Add Local Workspace
                  </DialogTitle>
                  <DialogDescription>
                    Connect a local directory to browse and edit files
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleWorkspaceSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ws-name">Workspace Name *</Label>
                    <Input
                      id="ws-name"
                      value={workspaceForm.name}
                      onChange={(e) => setWorkspaceForm({ ...workspaceForm, name: e.target.value })}
                      placeholder="My Project"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ws-path">Directory Path *</Label>
                    <Input
                      id="ws-path"
                      value={workspaceForm.path}
                      onChange={(e) => setWorkspaceForm({ ...workspaceForm, path: e.target.value })}
                      placeholder="/home/user/projects/myapp"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Absolute path to your project directory
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ws-desc">Description (Optional)</Label>
                    <Textarea
                      id="ws-desc"
                      value={workspaceForm.description}
                      onChange={(e) => setWorkspaceForm({ ...workspaceForm, description: e.target.value })}
                      placeholder="Description of this workspace"
                      className="min-h-[80px]"
                    />
                  </div>

                  <Alert>
                    <Folder className="w-4 h-4" />
                    <AlertTitle>Git Repository Detection</AlertTitle>
                    <AlertDescription className="text-xs">
                      If this directory contains a .git folder, Git operations (pull/push/commit) will be available.
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setWorkspaceDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Add Workspace
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Workspaces */}
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 text-muted-foreground mx-auto mb-4 animate-spin" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : workspaces.length === 0 ? (
            <Card className="border-border">
              <CardContent className="py-12 text-center">
                <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No workspaces added yet</p>
                <Button onClick={() => setWorkspaceDialogOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Your First Workspace
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {workspaces.map((ws) => (
                <Card key={ws.id} className="border-border hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          {ws.is_git_repo ? (
                            <GitBranch className="w-5 h-5 text-primary" />
                          ) : (
                            <FolderOpen className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{ws.name}</CardTitle>
                          <p className="text-sm text-muted-foreground font-mono mt-1">{ws.path}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteWorkspace(ws.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-2">
                      {ws.is_git_repo && (
                        <Badge variant="success" className="gap-1">
                          <GitBranch className="w-3 h-3" />
                          Git Repository
                        </Badge>
                      )}
                      {ws.description && (
                        <p className="text-sm text-muted-foreground w-full mt-2 pt-2 border-t border-border">
                          {ws.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

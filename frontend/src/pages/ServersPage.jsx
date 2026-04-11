import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Server, Trash2, Edit, Wifi, WifiOff, Check, X, Lock } from 'lucide-react';
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

const serverTypeIcons = {
  ftp: '📁',
  sftp: '🔐',
  ssh: '💻',
};

const serverTypeColors = {
  ftp: 'bg-info/10 text-info',
  sftp: 'bg-success/10 text-success',
  ssh: 'bg-primary/10 text-primary',
};

export const ServersPage = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingServer, setEditingServer] = useState(null);
  const [testingServer, setTestingServer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    server_type: 'sftp',
    host: '',
    port: 22,
    username: '',
    password: '',
    ssh_key: '',
    remote_path: '/',
    description: '',
  });

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      const response = await apiClient.get(`/servers`);
      setServers(response.data);
    } catch (error) {
      console.error('Error fetching servers:', error);
      toast.error('Failed to load servers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        port: parseInt(formData.port),
      };

      if (editingServer) {
        await apiClient.patch(`/servers/${editingServer.id}`, payload);
        toast.success('Server updated');
      } else {
        await apiClient.post(`/servers`, payload);
        toast.success('Server added');
      }

      setDialogOpen(false);
      setEditingServer(null);
      resetForm();
      fetchServers();
    } catch (error) {
      console.error('Error saving server:', error);
      toast.error('Failed to save server');
    }
  };

  const handleEdit = (server) => {
    setEditingServer(server);
    setFormData({
      name: server.name,
      server_type: server.server_type,
      host: server.host,
      port: server.port,
      username: server.username,
      password: '',  // Don't pre-fill password
      ssh_key: '',
      remote_path: server.remote_path,
      description: server.description || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this server?')) return;
    
    try {
      await apiClient.delete(`/servers/${id}`);
      toast.success('Server deleted');
      fetchServers();
    } catch (error) {
      console.error('Error deleting server:', error);
      toast.error('Failed to delete server');
    }
  };

  const handleTestConnection = async (serverId) => {
    setTestingServer(serverId);
    try {
      const response = await apiClient.post(`/servers/${serverId}/test`);
      if (response.data.success) {
        toast.success('Connection successful!');
        fetchServers(); // Refresh to get updated last_connected
      } else {
        toast.error(response.data.message || 'Connection failed');
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      toast.error('Connection test failed');
    } finally {
      setTestingServer(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      server_type: 'sftp',
      host: '',
      port: 22,
      username: '',
      password: '',
      ssh_key: '',
      remote_path: '/',
      description: '',
    });
  };

  const handleServerTypeChange = (type) => {
    let defaultPort = 22;
    if (type === 'ftp') defaultPort = 21;
    if (type === 'sftp' || type === 'ssh') defaultPort = 22;
    
    setFormData({ ...formData, server_type: type, port: defaultPort });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Server Connections</h1>
          <p className="text-muted-foreground mt-1">Manage FTP, SFTP, and SSH connections for code deployment</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingServer(null); }} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Server
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingServer ? 'Edit Server' : 'Add New Server'}</DialogTitle>
              <DialogDescription>
                Connect to your FTP, SFTP, or SSH server for automatic code deployment
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Server Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Production Server"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="server_type">Connection Type *</Label>
                  <Select value={formData.server_type} onValueChange={handleServerTypeChange}>
                    <SelectTrigger id="server_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ftp">FTP (File Transfer Protocol)</SelectItem>
                      <SelectItem value="sftp">SFTP (Secure FTP)</SelectItem>
                      <SelectItem value="ssh">SSH (Secure Shell)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="host">Host / IP Address *</Label>
                  <Input
                    id="host"
                    value={formData.host}
                    onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                    placeholder="example.com or 192.168.1.1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port *</Label>
                  <Input
                    id="port"
                    type="number"
                    value={formData.port}
                    onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="root or your username"
                  required
                />
              </div>

              {formData.server_type !== 'ssh' && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password {editingServer ? '(leave blank to keep current)' : '*'}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    required={!editingServer}
                  />
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Password is encrypted before storage
                  </p>
                </div>
              )}

              {formData.server_type === 'ssh' && (
                <div className="space-y-2">
                  <Label htmlFor="ssh_key">SSH Private Key (Optional)</Label>
                  <Textarea
                    id="ssh_key"
                    value={formData.ssh_key}
                    onChange={(e) => setFormData({ ...formData, ssh_key: e.target.value })}
                    placeholder="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
                    className="min-h-[100px] font-mono text-xs"
                  />
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    SSH key is encrypted before storage. Leave blank to use password.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="remote_path">Remote Path *</Label>
                <Input
                  id="remote_path"
                  value={formData.remote_path}
                  onChange={(e) => setFormData({ ...formData, remote_path: e.target.value })}
                  placeholder="/var/www/html or /home/user/app"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Base directory where files will be deployed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Production environment server"
                  className="min-h-[80px]"
                />
              </div>

              <Alert>
                <Lock className="w-4 h-4" />
                <AlertTitle>Security Note</AlertTitle>
                <AlertDescription>
                  All sensitive data (passwords, SSH keys) are encrypted using Fernet encryption before being stored in the database.
                </AlertDescription>
              </Alert>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingServer ? 'Update' : 'Add'} Server
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Server Cards */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading servers...</p>
        </div>
      ) : servers.length === 0 ? (
        <Card className="border-border">
          <CardContent className="py-12 text-center">
            <Server className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No servers configured yet</p>
            <Button onClick={() => { resetForm(); setEditingServer(null); setDialogOpen(true); }} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Server
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {servers.map((server) => (
            <Card key={server.id} className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-12 h-12 rounded-lg ${serverTypeColors[server.server_type]} flex items-center justify-center text-2xl`}>
                      {serverTypeIcons[server.server_type]}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{server.name}</CardTitle>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs uppercase">
                          {server.server_type}
                        </Badge>
                        {server.is_active ? (
                          <Badge variant="success" className="text-xs gap-1">
                            <Check className="w-3 h-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs gap-1">
                            <X className="w-3 h-3" />
                            Inactive
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(server)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(server.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Host</p>
                    <p className="font-mono text-foreground">{server.host}:{server.port}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Username</p>
                    <p className="font-mono text-foreground">{server.username}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Remote Path</p>
                    <p className="font-mono text-foreground">{server.remote_path}</p>
                  </div>
                </div>

                {server.description && (
                  <p className="text-sm text-muted-foreground pt-2 border-t border-border">
                    {server.description}
                  </p>
                )}

                {server.last_connected && (
                  <div className="flex items-center gap-2 text-xs text-success pt-2">
                    <Check className="w-3 h-3" />
                    Last connected: {new Date(server.last_connected).toLocaleString()}
                  </div>
                )}

                <Button
                  onClick={() => handleTestConnection(server.id)}
                  disabled={testingServer === server.id}
                  variant="outline"
                  className="w-full gap-2 mt-4"
                >
                  {testingServer === server.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      Testing Connection...
                    </>
                  ) : (
                    <>
                      <Wifi className="w-4 h-4" />
                      Test Connection
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

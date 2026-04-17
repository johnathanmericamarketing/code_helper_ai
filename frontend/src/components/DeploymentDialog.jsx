import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Server, Upload, CheckCircle, AlertTriangle, Rocket } from 'lucide-react';
import { serversService, requestsService } from '@/lib/firebase-service';
import { toast } from 'sonner';

export const DeploymentDialog = ({ requestId, codeChanges, onDeploySuccess, triggerButton }) => {
  const [open, setOpen] = useState(false);
  const [servers, setServers] = useState([]);
  const [selectedServer, setSelectedServer] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [deploying, setDeploying] = useState(false);
  const [loadingServers, setLoadingServers] = useState(false);

  useEffect(() => {
    if (open) {
      fetchServers();
      // Pre-select all files
      setSelectedFiles(codeChanges.map(c => c.file_path));
    }
  }, [open, codeChanges]);

  const fetchServers = async () => {
    setLoadingServers(true);
    try {
      const allServers = await serversService.list();
      const activeServers = allServers.filter(s => s.is_active);
      setServers(activeServers);
      if (activeServers.length > 0) {
        setSelectedServer(activeServers[0].id);
      }
    } catch (error) {
      console.error('Error fetching servers:', error);
      toast.error('Failed to load servers');
    } finally {
      setLoadingServers(false);
    }
  };

  const handleDeploy = async () => {
    if (!selectedServer) {
      toast.error('Please select a server');
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file to deploy');
      return;
    }

    setDeploying(true);
    try {
      // Map to expected format for cloud function
      const filesToDeploy = codeChanges
        .filter(c => selectedFiles.includes(c.file_path))
        .map(c => ({
          path: c.file_path,
          content: c.diff // Using 'diff' field which holds the full generated file content
        }));

      const response = await serversService.deployCode(selectedServer, filesToDeploy);

      if (response.success) {
        toast.success(response.message || 'Deployment successful!');
        await requestsService.updateStatus(requestId, 'deployed');
        setOpen(false);
        if (onDeploySuccess) {
          onDeploySuccess();
        }
      } else {
        toast.error(response.message || 'Deployment failed');
      }
    } catch (error) {
      console.error('Error deploying:', error);
      toast.error('Deployment failed: ' + error.message);
    } finally {
      setDeploying(false);
    }
  };

  const toggleFile = (filePath) => {
    setSelectedFiles(prev =>
      prev.includes(filePath)
        ? prev.filter(f => f !== filePath)
        : [...prev, filePath]
    );
  };

  const toggleAll = () => {
    if (selectedFiles.length === codeChanges.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(codeChanges.map(c => c.file_path));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button className="gap-2">
            <Rocket className="w-4 h-4" />
            Deploy to Server
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            Deploy Code to Server
          </DialogTitle>
          <DialogDescription>
            Upload generated code files to your server via FTP, SFTP, or SSH
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Server Selection */}
          <div className="space-y-3">
            <Label htmlFor="server">Select Destination Server</Label>
            {loadingServers ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                Loading servers...
              </div>
            ) : servers.length === 0 ? (
              <Alert>
                <Server className="w-4 h-4" />
                <AlertTitle>No Servers Configured</AlertTitle>
                <AlertDescription>
                  You need to add at least one server connection before deploying. Go to Servers page to configure.
                </AlertDescription>
              </Alert>
            ) : (
              <Select value={selectedServer} onValueChange={setSelectedServer}>
                <SelectTrigger id="server">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {servers.map((server) => (
                    <SelectItem key={server.id} value={server.id}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs uppercase">
                          {server.server_type}
                        </Badge>
                        <span>{server.name}</span>
                        <span className="text-muted-foreground">({server.host})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* File Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Select Files to Deploy</Label>
              <Button variant="ghost" size="sm" onClick={toggleAll}>
                {selectedFiles.length === codeChanges.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto border border-border rounded-lg p-3">
              {codeChanges.map((change, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <Checkbox
                    id={`file-${index}`}
                    checked={selectedFiles.includes(change.file_path)}
                    onCheckedChange={() => toggleFile(change.file_path)}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={`file-${index}`}
                      className="font-mono text-sm cursor-pointer"
                    >
                      {change.file_path}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {change.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedFiles.length} of {codeChanges.length} files selected
            </p>
          </div>

          {/* Deployment Info */}
          {selectedServer && servers.find(s => s.id === selectedServer) && (
            <Alert>
              <Upload className="w-4 h-4" />
              <AlertTitle>Deployment Details</AlertTitle>
              <AlertDescription className="space-y-1">
                <p>Files will be uploaded to:</p>
                <p className="font-mono text-xs bg-muted p-2 rounded mt-2">
                  {servers.find(s => s.id === selectedServer)?.remote_path}
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Warning */}
          <Alert variant="destructive">
            <AlertTriangle className="w-4 h-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Deployment will overwrite existing files on the server. Make sure you have backups before proceeding.
            </AlertDescription>
          </Alert>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={deploying}>
              Cancel
            </Button>
            <Button
              onClick={handleDeploy}
              disabled={deploying || !selectedServer || selectedFiles.length === 0 || servers.length === 0}
              className="gap-2"
            >
              {deploying ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  Deploying...
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  Deploy Now
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { Github, Plus, Trash2, Loader2, CheckCircle2, XCircle, Key, GitBranch, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { githubService } from '@/lib/firebase-service';

/* ── Add Connection Form ─────────────────────────────────── */
const AddGithubForm = ({ onSaved, onCancel }) => {
  const [name, setName]             = useState('');
  const [token, setToken]           = useState('');
  const [username, setUsername]     = useState('');
  const [repo, setRepo]             = useState('');
  const [branch, setBranch]         = useState('main');
  const [saving, setSaving]         = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim() || !token.trim()) {
      toast.error('Name and Personal Access Token are required.');
      return;
    }
    setSaving(true);
    try {
      await githubService.create({
        name:           name.trim(),
        access_token:   token.trim(),
        username:       username.trim() || '',
        default_repo:   repo.trim() || '',
        default_branch: branch.trim() || 'main',
        is_active:      true,
      });
      toast.success(`GitHub connection "${name}" saved.`);
      onSaved();
    } catch (err) {
      console.error(err);
      toast.error('Could not save connection. Check your token and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="rounded-[var(--radius-card)] border p-6 space-y-4"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
    >
      <h4 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
        Add GitHub Connection
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-1">
          <Label style={{ color: 'var(--text-secondary)' }}>Connection name *</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. My GitHub"
            required
            className="border-[var(--border-subtle)] rounded-[var(--radius-button)]"
            style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}
          />
        </div>

        {/* GitHub Username */}
        <div className="space-y-1">
          <Label style={{ color: 'var(--text-secondary)' }}>GitHub username</Label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="octocat"
            className="border-[var(--border-subtle)] rounded-[var(--radius-button)]"
            style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}
          />
        </div>

        {/* Personal Access Token */}
        <div className="space-y-1 sm:col-span-2">
          <Label style={{ color: 'var(--text-secondary)' }}>Personal Access Token (PAT) *</Label>
          <Input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_••••••••••••••••••••"
            required
            className="border-[var(--border-subtle)] rounded-[var(--radius-button)] font-mono text-sm"
            style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}
          />
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Generate at GitHub → Settings → Developer settings → Personal access tokens. 
            Needs <code style={{ color: 'var(--accent-500)' }}>repo</code> scope.
          </p>
        </div>

        {/* Default Repo */}
        <div className="space-y-1">
          <Label style={{ color: 'var(--text-secondary)' }}>Default repository</Label>
          <Input
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="username/my-repo"
            className="border-[var(--border-subtle)] rounded-[var(--radius-button)]"
            style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}
          />
        </div>

        {/* Default Branch */}
        <div className="space-y-1">
          <Label style={{ color: 'var(--text-secondary)' }}>Default branch</Label>
          <Input
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            placeholder="main"
            className="border-[var(--border-subtle)] rounded-[var(--radius-button)]"
            style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="rounded-[var(--radius-button)]"
          style={{ color: 'var(--text-muted)' }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={saving}
          className="gap-2 rounded-[var(--radius-button)] text-white"
          style={{ backgroundColor: 'var(--accent-600)' }}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
          {saving ? 'Saving…' : 'Save Connection'}
        </Button>
      </div>
    </form>
  );
};

/* ── Single connection row ───────────────────────────────── */
const ConnectionRow = ({ conn, onDeleted }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Remove "${conn.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await githubService.delete(conn.id);
      toast.success(`"${conn.name}" removed.`);
      onDeleted();
    } catch {
      toast.error('Could not remove connection.');
      setDeleting(false);
    }
  };

  return (
    <div
      className="flex items-center justify-between gap-4 rounded-[var(--radius-card)] border p-4"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: 'rgba(139,92,246,0.1)' }}
        >
          <Github className="w-5 h-5" style={{ color: 'var(--accent-500)' }} />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
            {conn.name}
          </p>
          <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
            {conn.username && <span>@{conn.username} · </span>}
            {conn.default_repo || 'No repo set'}{conn.default_branch ? ` (${conn.default_branch})` : ''}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {conn.is_active
          ? <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--success-text)' }} />
          : <XCircle className="w-4 h-4" style={{ color: 'var(--danger-text)' }} />
        }
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={deleting}
          className="w-8 h-8 rounded-lg"
          style={{ color: 'var(--danger-text)' }}
        >
          {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};

/* ── Main GithubTab ──────────────────────────────────────── */
export const GithubTab = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showForm, setShowForm]       = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // githubService.list() is scoped to the logged-in user via userId
      const list = await githubService.list();
      setConnections(list);
    } catch (err) {
      console.error(err);
      toast.error('Could not load GitHub connections.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSaved = () => {
    setShowForm(false);
    load();
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            GitHub Repositories
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Link your project to a GitHub repo to push commits directly.
          </p>
        </div>
        <Button
          onClick={() => setShowForm((v) => !v)}
          className="gap-2 text-white rounded-[var(--radius-button)]"
          style={{ backgroundColor: showForm ? 'var(--bg-muted)' : '#24292F', color: showForm ? 'var(--text-primary)' : '#fff' }}
        >
          {showForm
            ? <><ChevronUp className="w-4 h-4" /> Cancel</>
            : <><Plus className="w-4 h-4" /> Link Repo</>
          }
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <AddGithubForm onSaved={handleSaved} onCancel={() => setShowForm(false)} />
      )}

      {/* Connection list / empty state */}
      {loading ? (
        <div className="flex items-center gap-2 py-10 justify-center" style={{ color: 'var(--text-muted)' }}>
          <Loader2 className="w-5 h-5 animate-spin" /> Loading…
        </div>
      ) : connections.length === 0 && !showForm ? (
        <div
          className="rounded-[var(--radius-card)] border border-dashed p-12 text-center"
          style={{ borderColor: 'var(--border-strong)', backgroundColor: 'var(--bg-surface)' }}
        >
          <Github className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: 'var(--text-muted)' }} />
          <h4 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            No repositories linked
          </h4>
          <p className="text-sm max-w-sm mx-auto mb-6" style={{ color: 'var(--text-secondary)' }}>
            Connect your GitHub account to enable automatic PR creation and commit tracking.
          </p>
          <Button
            onClick={() => setShowForm(true)}
            className="gap-2 rounded-[var(--radius-button)] text-white"
            style={{ backgroundColor: 'var(--accent-600)' }}
          >
            <Github className="w-4 h-4" /> Connect GitHub
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {connections.map((conn) => (
            <ConnectionRow key={conn.id} conn={conn} onDeleted={load} />
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Loader2, GitBranch } from 'lucide-react';

import { VersionList }          from '@/components/versions/VersionList';
import { VersionFilters }       from '@/components/versions/VersionFilters';
import { VersionCompareDrawer } from '@/components/versions/VersionCompareDrawer';

import { useProject }     from '@/context/ProjectContext';
import { versionsService } from '@/lib/firebase-service';

export const VersionsPage = () => {
  const { activeProject } = useProject();
  const [versions, setVersions]     = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [search, setSearch]         = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected]     = useState(null);

  useEffect(() => {
    if (!activeProject?.id) {
      setVersions([]);
      setFiltered([]);
      return;
    }
    loadVersions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProject?.id]);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(versions);
    } else {
      const q = search.toLowerCase();
      setFiltered(versions.filter(v =>
        (v.prompt || v.raw_request || '').toLowerCase().includes(q)
      ));
    }
  }, [search, versions]);

  const loadVersions = async () => {
    setLoading(true);
    try {
      const data = await versionsService.list(activeProject.id);
      setVersions(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
      toast.error('Could not load versions.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = (version) => {
    setSelected(version);
    setDrawerOpen(true);
  };

  const handleRestore = async (version) => {
    // Fire a toast — actual restore into Studio requires navigation
    toast.info('Opening Studio with this version restored…');
    // Navigate to studio (handled by parent if needed; version data is passed via state)
    // For now, copy the code to clipboard as a fallback
    if (version.previewHtml || version.generated_code) {
      await navigator.clipboard.writeText(version.previewHtml || version.generated_code).catch(() => {});
      toast.success('Version code copied to clipboard. Paste it into the Studio editor.');
    }
  };

  if (!activeProject) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--text-muted)] fade-in">
        <p>Please select a project to view its version history.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-in pb-12">

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
          <GitBranch className="w-7 h-7" style={{ color: 'var(--accent-500)' }} />
          Versions
        </h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">
          Every draft and published change is saved here. Compare or restore any snapshot.
        </p>
      </div>

      <VersionFilters onSearch={setSearch} />

      {loading ? (
        <div className="flex items-center justify-center py-20 text-[var(--text-muted)]">
          <Loader2 className="w-6 h-6 animate-spin mr-3" /> Loading versions…
        </div>
      ) : (
        <VersionList
          versions={filtered}
          onCompare={handleCompare}
          onRestore={handleRestore}
        />
      )}

      <VersionCompareDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        version={selected}
        onRestore={handleRestore}
      />
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '@/context/ProjectContext';
import { requestsService } from '@/lib/firebase-service';
import { toast } from 'sonner';

import { VersionFilters } from '@/components/versions/VersionFilters';
import { VersionList } from '@/components/versions/VersionList';
import { VersionCompareDrawer } from '@/components/versions/VersionCompareDrawer';

export const VersionsPage = () => {
  const { activeProject } = useProject();
  const navigate = useNavigate();
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [compareVersion, setCompareVersion] = useState(null);

  useEffect(() => {
    if (!activeProject) {
      setLoading(false);
      return;
    }

    const unsubscribe = requestsService.subscribeToProjectRequests(
      activeProject.id,
      (data) => {
        setVersions(data || []);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [activeProject]);

  const filteredVersions = versions.filter(v => 
    v.raw_request?.toLowerCase().includes(search.toLowerCase()) ||
    v.prompt?.toLowerCase().includes(search.toLowerCase())
  );

  const handleRestore = async (version) => {
    try {
      // Mark it as a draft (validated) so the Studio picks it up
      await requestsService.updateStatus(version.id, 'validated');
      toast.success('Version loaded as active draft.');
      navigate('/app/studio', { state: { restoreRequestId: version.id } });
    } catch (err) {
      console.error(err);
      toast.error('Failed to restore version.');
    }
  };

  if (!activeProject) {
    return (
      <div className="flex items-center justify-center h-full text-muted-custom fade-in">
        <p>Please select a project first to view its versions.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 fade-in pb-12">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary-custom tracking-tight">Versions</h1>
          <p className="text-muted-custom text-sm md:text-base mt-1 max-w-xl">
            Track what changed, compare drafts and published versions, and restore with confidence.
          </p>
        </div>
      </div>

      <div className="bg-surface rounded-[var(--radius-card)] p-6 shadow-sm border border-subtle">
        <VersionFilters onSearch={setSearch} onFilterChange={() => {}} />
        
        {loading ? (
          <div className="py-12 text-center text-muted-custom">Loading versions...</div>
        ) : (
          <VersionList 
            versions={filteredVersions} 
            onCompare={(v) => setCompareVersion(v)}
            onRestore={handleRestore}
          />
        )}
      </div>

      <VersionCompareDrawer 
        open={!!compareVersion}
        onOpenChange={(isOpen) => !isOpen && setCompareVersion(null)}
        version={compareVersion}
        onRestore={handleRestore}
      />

    </div>
  );
};

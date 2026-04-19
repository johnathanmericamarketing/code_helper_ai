import React from 'react';
import { useProject } from '@/context/ProjectContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { HostingTab } from '@/components/connections/HostingTab';
import { GithubTab } from '@/components/connections/GithubTab';
import { WorkspacesTab } from '@/components/connections/WorkspacesTab';

export const ConnectionsPage = () => {
  const { activeProject } = useProject();

  if (!activeProject) {
    return (
      <div className="flex items-center justify-center h-full text-muted-custom fade-in">
        <p>Please select a project first to manage its connections.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 fade-in pb-12">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary-custom tracking-tight">Connections</h1>
          <p className="text-muted-custom text-sm md:text-base mt-1 max-w-xl">
            Connect where your website lives so previews can become real deployments.
          </p>
        </div>
      </div>

      <div className="bg-surface rounded-[var(--radius-card)] p-6 shadow-sm border border-subtle">
        <Tabs defaultValue="hosting" className="w-full">
          <TabsList className="mb-6 bg-muted-custom rounded-[var(--radius-button)] p-1 h-12">
            <TabsTrigger value="hosting" className="rounded-xl px-6 data-[state=active]:bg-surface data-[state=active]:text-primary-custom">
              Hosting
            </TabsTrigger>
            <TabsTrigger value="github" className="rounded-xl px-6 data-[state=active]:bg-surface data-[state=active]:text-primary-custom">
              GitHub
            </TabsTrigger>
            <TabsTrigger value="workspaces" className="rounded-xl px-6 data-[state=active]:bg-surface data-[state=active]:text-primary-custom">
              Workspaces
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="hosting" className="focus-visible:outline-none focus-visible:ring-0">
            <HostingTab />
          </TabsContent>
          <TabsContent value="github" className="focus-visible:outline-none focus-visible:ring-0">
            <GithubTab />
          </TabsContent>
          <TabsContent value="workspaces" className="focus-visible:outline-none focus-visible:ring-0">
            <WorkspacesTab />
          </TabsContent>
        </Tabs>
      </div>

    </div>
  );
};

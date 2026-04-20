import React, { useState } from 'react';
import { Link2, Server, Github } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { HostingTab }    from '@/components/connections/HostingTab';
import { GithubTab }     from '@/components/connections/GithubTab';
import { WorkspacesTab } from '@/components/connections/WorkspacesTab';

export const ConnectionsPage = () => {
  const [tab, setTab] = useState('hosting');

  return (
    <div className="max-w-4xl mx-auto space-y-8 fade-in pb-12">

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
          <Link2 className="w-7 h-7" style={{ color: 'var(--accent-500)' }} />
          Connections
        </h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">
          Connect your hosting, version control, and local workspaces for one-click deployment.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList
          className="w-full sm:w-auto rounded-xl p-1 gap-1"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
        >
          {[
            { value: 'hosting',    label: 'Hosting',    icon: Server  },
            { value: 'github',     label: 'GitHub',     icon: Github  },
            { value: 'workspaces', label: 'Workspaces', icon: Link2   },
          ].map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="gap-1.5 rounded-lg text-[var(--text-muted)] data-[state=active]:text-[var(--text-primary)] data-[state=active]:bg-[var(--accent-50)] data-[state=active]:text-[var(--accent-500)]"
            >
              <Icon className="w-4 h-4" /> {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="hosting"    className="mt-6"><HostingTab /></TabsContent>
        <TabsContent value="github"     className="mt-6"><GithubTab /></TabsContent>
        <TabsContent value="workspaces" className="mt-6"><WorkspacesTab /></TabsContent>
      </Tabs>
    </div>
  );
};

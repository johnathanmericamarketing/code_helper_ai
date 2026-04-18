import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  History as HistoryIcon, CheckCircle2, Rocket, Download, Sparkles, Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { useProject } from '@/context/ProjectContext';

function toDate(val) {
  if (!val) return null;
  if (val instanceof Date) return val;
  if (typeof val === 'string' || typeof val === 'number') return new Date(val);
  if (val?.toDate) return val.toDate();
  if (val?.seconds != null) return new Date(val.seconds * 1000);
  return null;
}

function formatMonthKey(d) {
  if (!d) return 'Unknown';
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

function formatDay(d) {
  if (!d) return '';
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(d) {
  if (!d) return '';
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export const HistoryPage = () => {
  const navigate = useNavigate();
  const { activeProject } = useProject();

  const entries = useMemo(() => {
    const raw = Array.isArray(activeProject?.changeLog) ? activeProject.changeLog : [];
    return raw
      .map((e) => ({ ...e, _at: toDate(e.at) }))
      .sort((a, b) => (b._at?.getTime() || 0) - (a._at?.getTime() || 0));
  }, [activeProject]);

  const grouped = useMemo(() => {
    const map = new Map();
    entries.forEach((e) => {
      const key = formatMonthKey(e._at);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(e);
    });
    return Array.from(map.entries());
  }, [entries]);

  const handleDownload = () => {
    if (!entries.length) {
      toast.info('No changes to export yet.');
      return;
    }
    const header = ['Published at', 'Summary', 'Model', 'Request ID'];
    const rows = entries.map((e) => [
      e._at ? e._at.toISOString() : '',
      (e.summary || '').replace(/"/g, '""'),
      e.model || '',
      e.requestId || '',
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${c ?? ''}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-changes-${(activeProject?.name || 'site').replace(/\s+/g, '-').toLowerCase()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Report downloaded.');
  };

  if (!activeProject) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Changes</h1>
          <p className="text-muted-foreground mt-1">A timeline of everything you've published on your site.</p>
        </div>
        <Alert>
          <Info className="w-4 h-4"/>
          <AlertTitle>Pick a project first</AlertTitle>
          <AlertDescription>
            Select a project from the sidebar to see its change history.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Changes</h1>
          <p className="text-muted-foreground mt-1">
            Timeline of everything you've published on <span className="text-foreground font-medium">{activeProject.name}</span>.
          </p>
        </div>
        <Button variant="outline" onClick={handleDownload} disabled={!entries.length} className="gap-2">
          <Download className="w-4 h-4"/> Download report
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total changes</p>
            <p className="text-3xl font-bold text-foreground mt-1">{entries.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Last published</p>
            <p className="text-lg font-semibold text-foreground mt-1">
              {entries[0]?._at ? formatDay(entries[0]._at) : '—'}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Active months</p>
            <p className="text-3xl font-bold text-foreground mt-1">{grouped.length}</p>
          </CardContent>
        </Card>
      </div>

      {entries.length === 0 ? (
        <Card className="border-border">
          <CardContent className="py-12 text-center space-y-3">
            <Sparkles className="w-12 h-12 text-muted-foreground mx-auto opacity-50"/>
            <p className="font-medium text-foreground">No changes published yet</p>
            <p className="text-sm text-muted-foreground">
              Head to the Studio, describe what you want to change, and publish. Your timeline builds up here.
            </p>
            <Button onClick={() => navigate('/app/studio')} className="mt-2 gap-2">
              <Rocket className="w-4 h-4"/> Open the Studio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {grouped.map(([month, items]) => (
            <div key={month} className="space-y-3">
              <div className="flex items-baseline gap-3">
                <h2 className="text-lg font-semibold text-foreground">{month}</h2>
                <span className="text-xs text-muted-foreground">{items.length} change{items.length === 1 ? '' : 's'}</span>
              </div>
              <div className="relative pl-6 border-l-2 border-border space-y-3">
                {items.map((e, i) => (
                  <div
                    key={i}
                    className="relative p-4 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors cursor-pointer"
                    onClick={() => e.requestId && navigate(`/app/request/${e.requestId}`)}
                  >
                    <div className="absolute -left-[29px] top-5 w-4 h-4 rounded-full bg-success/20 border-2 border-success flex items-center justify-center">
                      <CheckCircle2 className="w-2.5 h-2.5 text-success"/>
                    </div>
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          You asked for: <span className="font-semibold">{e.summary || 'A change'}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Published {formatDay(e._at)} at {formatTime(e._at)}
                          {e.model && <> · built with <span className="font-mono">{e.model}</span></>}
                        </p>
                      </div>
                      <Badge variant="success" className="gap-1 shrink-0">
                        <Rocket className="w-3 h-3"/> Live
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

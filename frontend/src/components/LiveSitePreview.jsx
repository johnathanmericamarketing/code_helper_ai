import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Globe, RefreshCw, ExternalLink, AlertTriangle, Monitor, Smartphone } from 'lucide-react';

const VIEWPORTS = {
  desktop: { width: null, label: 'Desktop' },   // null = fill container
  mobile:  { width: 390,  label: 'Mobile' },    // iPhone 14 Pro-ish
};

function normalizeUrl(raw) {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export const LiveSitePreview = ({ initialUrl = '', title = 'Your Site' }) => {
  const normalizedInitial = normalizeUrl(initialUrl);
  const [inputValue, setInputValue] = useState(normalizedInitial);
  const [loadedUrl, setLoadedUrl] = useState(normalizedInitial);
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(Boolean(normalizedInitial));
  const [maybeBlocked, setMaybeBlocked] = useState(false);
  const [viewport, setViewport] = useState('desktop');
  const loadTimerRef = useRef(null);

  useEffect(() => {
    const normalized = normalizeUrl(initialUrl);
    setInputValue(normalized);
    setLoadedUrl(normalized);
    setIframeKey((k) => k + 1);
    setIsLoading(Boolean(normalized));
    setMaybeBlocked(false);
  }, [initialUrl]);

  useEffect(() => {
    if (!loadedUrl) return;
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    loadTimerRef.current = setTimeout(() => {
      setMaybeBlocked(true);
    }, 6000);
    return () => {
      if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    };
  }, [loadedUrl, iframeKey]);

  const go = () => {
    const normalized = normalizeUrl(inputValue);
    if (!normalized) return;
    setInputValue(normalized);
    setLoadedUrl(normalized);
    setIframeKey((k) => k + 1);
    setIsLoading(true);
    setMaybeBlocked(false);
  };

  const refresh = () => {
    if (!loadedUrl) return;
    setIframeKey((k) => k + 1);
    setIsLoading(true);
    setMaybeBlocked(false);
  };

  const openInNewTab = () => {
    const target = normalizeUrl(inputValue) || loadedUrl;
    if (!target) return;
    window.open(target, '_blank', 'noopener,noreferrer');
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
  };

  return (
    <Card className="border-border/50 shadow-sm flex flex-col h-full overflow-hidden bg-background">
      {/* Browser-style toolbar */}
      <div className="h-12 border-b border-border/50 bg-muted/30 px-3 flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1.5 opacity-60 shrink-0">
          <div className="w-3 h-3 rounded-full bg-destructive/80" />
          <div className="w-3 h-3 rounded-full bg-warning/80" />
          <div className="w-3 h-3 rounded-full bg-success/80" />
        </div>

        <div className="h-4 w-[1px] bg-border mx-1 shrink-0" />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={refresh}
          disabled={!loadedUrl}
          className="h-7 w-7 shrink-0"
          title="Refresh"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>

        <div className="flex-1 flex items-center bg-background/80 border border-border/50 rounded-md px-2 h-8 min-w-0">
          <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0 mr-2" />
          <Input
            type="url"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); go(); } }}
            placeholder="https://your-site.com"
            className="h-6 border-0 bg-transparent p-0 text-xs focus-visible:ring-0 shadow-none"
          />
        </div>

        <div className="flex items-center border border-border/50 rounded-md overflow-hidden shrink-0">
          <Button
            type="button"
            variant={viewport === 'desktop' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewport('desktop')}
            className="h-8 w-8 rounded-none"
            title="Desktop view"
            aria-label="Desktop view"
            aria-pressed={viewport === 'desktop'}
          >
            <Monitor className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            variant={viewport === 'mobile' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewport('mobile')}
            className="h-8 w-8 rounded-none border-l border-border/50"
            title="Mobile view"
            aria-label="Mobile view"
            aria-pressed={viewport === 'mobile'}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={openInNewTab}
          disabled={!normalizeUrl(inputValue)}
          className="h-8 gap-1.5 shrink-0 text-xs"
          title="Open in new tab"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Open</span>
        </Button>

        <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-primary/10 text-primary border-primary/20 border shrink-0 hidden lg:inline-flex">
          {title}
        </Badge>
      </div>

      <CardContent className="p-0 flex-1 relative bg-white">
        {!loadedUrl ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-3 p-6 text-center">
            <Globe className="w-12 h-12 opacity-30" />
            <div>
              <p className="font-medium text-foreground">See your site here</p>
              <p className="text-xs mt-1">Type your website address in the bar above (like example.com) and press Enter.</p>
            </div>
          </div>
        ) : (
          <>
            <div className={`absolute inset-0 flex items-start justify-center overflow-auto ${viewport === 'mobile' ? 'bg-muted/40 p-4' : ''}`}>
              <iframe
                key={iframeKey}
                src={loadedUrl}
                onLoad={handleIframeLoad}
                style={viewport === 'mobile' ? { width: VIEWPORTS.mobile.width, maxWidth: '100%' } : undefined}
                className={`h-full min-h-[500px] border-0 bg-white ${viewport === 'mobile' ? 'shadow-xl rounded-lg border border-border' : 'w-full'}`}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                title={title}
              />
            </div>

            {isLoading && (
              <div className="absolute top-2 right-2 bg-background/90 border border-border rounded-md px-2 py-1 text-[11px] text-muted-foreground flex items-center gap-1.5 shadow-sm">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Loading…
              </div>
            )}

            {maybeBlocked && (
              <div className="absolute bottom-3 left-3 right-3 bg-warning/10 border border-warning/40 rounded-md px-3 py-2 text-xs text-foreground flex items-start gap-2 shadow-sm backdrop-blur-sm">
                <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Can't see your site?</p>
                  <p className="text-muted-foreground mt-0.5">
                    Some websites won't show up inside this preview.{' '}
                    <button className="underline font-medium text-foreground hover:text-primary" onClick={openInNewTab}>
                      Open in a new tab
                    </button>{' '}
                    to view it.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

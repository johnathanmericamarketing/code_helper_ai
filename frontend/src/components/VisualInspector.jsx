import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MousePointer2, ImagePlus, Loader2, Maximize, Monitor, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { generateImage } from '@/lib/media-service';

export const VisualInspector = ({ 
  htmlContent = '<div><h1>Hello World</h1><div style="width: 400px; height: 300px; background: #eee;">Click me</div></div>',
  title = 'Visual Inspector',
  isPreview = false
}) => {
  const iframeRef = useRef(null);
  const [selectedElement, setSelectedElement] = useState(null); // { id, tagName, width, height }
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewport, setViewport] = useState('desktop');
  
  // Prepare html with injected script
  const inspectorScript = `
    <script>
      const highlighter = document.createElement('div');
      highlighter.style.position = 'fixed';
      highlighter.style.pointerEvents = 'none';
      highlighter.style.border = '2px dashed #3b82f6';
      highlighter.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
      highlighter.style.zIndex = '999999';
      highlighter.style.transition = 'all 0.1s ease';
      highlighter.style.boxSizing = 'border-box';
      highlighter.style.display = 'none';
      document.body.appendChild(highlighter);

      // Tooltip to show size
      const tooltip = document.createElement('div');
      tooltip.style.position = 'absolute';
      tooltip.style.bottom = '-24px';
      tooltip.style.right = '0';
      tooltip.style.backgroundColor = '#3b82f6';
      tooltip.style.color = 'white';
      tooltip.style.padding = '2px 8px';
      tooltip.style.fontSize = '12px';
      tooltip.style.fontFamily = 'sans-serif';
      tooltip.style.borderRadius = '4px';
      tooltip.style.pointerEvents = 'none';
      highlighter.appendChild(tooltip);

      let hoveredEl = null;

      document.addEventListener('mousemove', (e) => {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (!el || el === document.body || el === document.documentElement || el.id === 'vi-root') {
          highlighter.style.display = 'none';
          hoveredEl = null;
          return;
        }
        hoveredEl = el;
        const rect = el.getBoundingClientRect();
        highlighter.style.display = 'block';
        highlighter.style.top = rect.top + 'px';
        highlighter.style.left = rect.left + 'px';
        highlighter.style.width = Math.max(rect.width, 20) + 'px';
        highlighter.style.height = Math.max(rect.height, 20) + 'px';
        tooltip.innerText = Math.round(rect.width) + 'x' + Math.round(rect.height);
      });

      document.addEventListener('click', (e) => {
        if (!hoveredEl) return;
        e.preventDefault();
        e.stopPropagation();
        
        const rect = hoveredEl.getBoundingClientRect();
        if (!hoveredEl.id) {
           hoveredEl.id = 'vi-' + Math.random().toString(36).substr(2, 9);
        }
        
        window.parent.postMessage({
          type: 'ELEMENT_CLICKED',
          id: hoveredEl.id,
          tagName: hoveredEl.tagName.toLowerCase(),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        }, '*');
      }, true);

      window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'INJECT_IMAGE') {
          const el = document.getElementById(event.data.id);
          if (el) {
            if (el.tagName.toLowerCase() === 'img') {
              el.src = event.data.url;
            } else {
              el.style.backgroundImage = 'url(' + event.data.url + ')';
              el.style.backgroundSize = 'cover';
              el.style.backgroundPosition = 'center';
              el.style.backgroundRepeat = 'no-repeat';
            }
          }
        }
      });
      console.log('Visual Inspector Ready');
    </script>
  `;

  // Provide Tailwind CDN just in case the HTML doesn't have it, so the classes render beautifully
  const tailwindCdn = '<script src="https://cdn.tailwindcss.com"></script>';
  const finalHtml = `${htmlContent}\n${tailwindCdn}\n${inspectorScript}`;

  useEffect(() => {
    const handleMessage = (event) => {
      // Ensure the message is from our trusted iframe logic to avoid outside interference
      if (event.data && event.data.type === 'ELEMENT_CLICKED') {
        setSelectedElement(event.data);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const getAspectRatioStr = (w, h) => {
    // Simplify for common imagen ratios: 1:1, 16:9, 4:3, 3:4, 9:16
    if (!w || !h) return '1:1';
    const ratio = w / h;
    if (ratio > 1.7) return '16:9';
    if (ratio > 1.2) return '4:3';
    if (ratio > 0.8) return '1:1';
    if (ratio >= 0.6) return '3:4';
    return '9:16';
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      toast.info('Generating AI image for precise container...');
      
      // Inject aspect ratio instruction into the prompt secretly or pass to backend
      // But standard generateImage just takes prompt. Best is to append ratio info into the prompt for Imagen.
      const ratioStr = getAspectRatioStr(selectedElement.width, selectedElement.height);
      const enhancedPrompt = `${prompt}, aspect ratio exactly ${ratioStr}, high quality`;

      const result = await generateImage(enhancedPrompt);
      const dataUrl = `data:${result.mimeType};base64,${result.base64}`;
      
      // Send message to iframe to inject image
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage({
          type: 'INJECT_IMAGE',
          id: selectedElement.id,
          url: dataUrl
        }, '*');
      }

      toast.success('Image injected directly into UI!');
      setSelectedElement(null);
      setPrompt('');
    } catch (e) {
      console.error(e);
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Card className="border-border/50 shadow-sm flex flex-col h-full overflow-hidden bg-background">
        {/* ClickUp-style Toolbar / Browser Header */}
        <div className="h-12 border-b border-border/50 bg-muted/30 px-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            {/* Fake Mac Window Controls */}
            <div className="flex items-center gap-1.5 opacity-60">
              <div className="w-3 h-3 rounded-full bg-destructive/80" />
              <div className="w-3 h-3 rounded-full bg-warning/80" />
              <div className="w-3 h-3 rounded-full bg-success/80" />
            </div>
            
            <div className="h-4 w-[1px] bg-border mx-1" />
            
            {/* Title */}
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-default">
              <MousePointer2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold tracking-wide">{title}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center border border-border/50 rounded-md overflow-hidden">
              <Button
                type="button"
                variant={viewport === 'desktop' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewport('desktop')}
                className="h-8 w-8 rounded-none"
                title="Desktop view"
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
                aria-pressed={viewport === 'mobile'}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </Button>
            </div>

            {isPreview ? (
              <Badge variant="default" className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-primary shadow-sm">
                Pending Approval
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer shadow-sm border-primary/20 border">
                Live Check
              </Badge>
            )}
          </div>
        </div>
        
        {/* Iframe Container with dot pattern background */}
        <CardContent className={`p-0 flex-1 relative bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] ${viewport === 'mobile' ? 'flex items-start justify-center p-4 overflow-auto bg-muted/40' : ''}`}>
          <iframe
            ref={iframeRef}
            srcDoc={finalHtml}
            style={viewport === 'mobile' ? { width: 390, maxWidth: '100%' } : undefined}
            className={`h-full min-h-[500px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] ${viewport === 'mobile' ? 'shadow-xl rounded-lg border border-border bg-white' : 'w-full'}`}
            sandbox="allow-scripts allow-same-origin"
            title="Visual Inspector"
          />
        </CardContent>
      </Card>

      <Dialog open={!!selectedElement} onOpenChange={(open) => !open && setSelectedElement(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImagePlus className="w-5 h-5 text-primary" />
              Generate Image
            </DialogTitle>
            <DialogDescription>
              We detected a <strong>{selectedElement?.width}x{selectedElement?.height}</strong> {selectedElement?.tagName} element. Enter a prompt to generate an image perfectly sized for this gap.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase">AI Image Prompt</span>
              <Textarea
                placeholder="E.g., A beautiful modern workspace with a laptop, cinematic lighting..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="h-24 resize-none"
              />
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-[10px]">
                <Maximize className="w-3 h-3 mr-1" />
                Detected: {selectedElement?.width}x{selectedElement?.height}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                Target Ratio: {getAspectRatioStr(selectedElement?.width, selectedElement?.height)}
              </Badge>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSelectedElement(null)} disabled={isGenerating}>Cancel</Button>
            <Button onClick={handleGenerate} disabled={!prompt.trim() || isGenerating} className="gap-2 shadow-primary/20 shadow-lg">
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
              {isGenerating ? 'Injecting Image...' : 'Generate & Inject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

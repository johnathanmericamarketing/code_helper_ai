import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Wand2, MousePointerClick, Copy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const getSelector = (el) => {
  if (!el) return '';
  if (el.id) return `#${el.id}`;
  if (el.classList?.length) return `.${Array.from(el.classList).slice(0, 3).join('.')}`;
  return el.tagName?.toLowerCase() || 'unknown';
};

const getElementType = (el) => {
  if (!el) return 'unknown';
  const tag = el.tagName?.toLowerCase();
  if (tag === 'img') return 'image';
  if (tag === 'button' || el.getAttribute('role') === 'button') return 'button';
  if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'label'].includes(tag)) return 'text';
  return 'container';
};

const getRecommendations = (elementType, rect, computedStyles) => {
  if (elementType === 'image') {
    const ideas = [];
    if (rect.width < 220) ideas.push('Try a larger image width (~320px+) to improve visual weight.');
    if (rect.height < 160) ideas.push('Increase image height or use a taller aspect ratio for better balance.');
    ideas.push('Prefer optimized formats (WebP/AVIF) and keep the subject centered.');
    ideas.push('Consider adding `object-cover` with a consistent aspect ratio for cleaner layout.');
    return ideas;
  }

  if (elementType === 'text') {
    const ideas = [];
    const fontSize = parseFloat(computedStyles.fontSize || '16');
    if (fontSize < 14) ideas.push('Increase font size slightly (14–16px minimum for body text).');
    ideas.push('Check contrast ratio against the background for readability.');
    ideas.push('For headings, increase weight or spacing before increasing size.');
    return ideas;
  }

  if (elementType === 'button') {
    return [
      'Increase click target to at least 40x40px.',
      'Use clearer hover/focus states to improve affordance.',
      'Validate contrast and hierarchy versus surrounding actions.',
    ];
  }

  return [
    'Review spacing consistency (padding/margin rhythm).',
    'Check responsive behavior across mobile/tablet/desktop.',
    'Simplify nested wrappers if this block is hard to style.',
  ];
};

export const VisualInspector = () => {
  const [enabled, setEnabled] = useState(false);
  const [selected, setSelected] = useState(null);
  const [rect, setRect] = useState(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const onClick = (event) => {
      if (panelRef.current?.contains(event.target)) return;
      event.preventDefault();
      event.stopPropagation();

      const el = event.target;
      const box = el.getBoundingClientRect();
      const styles = window.getComputedStyle(el);
      setSelected({
        selector: getSelector(el),
        tag: el.tagName?.toLowerCase() || 'unknown',
        className: el.className || '',
        type: getElementType(el),
        text: (el.textContent || '').trim().slice(0, 180),
        styles: {
          color: styles.color,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          backgroundColor: styles.backgroundColor,
        },
      });
      setRect({
        top: box.top + window.scrollY,
        left: box.left + window.scrollX,
        width: box.width,
        height: box.height,
      });
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [enabled]);

  const recommendations = useMemo(() => {
    if (!selected || !rect) return [];
    return getRecommendations(selected.type, rect, selected.styles);
  }, [selected, rect]);

  const handleCopyPrompt = async () => {
    if (!selected || !rect) return;
    const prompt = `Selected ${selected.type} element (${selected.selector}) [${Math.round(rect.width)}x${Math.round(rect.height)}].\nPlease suggest CSS/JS improvements for ${selected.tag} with focus on spacing, typography, and responsiveness.\nCurrent style: color=${selected.styles.color}, font-size=${selected.styles.fontSize}, background=${selected.styles.backgroundColor}.`;
    await navigator.clipboard.writeText(prompt);
    toast.success('Inspector prompt copied to clipboard');
  };

  return (
    <>
      {enabled && rect && (
        <div
          className="absolute border-2 border-primary pointer-events-none z-40 rounded-md"
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          }}
        />
      )}

      <div className="fixed bottom-4 right-4 z-50 w-[360px]" ref={panelRef}>
        {!enabled ? (
          <Button className="gap-2 shadow-lg" onClick={() => setEnabled(true)}>
            <Wand2 className="w-4 h-4" />
            Visual Inspector
          </Button>
        ) : (
          <Card className="shadow-xl border-primary/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <MousePointerClick className="w-4 h-4" />
                  Click Any Element
                </CardTitle>
                <Button size="icon" variant="ghost" onClick={() => setEnabled(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription>
                Click images, text, or buttons to inspect selector/class and get styling recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {selected ? (
                <>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">{selected.type}</Badge>
                    <Badge variant="secondary">{selected.tag}</Badge>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{selected.selector}</code>
                  </div>
                  {rect && (
                    <p className="text-xs text-muted-foreground">
                      Size: {Math.round(rect.width)} x {Math.round(rect.height)}
                    </p>
                  )}
                  {selected.text && (
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      Text: {selected.text}
                    </p>
                  )}
                  <div className="space-y-1">
                    <p className="text-xs font-semibold">Recommendations</p>
                    <ul className="text-xs text-muted-foreground list-disc ml-4 space-y-1">
                      {recommendations.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                  <Button size="sm" className="gap-2 w-full" onClick={handleCopyPrompt}>
                    <Copy className="w-3 h-3" />
                    Copy Edit Prompt
                  </Button>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Inspector is active. Click any element in the page to analyze it.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};


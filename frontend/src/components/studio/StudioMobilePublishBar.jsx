import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Trash2 } from 'lucide-react';

/**
 * StudioMobilePublishBar
 * Sticky bottom action bar shown on mobile only (md:hidden) when
 * a preview (futureAppCode) exists. Sits above the browser's safe-area
 * inset so it never overlaps home-indicator on iOS.
 */
export const StudioMobilePublishBar = ({ onPublish, onDiscard, isPublishing = false }) => (
  <div
    className="md:hidden fixed bottom-0 left-0 right-0 z-50"
    style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
  >
    {/* Frosted glass backdrop */}
    <div className="mx-3 mb-3 bg-card/95 backdrop-blur-md border border-indigo-500/30 rounded-2xl p-3 shadow-2xl shadow-indigo-900/20">
      <div className="flex gap-2">
        <Button
          variant="ghost"
          onClick={onDiscard}
          disabled={isPublishing}
          className="flex-1 text-muted-foreground hover:text-destructive h-11 text-sm font-medium rounded-xl gap-1.5"
        >
          <Trash2 className="w-4 h-4" />
          Discard
        </Button>

        <Button
          onClick={onPublish}
          disabled={isPublishing}
          className="flex-2 flex-grow-[2] bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white h-11 text-sm font-semibold rounded-xl gap-1.5 shadow-lg shadow-indigo-500/25 transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          {isPublishing ? 'Publishing…' : 'Publish Changes'}
        </Button>
      </div>
    </div>
  </div>
);

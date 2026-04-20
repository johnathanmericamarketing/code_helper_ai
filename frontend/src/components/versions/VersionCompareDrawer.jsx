import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

export const VersionCompareDrawer = ({ open, onOpenChange, version, onRestore }) => {
  if (!version) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full sm:max-w-2xl overflow-y-auto border-l"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-[var(--text-primary)]">Compare Version</SheetTitle>
          <SheetDescription className="text-[var(--text-muted)]">
            Review the changes in this snapshot before restoring it to the active Studio session.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Prompt */}
          <div
            className="rounded-[var(--radius-card)] border p-5"
            style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-subtle)' }}
          >
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Prompt / Request</h4>
            <p
              className="text-sm rounded-xl p-3 border leading-relaxed"
              style={{
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-muted)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              {version.raw_request || version.prompt || 'No prompt recorded'}
            </p>
          </div>

          {/* Code preview */}
          <div
            className="rounded-[var(--radius-card)] border p-5"
            style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-subtle)' }}
          >
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Preview Code</h4>
            <div
              className="rounded-xl overflow-x-auto text-xs font-mono max-h-96 overflow-y-auto p-4"
              style={{ backgroundColor: '#0d1117', color: 'var(--accent-200)' }}
            >
              <pre>{version.generated_code || version.previewHtml || '// No code available'}</pre>
            </div>
          </div>

          {/* Actions */}
          <div
            className="flex justify-end gap-3 pt-4 border-t"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-[var(--radius-button)] border-[var(--border-subtle)] text-[var(--text-secondary)]"
            >
              Cancel
            </Button>
            <Button
              onClick={() => { onRestore(version); onOpenChange(false); }}
              className="gap-2 rounded-[var(--radius-button)] text-white"
              style={{ backgroundColor: 'var(--accent-600)' }}
            >
              <RotateCcw className="w-4 h-4" /> Restore to Studio
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

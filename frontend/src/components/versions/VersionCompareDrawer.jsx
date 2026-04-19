import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

export const VersionCompareDrawer = ({ open, onOpenChange, version, onRestore }) => {
  if (!version) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto bg-app border-l border-subtle">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-primary-custom">Compare Version</SheetTitle>
          <SheetDescription>
            Review the changes in this draft before restoring it to the active Studio session.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <div className="bg-surface border border-subtle rounded-[var(--radius-card)] p-5">
            <h4 className="text-sm font-semibold text-primary-custom mb-2">Prompt / Request</h4>
            <p className="text-sm text-secondary-custom bg-muted-custom p-3 rounded-xl border border-subtle">
              {version.raw_request || version.prompt || 'No prompt recorded'}
            </p>
          </div>

          <div className="bg-surface border border-subtle rounded-[var(--radius-card)] p-5">
            <h4 className="text-sm font-semibold text-primary-custom mb-2">Preview Code</h4>
            <div className="bg-secondary-custom text-[var(--accent-50)] p-4 rounded-xl overflow-x-auto text-xs font-mono max-h-96 overflow-y-auto">
              <pre>{version.generated_code || version.previewHtml || '// No code available for this snapshot'}</pre>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-subtle">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)]">
              Cancel
            </Button>
            <Button 
              onClick={() => {
                onRestore(version);
                onOpenChange(false);
              }} 
              className="gap-2 rounded-[var(--radius-button)] bg-[var(--accent-600)] hover:bg-[var(--accent-700)] text-white"
            >
              <RotateCcw className="w-4 h-4" /> Restore to Studio
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

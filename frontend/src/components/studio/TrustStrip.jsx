import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const TrustStrip = () => {
  return (
    <div className="bg-[var(--info-bg)] border-b border-[var(--info-text)]/20 px-4 py-2 flex items-center justify-center gap-2">
      <ShieldCheck className="w-4 h-4 text-[var(--info-text)]" />
      <span className="text-xs font-semibold text-[var(--info-text)] tracking-wide">
        Safe preview mode — your live site will not change until you publish.
      </span>
    </div>
  );
};

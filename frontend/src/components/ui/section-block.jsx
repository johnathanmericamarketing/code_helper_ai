import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SectionBlock({ title, subtitle, children, action, className = "" }) {
  return (
    <Card className={`rounded-2xl border-border/80 shadow-sm bg-card ${className}`}>
      <CardHeader className="pb-3 px-4 pt-4 md:px-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">{title}</CardTitle>
            {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 md:px-5">{children}</CardContent>
    </Card>
  );
}

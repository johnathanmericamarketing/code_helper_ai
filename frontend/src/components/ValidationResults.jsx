import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, AlertTriangle, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const getResultIcon = (result) => {
  switch (result) {
    case 'passed':
      return <CheckCircle2 className="w-5 h-5 text-success" />;
    case 'failed':
      return <XCircle className="w-5 h-5 text-destructive" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-warning" />;
    default:
      return null;
  }
};

const getResultVariant = (result) => {
  switch (result) {
    case 'passed':
      return 'success';
    case 'failed':
      return 'destructive';
    case 'warning':
      return 'warning';
    default:
      return 'default';
  }
};

export const ValidationResults = ({ checks = [] }) => {
  const passedCount = checks.filter(c => c.result === 'passed').length;
  const failedCount = checks.filter(c => c.result === 'failed').length;
  const warningCount = checks.filter(c => c.result === 'warning').length;

  const overallStatus = failedCount > 0 ? 'failed' : warningCount > 0 ? 'warning' : 'passed';

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <Shield className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <CardTitle>Validation Results</CardTitle>
              <CardDescription>Safety and quality checks</CardDescription>
            </div>
          </div>
          <Badge variant={getResultVariant(overallStatus)} className="text-sm py-1 px-3">
            {overallStatus === 'passed' ? 'All Passed' : overallStatus === 'warning' ? 'Warnings' : 'Failed'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-success/10 border border-success/20 rounded-lg p-3">
            <p className="text-sm text-muted-foreground">Passed</p>
            <p className="text-2xl font-bold text-success">{passedCount}</p>
          </div>
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
            <p className="text-sm text-muted-foreground">Warnings</p>
            <p className="text-2xl font-bold text-warning">{warningCount}</p>
          </div>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-sm text-muted-foreground">Failed</p>
            <p className="text-2xl font-bold text-destructive">{failedCount}</p>
          </div>
        </div>

        {/* Individual Checks */}
        <div className="space-y-3 pt-4 border-t border-border">
          {checks.map((check, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-3 p-4 rounded-lg border transition-all',
                check.result === 'passed' && 'bg-success/5 border-success/20',
                check.result === 'warning' && 'bg-warning/5 border-warning/20',
                check.result === 'failed' && 'bg-destructive/5 border-destructive/20'
              )}
            >
              <div className="mt-0.5">{getResultIcon(check.result)}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{check.check_name}</h4>
                <p className="text-sm text-muted-foreground mt-1">{check.message}</p>
                {check.details && (
                  <pre className="text-xs bg-secondary/50 p-2 rounded mt-2 overflow-x-auto font-mono">
                    {check.details}
                  </pre>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

import React from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileCode } from 'lucide-react';

export const CodeDiffViewer = ({ original, modified, language = 'javascript', fileName }) => {
  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">{fileName || 'Code Changes'}</CardTitle>
          </div>
          <Badge variant="outline">{language}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-t border-border">
          <Editor
            height="400px"
            language={language}
            theme="vs-dark"
            value={modified || original}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 13,
              lineNumbers: 'on',
              renderSideBySide: true,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

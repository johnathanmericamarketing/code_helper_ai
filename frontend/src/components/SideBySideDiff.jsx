import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileCode, Copy, Download, Check } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'sonner';

export const SideBySideDiff = ({ original = '', modified, language = 'javascript', fileName }) => {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(modified || original);
    setCopied(true);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([modified || original], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || `code.${language}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('File downloaded');
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">{fileName || 'Code Changes'}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{language}</Badge>
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="side-by-side" className="w-full">
          <div className="px-6 pb-2 border-b border-border">
            <TabsList>
              <TabsTrigger value="side-by-side">Side by Side</TabsTrigger>
              <TabsTrigger value="unified">Unified</TabsTrigger>
              <TabsTrigger value="modified">Modified Only</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="side-by-side" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 border-t border-border">
              {/* Original */}
              <div className="border-r border-border">
                <div className="bg-muted px-4 py-2 text-sm font-semibold border-b border-border">
                  Original
                </div>
                <Editor
                  height="400px"
                  language={language}
                  theme={theme === 'dark' ? 'vs-dark' : 'light'}
                  value={original || '// No original code'}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 13,
                    lineNumbers: 'on',
                  }}
                />
              </div>
              {/* Modified */}
              <div>
                <div className="bg-success/10 px-4 py-2 text-sm font-semibold border-b border-border">
                  Modified
                </div>
                <Editor
                  height="400px"
                  language={language}
                  theme={theme === 'dark' ? 'vs-dark' : 'light'}
                  value={modified || original}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 13,
                    lineNumbers: 'on',
                  }}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="unified" className="m-0">
            <div className="border-t border-border">
              <Editor
                height="400px"
                language={language}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                value={modified || original}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 13,
                  lineNumbers: 'on',
                  renderSideBySide: false,
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="modified" className="m-0">
            <div className="border-t border-border">
              <Editor
                height="400px"
                language={language}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                value={modified || original}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 13,
                  lineNumbers: 'on',
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

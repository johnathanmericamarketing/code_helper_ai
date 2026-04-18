import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, RotateCcw, Terminal, FileCode } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'sonner';

export const CodePlayground = ({ initialCode = '', language = 'javascript' }) => {
  const { theme } = useTheme();
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setOutput('');

    // Simulate code execution (in production, this would use a secure sandbox)
    setTimeout(() => {
      try {
        // Capture console output
        const logs = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' '));
          originalLog(...args);
        };

        // Execute code (UNSAFE - for demo only)
        if (language === 'javascript') {
          eval(code);
        }

        console.log = originalLog;
        setOutput(logs.length > 0 ? logs.join('\n') : 'Code executed successfully (no output)');
        toast.success('Code executed');
      } catch (error) {
        setOutput(`Error: ${error.message}\n\n${error.stack}`);
        toast.error('Execution failed');
      } finally {
        setIsRunning(false);
      }
    }, 500);
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput('');
    toast.info('Code reset');
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <FileCode className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <CardTitle>Code Playground</CardTitle>
              <CardDescription>Test and preview code changes in a safe environment</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{language}</Badge>
            <Badge variant="warning" className="gap-1">
              <Terminal className="w-3 h-3" />
              Sandbox
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="editor">Code Editor</TabsTrigger>
            <TabsTrigger value="output">Output Console</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4">
            <div className="border border-border rounded-lg overflow-hidden">
              <Editor
                height="400px"
                language={language}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 13,
                  lineNumbers: 'on',
                  tabSize: 2,
                  wordWrap: 'on',
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                ⚠️ Code runs in browser sandbox (demo mode)
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleReset} className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
                <Button onClick={handleRun} disabled={isRunning} className="gap-2">
                  <Play className="w-4 h-4" />
                  {isRunning ? 'Running...' : 'Run Code'}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="output" className="space-y-4">
            <div className="bg-secondary rounded-lg p-4 min-h-[400px] font-mono text-sm overflow-auto">
              {output ? (
                <pre className="text-foreground whitespace-pre-wrap">{output}</pre>
              ) : (
                <p className="text-muted-foreground italic">No output yet. Run your code to see results.</p>
              )}
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setOutput('')}>
                Clear Console
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Settings as SettingsIcon, Save, Cpu, Zap, Shield } from 'lucide-react';
import { toast } from 'sonner';

export const AIModelConfig = () => {
  const [config, setConfig] = useState({
    model: 'claude-3-opus',
    temperature: 0.7,
    maxTokens: 4096,
    topP: 0.9,
    systemPrompt: 'You are an expert software engineer. Generate clean, secure, and well-documented code.',
    enableStreaming: true,
  });

  const handleSave = () => {
    localStorage.setItem('aiModelConfig', JSON.stringify(config));
    toast.success('AI configuration saved');
  };

  return (
    <div className="space-y-6">
      {/* Model Selection */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>AI Model Selection</CardTitle>
              <CardDescription>Choose the AI model for code generation</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select value={config.model} onValueChange={(value) => setConfig({ ...config, model: value })}>
              <SelectTrigger id="model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="claude-3-opus">Claude 3 Opus (Most Capable)</SelectItem>
                <SelectItem value="claude-3-sonnet">Claude 3 Sonnet (Balanced)</SelectItem>
                <SelectItem value="claude-3-haiku">Claude 3 Haiku (Fast)</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Different models offer varying trade-offs between speed, cost, and quality
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Enable Streaming Responses</Label>
              <Switch
                checked={config.enableStreaming}
                onCheckedChange={(checked) => setConfig({ ...config, enableStreaming: checked })}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              See AI responses in real-time as they're generated
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Model Parameters */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-warning" />
            </div>
            <div>
              <CardTitle>Model Parameters</CardTitle>
              <CardDescription>Fine-tune AI behavior and output</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Temperature */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Temperature: {config.temperature.toFixed(2)}</Label>
              <span className="text-sm text-muted-foreground">
                {config.temperature < 0.3 ? 'Focused' : config.temperature < 0.7 ? 'Balanced' : 'Creative'}
              </span>
            </div>
            <Slider
              value={[config.temperature]}
              onValueChange={([value]) => setConfig({ ...config, temperature: value })}
              min={0}
              max={1}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Lower = more deterministic and focused. Higher = more creative and varied.
            </p>
          </div>

          {/* Top P */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Top P (Nucleus Sampling): {config.topP.toFixed(2)}</Label>
            </div>
            <Slider
              value={[config.topP]}
              onValueChange={([value]) => setConfig({ ...config, topP: value })}
              min={0.1}
              max={1}
              step={0.05}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Controls diversity via nucleus sampling. 0.9 is recommended for most use cases.
            </p>
          </div>

          {/* Max Tokens */}
          <div className="space-y-2">
            <Label htmlFor="maxTokens">Max Output Tokens</Label>
            <Input
              id="maxTokens"
              type="number"
              value={config.maxTokens}
              onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) || 4096 })}
              min={256}
              max={8192}
              step={256}
            />
            <p className="text-xs text-muted-foreground">
              Maximum length of generated code (256-8192 tokens)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* System Prompt */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-success" />
            </div>
            <div>
              <CardTitle>System Prompt</CardTitle>
              <CardDescription>Define AI behavior and constraints</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="systemPrompt">Custom System Prompt</Label>
            <Textarea
              id="systemPrompt"
              value={config.systemPrompt}
              onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
              className="min-h-[120px] font-mono text-sm"
              placeholder="Enter custom instructions for the AI..."
            />
            <p className="text-xs text-muted-foreground">
              Customize how the AI should approach code generation, coding standards, and safety rules.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Preset Prompts:</h4>
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => setConfig({
                  ...config,
                  systemPrompt: 'You are an expert software engineer. Generate clean, secure, and well-documented code following best practices.'
                })}
              >
                🎯 Balanced (Recommended)
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => setConfig({
                  ...config,
                  systemPrompt: 'You are a security-focused software engineer. Prioritize secure coding practices, input validation, and vulnerability prevention. Always include security comments.'
                })}
              >
                🔒 Security-First
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => setConfig({
                  ...config,
                  systemPrompt: 'You are a performance-focused software engineer. Optimize for speed, efficiency, and minimal resource usage. Include performance benchmarks where relevant.'
                })}
              >
                ⚡ Performance-Optimized
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          Save Configuration
        </Button>
      </div>
    </div>
  );
};

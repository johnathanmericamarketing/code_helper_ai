import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { toast } from 'sonner';

export const SettingsPage = () => {
  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your AI code generator preferences</p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Basic configuration options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Auto-approve low-risk changes</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically approve code changes marked as low risk
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Email notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email updates when requests are processed
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* AI Settings */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>AI Configuration</CardTitle>
            <CardDescription>Configure AI behavior and parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="model">AI Model</Label>
              <Input id="model" value="Claude Code (Default)" disabled />
              <p className="text-xs text-muted-foreground">
                Contact admin to change AI model
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Detailed validation</Label>
                <p className="text-sm text-muted-foreground">
                  Run comprehensive validation checks (slower but safer)
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Safety Settings */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Safety & Security</CardTitle>
            <CardDescription>Control safety measures and restrictions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Strict scope enforcement</Label>
                <p className="text-sm text-muted-foreground">
                  Reject any changes outside planned scope
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Require test coverage</Label>
                <p className="text-sm text-muted-foreground">
                  Warn if generated code lacks tests
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

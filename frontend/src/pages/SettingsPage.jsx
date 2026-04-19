import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Save, Key, Shield, Bell, User, CreditCard, Eye, EyeOff,
  CheckCircle, Zap, Copy, AlertTriangle, BarChart3, LogOut
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { auth, functions } from '@/firebase';
import { signOut } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import {
  getUserProfile,
  updateUserProfile,
  changeUserEmail,
  changeUserPassword,
} from '@/lib/user-service';

// ── AI Model Pricing (per 1M tokens) ──
const AI_MODELS = [
  // Anthropic Claude
  {
    id: 'claude-opus-4-5',
    name: 'Claude Opus 4.5',
    description: 'Most capable — best for complex code',
    input_per_mtok: 15.0,
    output_per_mtok: 75.0,
    badge: 'Anthropic',
    badgeVariant: 'default',
  },
  {
    id: 'claude-sonnet-4-5',
    name: 'Claude Sonnet 4.5',
    description: 'Great balance of speed & intelligence',
    input_per_mtok: 3.0,
    output_per_mtok: 15.0,
    badge: 'Popular',
    badgeVariant: 'success',
  },
  {
    id: 'claude-haiku-3-5',
    name: 'Claude Haiku 3.5',
    description: 'Fastest & cheapest for simple tasks',
    input_per_mtok: 0.8,
    output_per_mtok: 4.0,
    badge: 'Cheap',
    badgeVariant: 'outline',
  },
  // Google Gemini
  {
    id: 'gemini-1.5-pro-latest',
    name: 'Gemini 1.5 Pro',
    description: 'Google\'s most powerful model — excellent coding',
    input_per_mtok: 3.5,
    output_per_mtok: 10.5,
    badge: 'Google',
    badgeVariant: 'default',
  },
  {
    id: 'gemini-1.5-flash-latest',
    name: 'Gemini 1.5 Flash',
    description: 'Lightweight & extremely fast generation',
    input_per_mtok: 0.075,
    output_per_mtok: 0.3,
    badge: 'Fast',
    badgeVariant: 'outline',
  },
];

const PLAN_TIERS = [
  {
    id: 'free',
    name: 'Free',
    description: 'Get started with basic features',
    price: '$0/month',
    features: ['5 AI code requests/month', 'Community support', 'Basic file deployment'],
  },
  {
    id: 'byok',
    name: 'Bring Your Own Key',
    description: 'Use your own Anthropic API key — unlimited requests',
    price: 'Free + your API costs',
    features: ['Unlimited AI requests', 'Your own Claude API key', 'All deployment features', 'Priority support'],
  },
  {
    id: 'platform',
    name: 'Platform Subscription',
    description: 'We handle the API keys & billing for you',
    price: '$15/month',
    features: ['No API key needed', 'Pay per token used', 'Transparent cost tracking', 'Volume discounts'],
    price_id: 'price_stubbed_for_now',
  },
];

export const SettingsPage = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Form states
  const [claudeApiKey, setClaudeApiKey] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('claude-sonnet-4-5');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getUserProfile();
      setProfile(data);
      setSelectedModel(data.ai_model || data.claude_model || 'claude-sonnet-4-5');
      setClaudeApiKey(data.claude_api_key || data.ai_api_key || '');
      setGeminiApiKey(data.gemini_api_key || '');
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApiKeys = async () => {
    const claude = claudeApiKey.trim();
    const gemini = geminiApiKey.trim();
    
    if (claude && !claude.startsWith('sk-ant-')) {
      toast.error('Invalid Claude API key. Must start with sk-ant-');
      return;
    }
    if (gemini && !gemini.startsWith('AIza')) {
      toast.error('Invalid Gemini API key. Must start with AIza');
      return;
    }

    setSaving(true);
    try {
      const updates = { 
        claude_api_key: claude || null,
        gemini_api_key: gemini || null,
        ai_api_key: null, // clear old legacy field
        plan: (claude || gemini) ? 'byok' : 'free'
      };
      await updateUserProfile(updates);
      toast.success('API keys saved!');
      await loadProfile();
    } catch (err) {
      toast.error('Failed to save API keys');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveApiKeys = async () => {
    setSaving(true);
    try {
      await updateUserProfile({ claude_api_key: null, gemini_api_key: null, ai_api_key: null, plan: 'free' });
      setClaudeApiKey('');
      setGeminiApiKey('');
      toast.success('API keys removed. Switched back to Free plan.');
      await loadProfile();
    } catch (err) {
      toast.error('Failed to remove API keys');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveModel = async () => {
    setSaving(true);
    try {
      await updateUserProfile({ ai_model: selectedModel });
      toast.success('Default AI model updated!');
    } catch (err) {
      toast.error('Failed to save model preference');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async (updates) => {
    try {
      await updateUserProfile({ notifications: { ...profile.notifications, ...updates } });
      setProfile(p => ({ ...p, notifications: { ...p.notifications, ...updates } }));
      toast.success('Notification preferences saved');
    } catch (err) {
      toast.error('Failed to save notifications');
    }
  };

  const handleSaveSafety = async (key, value) => {
    const updated = { ...profile.safety, [key]: value };
    try {
      await updateUserProfile({ safety: updated });
      setProfile(p => ({ ...p, safety: updated }));
      toast.success('Safety settings updated');
    } catch (err) {
      toast.error('Failed to save safety settings');
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error('Please fill in both password fields');
      return;
    }
    setSaving(true);
    try {
      await changeUserPassword(currentPassword, newPassword);
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleStripeCheckout = async (priceId) => {
    setSaving(true);
    try {
      const fn = httpsCallable(functions, 'createCheckoutSession');
      const res = await fn({
        priceId,
        successUrl: window.location.origin + '/settings?tab=billing&success=true',
        cancelUrl: window.location.origin + '/settings?tab=billing&canceled=true',
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.info(res.data?.message || 'Checkout session created (Stub mode)');
        // Simulate a completed checkout for testing
        await updateUserProfile({ plan: 'platform' });
        await loadProfile();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to start checkout');
    } finally {
      setSaving(false);
    }
  };

  const handleStripePortal = async () => {
    setSaving(true);
    try {
      const fn = httpsCallable(functions, 'createPortalSession');
      const res = await fn({
        returnUrl: window.location.origin + '/settings?tab=billing',
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.info(res.data?.message || 'Portal session created (Stub mode)');
        // Simulate cancellation in stub mode for testing
        await updateUserProfile({ plan: 'free' });
        await loadProfile();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to open billing portal');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    toast.success('Signed out');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const selectedModelInfo = AI_MODELS.find(m => m.id === selectedModel);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activePlan = PLAN_TIERS.find(p => p.id === profile?.plan) || PLAN_TIERS[0];
  const usage = profile?.usage_this_month || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account, API keys, and preferences</p>
        </div>
        <Button variant="outline" onClick={handleSignOut} className="gap-2">
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* ── Account Tab ── */}
        <TabsContent value="account" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Your account information</CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={async () => {
                  try {
                    setSaving(true);
                    await updateUserProfile({ display_name: document.getElementById('display_name').value });
                    import('firebase/auth').then(({ updateProfile }) => updateProfile(auth.currentUser, { displayName: document.getElementById('display_name').value }));
                    toast.success('Profile updated successfully');
                  } catch (e) {
                    toast.error('Failed to update profile');
                  } finally {
                    setSaving(false);
                  }
                }} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" /> Save Profile
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input
                  id="display_name"
                  defaultValue={auth.currentUser?.displayName || profile?.display_name || ''}
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="flex items-center gap-2">
                  <Input value={currentUser?.email || ''} readOnly className="bg-muted text-muted-foreground" />
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(currentUser?.email)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Email changes require support request for security.</p>
              </div>
              <div className="space-y-2">
                <Label>Account ID</Label>
                <div className="flex items-center gap-2">
                  <Input value={currentUser?.uid || ''} readOnly className="bg-muted font-mono text-xs" />
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(currentUser?.uid)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Badge variant="outline">{activePlan.name} Plan</Badge>
                <Badge variant={(profile?.claude_api_key || profile?.gemini_api_key || profile?.ai_api_key) ? 'success' : 'secondary'}>
                  {(profile?.claude_api_key || profile?.gemini_api_key || profile?.ai_api_key) ? 'BYOK Active' : 'No API Keys'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your login password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <Button onClick={handleChangePassword} disabled={saving} className="gap-2">
                <Save className="w-4 h-4" />
                Update Password
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Manage how you receive updates</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Email notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email updates when requests are processed</p>
                </div>
                <Switch
                  checked={profile?.notifications?.email ?? true}
                  onCheckedChange={v => handleSaveNotifications({ email: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Browser notifications</Label>
                  <p className="text-sm text-muted-foreground">Get desktop notifications for important events</p>
                </div>
                <Switch
                  checked={profile?.notifications?.browser ?? false}
                  onCheckedChange={v => handleSaveNotifications({ browser: v })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── AI Provider API Tab ── */}
        <TabsContent value="api" className="space-y-6">
          <Alert>
            <Key className="w-4 h-4" />
            <AlertTitle>Bring Your Own Key (BYOK)</AlertTitle>
            <AlertDescription>
              Enter your personal Anthropic and/or Gemini API keys to use for AI code generation.
              Your keys are stored securely in your private Firestore account document.
              You will be billed directly by your AI provider for your usage.
            </AlertDescription>
          </Alert>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>AI Provider API Keys</CardTitle>
              <CardDescription>
                Get your keys at <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer" className="text-primary underline">Anthropic Console</a> or <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-primary underline">Google AI Studio</a>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Anthropic Claude API Key</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showApiKey ? 'text' : 'password'}
                      value={claudeApiKey}
                      onChange={e => setClaudeApiKey(e.target.value)}
                      placeholder="sk-ant-..."
                      className="font-mono pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Google Gemini API Key</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showApiKey ? 'text' : 'password'}
                      value={geminiApiKey}
                      onChange={e => setGeminiApiKey(e.target.value)}
                      placeholder="AIza..."
                      className="font-mono pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Button onClick={handleSaveApiKeys} disabled={saving} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save API Keys
                </Button>
                {(profile?.claude_api_key || profile?.gemini_api_key || profile?.ai_api_key) && (
                  <Button variant="outline" onClick={handleRemoveApiKeys} disabled={saving}>
                    Remove Keys
                  </Button>
                )}
              </div>
              {(profile?.claude_api_key || profile?.gemini_api_key || profile?.ai_api_key) && (
                <div className="flex items-center gap-2 text-sm text-success mt-2">
                  <CheckCircle className="w-4 h-4" />
                  API key(s) configured — BYOK plan active
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Default AI Model</CardTitle>
              <CardDescription>Select which model to use for code generation requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {AI_MODELS.map(model => (
                  <div
                    key={model.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${selectedModel === model.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground'
                      }`}
                    onClick={() => setSelectedModel(model.id)}
                  >
                    <div className={`w-4 h-4 mt-0.5 rounded-full border-2 flex-shrink-0 ${selectedModel === model.id ? 'border-primary bg-primary' : 'border-muted-foreground'
                      }`} />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{model.name}</p>
                        <Badge variant={model.badgeVariant} className="text-xs">{model.badge}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{model.description}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        ${model.input_per_mtok}/M input · ${model.output_per_mtok}/M output tokens
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {selectedModelInfo && (
                <Alert>
                  <Zap className="w-4 h-4" />
                  <AlertTitle>Estimated cost per request</AlertTitle>
                  <AlertDescription>
                    Avg request uses ~2,000 input + ~1,500 output tokens →&nbsp;
                    <strong>
                      ${((2000 * selectedModelInfo.input_per_mtok + 1500 * selectedModelInfo.output_per_mtok) / 1_000_000).toFixed(4)}
                    </strong> per request
                  </AlertDescription>
                </Alert>
              )}

              <Button onClick={handleSaveModel} disabled={saving} className="gap-2">
                <Save className="w-4 h-4" />
                Save Model Preference
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Safety Tab ── */}
        <TabsContent value="safety" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-success" />
                <div>
                  <CardTitle>Safety &amp; Security</CardTitle>
                  <CardDescription>Control safety measures before code is applied</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'strict_scope', label: 'Strict scope enforcement', desc: 'Reject any changes outside the planned file scope' },
                { key: 'require_tests', label: 'Require test coverage', desc: 'Warn if generated code lacks associated tests' },
                { key: 'security_scan', label: 'Security vulnerability scanning', desc: 'Scan generated code for common vulnerabilities' },
                { key: 'require_approval_high_risk', label: 'Require manual approval for high-risk changes', desc: 'Always require human review before high-risk modifications are deployed' },
                { key: 'lint_code', label: 'Lint generated code', desc: 'Run ESLint/Pylint on all generated code' },
                { key: 'check_complexity', label: 'Check code complexity', desc: 'Warn if cyclomatic complexity is too high' },
                { key: 'verify_dependencies', label: 'Verify dependencies', desc: 'Check for deprecated or vulnerable packages' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{label}</Label>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                  <Switch
                    checked={profile?.safety?.[key] ?? true}
                    onCheckedChange={v => handleSaveSafety(key, v)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Billing Tab ── */}
        <TabsContent value="billing" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle>Usage This Month</CardTitle>
                  <CardDescription>Track your API consumption</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Requests', value: usage.requests ?? 0 },
                  { label: 'Input Tokens', value: (usage.input_tokens ?? 0).toLocaleString() },
                  { label: 'Output Tokens', value: (usage.output_tokens ?? 0).toLocaleString() },
                  { label: 'Est. Cost', value: `$${(usage.cost_usd ?? 0).toFixed(4)}` },
                ].map(({ label, value }) => (
                  <div key={label} className="p-4 bg-muted/50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-4">
            {PLAN_TIERS.map(plan => (
              <Card
                key={plan.id}
                className={`border-border relative ${activePlan.id === plan.id ? 'border-primary ring-1 ring-primary' : ''} ${plan.disabled ? 'opacity-60' : ''}`}
              >
                {activePlan.id === plan.id && (
                  <Badge className="absolute -top-2.5 left-4 text-xs">Current Plan</Badge>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <p className="text-2xl font-bold text-foreground">{plan.price}</p>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-3.5 h-3.5 text-success flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {!plan.disabled && activePlan.id !== plan.id && (
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={saving}
                      onClick={() => {
                        if (plan.id === 'byok') {
                          document.querySelector('[data-value="api"]')?.click();
                          toast.info('Add your API keys to activate BYOK plan');
                        } else if (plan.id === 'platform') {
                          handleStripeCheckout(plan.price_id);
                        } else if (plan.id === 'free') {
                          // Allow them to remove key or cancel subscription to go free
                          toast.info('Remove your API key or cancel your subscription to return to Free.');
                        }
                      }}
                    >
                      {saving && plan.id === 'platform'
                        ? <div className="w-4 h-4 rounded-full border-2 border-foreground border-t-transparent animate-spin mr-2" />
                        : null}
                      Switch to {plan.name}
                    </Button>
                  )}
                  {activePlan.id === plan.id && plan.id === 'platform' && (
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      disabled={saving}
                      onClick={handleStripePortal}
                    >
                      <CreditCard className="w-4 h-4" />
                      Manage Billing
                    </Button>
                  )}
                  {plan.disabled && (
                    <Button variant="outline" className="w-full" disabled>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Coming Soon
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert>
            <Zap className="w-4 h-4" />
            <AlertTitle>Platform Subscription Active</AlertTitle>
            <AlertDescription>
              Stripe billing creates a seamless experience. You will pay for the $15/month base fee and additional usage at standard platform rates.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
};

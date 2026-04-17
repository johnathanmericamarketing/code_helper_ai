import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { 
  FileCode2, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Code2, 
  ArrowRight, 
  Database, 
  Layers,
  MousePointer2,
  ImagePlus
} from 'lucide-react';

export const LandingPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30">
      
      {/* ── Navigation ── */}
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-md fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-primary flex items-center justify-center">
              <FileCode2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">Code Helper Studio</span>
          </div>
          <div className="flex gap-4 items-center">
            {currentUser ? (
              <Button onClick={() => navigate('/app')} className="gap-2">
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/auth')} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        {/* Background Gradients & Image */}
        <div className="absolute inset-0 z-0">
          <img src="/hero-bg.png" alt="Hero Background" className="w-full h-full object-cover opacity-80 dark:opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-background/50 backdrop-blur-md shadow-sm text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">Powered by Gemini 1.5 & Claude 3.5</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Your personal AI <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-blue-600 dark:from-blue-400 dark:to-indigo-300 drop-shadow-sm">
              software engineering
            </span> team.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            Secure, scalable, and fully customizable. Build applications significantly faster by pairing with elite AI models directly in your browser. Bring your own keys or use ours.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <Button size="lg" className="h-14 px-8 text-base shadow-xl shadow-primary/20 w-full sm:w-auto" onClick={() => navigate(currentUser ? '/app' : '/auth')}>
              {currentUser ? 'Enter Workspace' : 'Start Building for Free'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base w-full sm:w-auto hover:bg-muted/50 border-border/60">
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* ── Feature Grid ── */}
      <section className="py-24 px-6 bg-muted/20 border-t border-border/40 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Built for Serious Developers</h2>
            <p className="text-muted-foreground text-lg">Everything you need to ship features faster without compromising on quality.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Model Choice</h3>
              <p className="text-muted-foreground leading-relaxed">
                Seamlessly toggle between Google's Gemini 1.5 Pro and Anthropic's Claude 3.5 Sonnet to find the perfect intelligence for your specific task.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Bring Your Own Key</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect your personal API keys for unrestricted generation at cost, or subscribe to our Platform tier and let us handle exactly what you use.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 text-indigo-500">
                <MousePointer2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Visual App Inspector</h3>
              <p className="text-muted-foreground leading-relaxed">
                Review generated code in a live iframe. Visually point, hover, and click to measure elements on the screen just like Chrome DevTools.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-32 bg-pink-500/5 rounded-full blur-3xl group-hover:bg-pink-500/10 transition-colors" />
              <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-6 text-pink-500">
                <ImagePlus className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Asset Injection</h3>
              <p className="text-muted-foreground leading-relaxed">
                Use the visual inspector to select an empty container, and our backend Google Imagen 3 pipeline will perfectly generate and inject a sized image directly into your live UI.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-32 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors" />
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 text-purple-500">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Logic Sandbox</h3>
              <p className="text-muted-foreground leading-relaxed">
                Execute and test your generated javascript logic locally within the browser sandbox before exporting your finalized projects.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-32 bg-green-500/5 rounded-full blur-3xl group-hover:bg-green-500/10 transition-colors" />
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 text-green-500">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Isolation</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your requests, generated code, and API keys are strictly siloed. Our robust role-based access rules ensure your proprietary logic remains yours alone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/60 bg-background py-12 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
          <FileCode2 className="w-5 h-5" />
          <span className="font-semibold tracking-tight">Code Helper</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Built securely on Google Cloud Platform & Firebase.
        </p>
      </footer>
    </div>
  );
};

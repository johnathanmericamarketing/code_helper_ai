import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImagePlus, Copy, Code, CheckCircle, Wand2, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateImage } from '@/lib/media-service';

export const AssetsPage = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { base64, mimeType, costUsd }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter an image description.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await generateImage(prompt);
      setResult(data);
      toast.success('Image generated successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to generate image. Ensure you have an active Gemini key set in Settings.');
    } finally {
      setLoading(false);
    }
  };

  const getDataUrl = () => {
    if (!result) return '';
    return `data:${result.mimeType};base64,${result.base64}`;
  };

  const handleCopyBase64 = () => {
    if (!result) return;
    navigator.clipboard.writeText(getDataUrl());
    toast.success('Base64 URL copied to clipboard!');
  };

  const handleCopyImgTag = () => {
    if (!result) return;
    const tag = `<img src="${getDataUrl()}" alt="${prompt.replace(/"/g, '&quot;')}" />`;
    navigator.clipboard.writeText(tag);
    toast.success('<img> tag copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Asset Studio</h1>
        <p className="text-muted-foreground">Generate high-quality images using Google Imagen 3 to use directly in your code.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-primary" />
              <CardTitle>Image Generation</CardTitle>
            </div>
            <CardDescription>
              Provide a detailed description of the asset you want. Imagen 3 will create a gorgeous image and we will encode it as a Base64 string so you can perfectly inject it into your generated React/HTML components without hosting the image separately.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Description Prompt</Label>
              <Textarea
                placeholder="A sleek modern hero background with floating UI cards and data streams, dark mode..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full gap-2 shadow-lg shadow-primary/20" 
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Asset (takes ~5-10s)...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Image
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-border flex flex-col h-full min-h-[400px]">
          <CardHeader>
            <CardTitle>Generated Asset</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center relative p-6 bg-muted/30 rounded-lg mx-6 mb-6 border border-dashed border-border/50">
            {loading ? (
              <div className="flex flex-col items-center justify-center text-muted-foreground gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <p>Calling Google Imagen 3 API...</p>
              </div>
            ) : result ? (
              <div className="w-full h-full flex flex-col shadow-inner">
                <img 
                  src={getDataUrl()} 
                  alt="Generated asset" 
                  className="w-full h-full object-contain rounded-md"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                <ImagePlus className="w-12 h-12 opacity-20" />
                <p>No image generated yet</p>
              </div>
            )}
          </CardContent>

          {result && (
            <CardFooter className="flex gap-4">
              <Button variant="outline" className="flex-1 gap-2 border-primary/30 hover:bg-primary/5" onClick={handleCopyBase64}>
                <Copy className="w-4 h-4" />
                Copy Base64 URL
              </Button>
              <Button variant="outline" className="flex-1 gap-2 border-blue-500/30 hover:bg-blue-500/5" onClick={handleCopyImgTag}>
                <Code className="w-4 h-4" />
                Copy {'<img>'} Tag
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>

    </div>
  );
};

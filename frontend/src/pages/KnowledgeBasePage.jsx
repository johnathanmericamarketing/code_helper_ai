import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, BookOpen, Code, Shield, Zap, FileCheck, FileText, Star, Search, Filter, Edit, Trash2, Palette } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Editor from '@monaco-editor/react';
import { useTheme } from '@/contexts/ThemeContext';
import { knowledgeService } from '@/lib/firebase-service';
import { useProject } from '@/context/ProjectContext';
import { HexColorPicker } from "react-colorful";
import { toast } from 'sonner';
import { BrandKitCard } from '@/components/BrandKitCard';

const categoryIcons = {
  brand_identity: Palette,
  code_style: Code,
  architecture: BookOpen,
  security: Shield,
  performance: Zap,
  testing: FileCheck,
  documentation: FileText,
  best_practices: Star,
};

const categoryColors = {
  brand_identity: 'bg-indigo-500/10 text-indigo-500',
  code_style: 'bg-primary/10 text-primary',
  architecture: 'bg-info/10 text-info',
  security: 'bg-destructive/10 text-destructive',
  performance: 'bg-warning/10 text-warning',
  testing: 'bg-success/10 text-success',
  documentation: 'bg-muted text-muted-foreground',
  best_practices: 'bg-primary/10 text-primary',
};

export const KnowledgeBasePage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { activeProject, refreshActiveProject } = useProject();
  const [knowledge, setKnowledge] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'code_style',
    language: '',
    framework: '',
    description: '',
    code_example: '',
    bad_example: '',
    tags: '',
    priority: 5,
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    accentColor: '#3b82f6',
    typography: '',
    tone: '',
  });

  const fetchKnowledge = async () => {
    if (!activeProject) return;
    try {
      const data = await knowledgeService.list(activeProject.id);
      setKnowledge(data);
    } catch (error) {
      console.error('Error fetching knowledge:', error);
      toast.error('Failed to load knowledge base');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (activeProject) {
      fetchKnowledge();
    } else {
      setKnowledge([]);
      setLoading(false);
    }
  }, [activeProject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        priority: parseInt(formData.priority),
      };

      if (editingItem) {
        await knowledgeService.update(editingItem.id, payload);
        toast.success('Knowledge updated');
      } else {
        await knowledgeService.create(payload, activeProject?.id);
        toast.success('Knowledge added');
      }

      setDialogOpen(false);
      setEditingItem(null);
      resetForm();
      fetchKnowledge();
    } catch (error) {
      console.error('Error saving knowledge:', error);
      toast.error('Failed to save knowledge');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      language: item.language || '',
      framework: item.framework || '',
      description: item.description,
      code_example: item.code_example || '',
      bad_example: item.bad_example || '',
      tags: item.tags.join(', '),
      priority: item.priority,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this knowledge?')) return;
    
    try {
      await knowledgeService.delete(id);
      toast.success('Knowledge deleted');
      fetchKnowledge();
    } catch (error) {
      console.error('Error deleting knowledge:', error);
      toast.error('Failed to delete knowledge');
    }
  };

  const resetForm = () => {
    setFormData({
      priority: 5,
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      accentColor: '#3b82f6',
      typography: '',
      tone: '',
    });
  };

  const filteredKnowledge = knowledge
    .filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => b.priority - a.priority);

  const stats = [
    { label: 'Total Guides', value: knowledge.length, icon: BookOpen, color: 'text-primary' },
    { label: 'High Priority', value: knowledge.filter(k => k.priority >= 8).length, icon: Star, color: 'text-warning' },
    { label: 'Categories', value: new Set(knowledge.map(k => k.category)).size, icon: Filter, color: 'text-info' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Knowledge Base</h1>
          <p className="text-muted-foreground mt-1">Your brand kit and any coding standards or notes the AI should follow.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingItem(null); }} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Knowledge
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Knowledge' : 'Add New Knowledge'}</DialogTitle>
              <DialogDescription>
                Document coding standards and preferences that AI should follow
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Use Functional Components"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brand_identity">Brand Identity & Style</SelectItem>
                      <SelectItem value="code_style">Code Style</SelectItem>
                      <SelectItem value="architecture">Architecture</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="documentation">Documentation</SelectItem>
                      <SelectItem value="best_practices">Best Practices</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    placeholder="JavaScript, Python, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="framework">Framework</Label>
                  <Input
                    id="framework"
                    value={formData.framework}
                    onChange={(e) => setFormData({ ...formData, framework: e.target.value })}
                    placeholder="React, FastAPI, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority (1-10)</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explain the rule or preference..."
                  className="min-h-[80px]"
                  required
                />
              </div>

              {formData.category === 'brand_identity' ? (
                <div className="space-y-6 bg-muted/30 p-4 rounded-xl border border-border">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['primaryColor', 'secondaryColor', 'accentColor'].map((colorKey) => (
                      <div key={colorKey} className="space-y-3 flex flex-col items-center p-3 border border-border bg-card rounded-lg shadow-sm">
                        <Label className="capitalize">{colorKey.replace('Color', ' Color')}</Label>
                        <HexColorPicker
                          color={formData[colorKey]}
                          onChange={(c) => setFormData({ ...formData, [colorKey]: c })}
                          className="w-full max-w-[150px] !h-[150px]"
                        />
                        <div className="flex w-full mt-2 border border-border rounded-md overflow-hidden bg-background">
                          <div className="w-8 h-8 shrink-0" style={{ backgroundColor: formData[colorKey] }} />
                          <Input
                            className="border-0 focus-visible:ring-0 uppercase h-8 px-2 text-sm text-center"
                            value={formData[colorKey]}
                            onChange={(e) => setFormData({ ...formData, [colorKey]: e.target.value })}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="typography">Primary Typography / Font</Label>
                      <Input id="typography" value={formData.typography || ''} onChange={(e) => setFormData({ ...formData, typography: e.target.value })} placeholder="e.g. Inter, sans-serif" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tone">Brand Tone of Voice</Label>
                      <Input id="tone" value={formData.tone || ''} onChange={(e) => setFormData({ ...formData, tone: e.target.value })} placeholder="e.g. Professional yet friendly" />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="code_example">Good Example (Code)</Label>
                    <div className="border border-border rounded-lg overflow-hidden">
                      <Editor height="150px" language="javascript" theme={theme === 'dark' ? 'vs-dark' : 'light'} value={formData.code_example} onChange={(value) => setFormData({ ...formData, code_example: value || '' })} options={{ minimap: { enabled: false }, fontSize: 13 }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bad_example">Bad Example (What to Avoid)</Label>
                    <div className="border border-border rounded-lg overflow-hidden">
                      <Editor height="150px" language="javascript" theme={theme === 'dark' ? 'vs-dark' : 'light'} value={formData.bad_example} onChange={(value) => setFormData({ ...formData, bad_example: value || '' })} options={{ minimap: { enabled: false }, fontSize: 13 }} />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="react, hooks, components"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingItem ? 'Update' : 'Add'} Knowledge
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Brand Kit (per-project, saved to project.brand, applied to every AI call) */}
      {activeProject && (
        <BrandKitCard project={activeProject} onSaved={refreshActiveProject} />
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search knowledge base..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-[200px]">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="code_style">Code Style</SelectItem>
                  <SelectItem value="architecture">Architecture</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="documentation">Documentation</SelectItem>
                  <SelectItem value="best_practices">Best Practices</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Cards */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading knowledge base...</p>
        </div>
      ) : filteredKnowledge.length === 0 ? (
        <Card className="border-border">
          <CardContent className="py-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {searchTerm || categoryFilter !== 'all' ? 'No matching knowledge found' : 'No knowledge added yet'}
            </p>
            <Button onClick={() => { resetForm(); setEditingItem(null); setDialogOpen(true); }} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Knowledge
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredKnowledge.map((item) => {
            const Icon = categoryIcons[item.category];
            return (
              <Card key={item.id} className="border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-lg ${categoryColors[item.category]} flex items-center justify-center`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl">{item.title}</CardTitle>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {item.category.replace('_', ' ')}
                            </Badge>
                            {item.language && <Badge variant="secondary" className="text-xs">{item.language}</Badge>}
                            {item.framework && <Badge variant="secondary" className="text-xs">{item.framework}</Badge>}
                            {item.priority >= 8 && (
                              <Badge variant="warning" className="text-xs gap-1">
                                <Star className="w-3 h-3" />
                                High Priority
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground">{item.description}</p>

                  {item.code_example && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-success">✓ Good Example:</p>
                      <div className="border border-border rounded-lg overflow-hidden">
                        <Editor
                          height="150px"
                          language={item.language?.toLowerCase() || 'javascript'}
                          theme={theme === 'dark' ? 'vs-dark' : 'light'}
                          value={item.code_example}
                          options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }}
                        />
                      </div>
                    </div>
                  )}

                  {item.bad_example && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-destructive">✗ Avoid This:</p>
                      <div className="border border-border rounded-lg overflow-hidden">
                        <Editor
                          height="150px"
                          language={item.language?.toLowerCase() || 'javascript'}
                          theme={theme === 'dark' ? 'vs-dark' : 'light'}
                          value={item.bad_example}
                          options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }}
                        />
                      </div>
                    </div>
                  )}

                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {item.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Created: {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

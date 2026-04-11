import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Send, Sparkles } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

export const RequestForm = ({ onRequestCreated }) => {
  const [formData, setFormData] = useState({
    raw_request: '',
    urgency: 'medium',
    area_of_app: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.raw_request.trim()) {
      toast.error('Please describe your request');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post(`/requests`, formData);
      toast.success('Request submitted successfully!');
      setFormData({ raw_request: '', urgency: 'medium', area_of_app: '' });
      if (onRequestCreated) {
        onRequestCreated(response.data);
      }
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error(error.userMessage || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">New Code Request</CardTitle>
            <CardDescription className="mt-2">
              Describe what you need in natural language. AI will handle the rest.
            </CardDescription>
          </div>
          <Badge variant="info" className="gap-1">
            <Sparkles className="w-3 h-3" />
            AI Powered
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Request Description */}
          <div className="space-y-2">
            <Label htmlFor="request" className="text-base font-semibold">
              What do you need? <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="request"
              placeholder="Example: Add a dark mode toggle to the settings page, or Fix the login button not working on mobile devices..."
              value={formData.raw_request}
              onChange={(e) => setFormData({ ...formData, raw_request: e.target.value })}
              className="min-h-[150px] resize-none"
              required
            />
            <p className="text-xs text-muted-foreground">
              Be as specific as possible. Include current behavior and expected outcome.
            </p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency Level</Label>
              <Select
                value={formData.urgency}
                onValueChange={(value) => setFormData({ ...formData, urgency: value })}
              >
                <SelectTrigger id="urgency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Can wait</SelectItem>
                  <SelectItem value="medium">Medium - Normal priority</SelectItem>
                  <SelectItem value="high">High - Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Area of Application</Label>
              <Input
                id="area"
                placeholder="e.g., Authentication, Dashboard, API"
                value={formData.area_of_app}
                onChange={(e) => setFormData({ ...formData, area_of_app: e.target.value })}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData({ raw_request: '', urgency: 'medium', area_of_app: '' })}
            >
              Clear
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              <Send className="w-4 h-4" />
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

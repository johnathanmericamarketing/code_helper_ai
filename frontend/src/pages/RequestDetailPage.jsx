import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StepIndicator } from '@/components/StepIndicator';
import { CodeDiffViewer } from '@/components/CodeDiffViewer';
import { ValidationResults } from '@/components/ValidationResults';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Play, CheckCircle, XCircle, Download, FileCode, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const RequestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      const response = await axios.get(`${API}/requests/${id}`);
      setRequest(response.data);
      
      // Map status to step
      const statusStepMap = {
        pending: 1,
        structured: 2,
        planned: 3,
        generated: 4,
        validated: 5,
        approved: 6,
        rejected: 6,
      };
      setCurrentStep(statusStepMap[response.data.status] || 1);
      
      // Fetch generated code if exists
      if (['generated', 'validated', 'approved'].includes(response.data.status)) {
        fetchGeneratedCode();
      }
    } catch (error) {
      console.error('Error fetching request:', error);
      toast.error('Failed to load request');
    } finally {
      setLoading(false);
    }
  };

  const fetchGeneratedCode = async () => {
    try {
      const response = await axios.get(`${API}/generated-code/request/${id}`);
      if (response.data.length > 0) {
        setGeneratedData(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching generated code:', error);
    }
  };

  const processRequest = async () => {
    setProcessing(true);
    try {
      // Simulate AI processing through all steps
      toast.info('AI is analyzing your request...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update to structured
      await axios.patch(`${API}/requests/${id}/status`, null, { params: { status: 'structured' } });
      setCurrentStep(2);
      setRequest({ ...request, status: 'structured' });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.info('Creating execution plan...');
      
      // Update to planned
      await axios.patch(`${API}/requests/${id}/status`, null, { params: { status: 'planned' } });
      setCurrentStep(3);
      setRequest({ ...request, status: 'planned' });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.info('Generating code...');
      
      // Generate mock data and save
      const mockGeneratedCode = createMockGeneratedCode();
      const saveResponse = await axios.post(`${API}/generated-code`, mockGeneratedCode);
      setGeneratedData(saveResponse.data);
      
      // Update to generated
      await axios.patch(`${API}/requests/${id}/status`, null, { params: { status: 'generated' } });
      setCurrentStep(4);
      setRequest({ ...request, status: 'generated' });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.info('Running validation checks...');
      
      // Update to validated
      await axios.patch(`${API}/requests/${id}/status`, null, { params: { status: 'validated' } });
      setCurrentStep(5);
      setRequest({ ...request, status: 'validated' });
      
      toast.success('Code generation complete! Ready for review.');
    } catch (error) {
      console.error('Error processing request:', error);
      toast.error('Processing failed');
    } finally {
      setProcessing(false);
    }
  };

  const createMockGeneratedCode = () => {
    return {
      request_id: id,
      structured_task: {
        task_type: 'feature',
        title: 'Implement requested feature',
        context: request.raw_request,
        expected_behavior: 'Feature should work as described in the request',
        acceptance_criteria: [
          'Code compiles without errors',
          'Feature functions as expected',
          'Tests pass successfully',
        ],
        technical_notes: [
          'Follow existing code patterns',
          'Maintain backward compatibility',
        ],
        assumptions: [
          'Current codebase is stable',
          'Dependencies are up to date',
        ],
      },
      execution_plan: {
        files_to_modify: ['src/components/Feature.jsx', 'src/utils/helpers.js'],
        files_to_avoid: ['src/core/config.js', 'src/auth/*'],
        risk_level: 'low',
        change_scope_summary: 'Isolated changes to feature components only',
      },
      code_changes: [
        {
          file_path: 'src/components/Feature.jsx',
          diff: `import React, { useState } from 'react';\n\nconst Feature = () => {\n  const [data, setData] = useState(null);\n  \n  const handleAction = () => {\n    // New feature implementation\n    console.log('Feature activated');\n  };\n  \n  return (\n    <div className="feature-container">\n      <button onClick={handleAction}>\n        Activate Feature\n      </button>\n    </div>\n  );\n};\n\nexport default Feature;`,
          description: 'Added new feature component with action handler',
        },
        {
          file_path: 'src/utils/helpers.js',
          diff: `export const validateInput = (input) => {\n  return input && input.length > 0;\n};\n\nexport const formatOutput = (data) => {\n  return JSON.stringify(data, null, 2);\n};`,
          description: 'Added utility functions for input validation and output formatting',
        },
      ],
      validation_checks: [
        {
          check_name: 'Scope Validation',
          result: 'passed',
          message: 'All changes are within allowed files',
          details: 'No modifications detected outside the planned scope',
        },
        {
          check_name: 'Syntax Check',
          result: 'passed',
          message: 'All code is syntactically correct',
        },
        {
          check_name: 'Dependency Check',
          result: 'passed',
          message: 'No new dependencies required',
        },
        {
          check_name: 'Breaking Changes',
          result: 'passed',
          message: 'No breaking changes detected',
        },
        {
          check_name: 'Test Coverage',
          result: 'warning',
          message: 'Consider adding unit tests',
          details: 'New feature code does not have associated tests',
        },
      ],
      summary: 'Successfully generated code for the requested feature. All validation checks passed with one warning.',
      rollback_instructions: 'Run `git checkout HEAD~1` to revert changes if needed.',
    };
  };

  const handleApprove = async () => {
    try {
      await axios.patch(`${API}/requests/${id}/status`, null, { params: { status: 'approved' } });
      setRequest({ ...request, status: 'approved' });
      setCurrentStep(6);
      toast.success('Code changes approved!');
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve');
    }
  };

  const handleReject = async () => {
    try {
      await axios.patch(`${API}/requests/${id}/status`, null, { params: { status: 'rejected' } });
      setRequest({ ...request, status: 'rejected' });
      setCurrentStep(6);
      toast.error('Code changes rejected');
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading request...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Request not found</p>
        <Button onClick={() => navigate('/')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button variant="ghost" onClick={() => navigate('/history')} className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to History
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Request Details</h1>
          <p className="text-muted-foreground mt-1">ID: {request.id}</p>
        </div>
        {request.status === 'pending' && !processing && (
          <Button onClick={processRequest} className="gap-2" size="lg">
            <Play className="w-5 h-5" />
            Start AI Processing
          </Button>
        )}
        {processing && (
          <Button disabled className="gap-2" size="lg">
            <Sparkles className="w-5 h-5 animate-spin" />
            Processing...
          </Button>
        )}
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} />

      {/* Original Request */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Original Request</CardTitle>
            <div className="flex items-center gap-2">
              {request.urgency && (
                <Badge
                  variant={request.urgency === 'high' ? 'destructive' : request.urgency === 'medium' ? 'warning' : 'outline'}
                >
                  {request.urgency} priority
                </Badge>
              )}
              <Badge variant="outline">{request.status}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2">Request Description:</p>
            <p className="text-foreground">{request.raw_request}</p>
          </div>
          {request.area_of_app && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">Area of Application:</p>
              <Badge>{request.area_of_app}</Badge>
            </div>
          )}
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Created: {new Date(request.created_at).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              Last Updated: {new Date(request.updated_at).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Generated Content */}
      {generatedData && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="plan">Execution Plan</TabsTrigger>
            <TabsTrigger value="code">Code Changes</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="rollback">Rollback</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Structured Task</CardTitle>
                <CardDescription>AI-generated task breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Task Type:</p>
                  <Badge>{generatedData.structured_task.task_type}</Badge>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Title:</p>
                  <p className="text-foreground">{generatedData.structured_task.title}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Expected Behavior:</p>
                  <p className="text-foreground">{generatedData.structured_task.expected_behavior}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Acceptance Criteria:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {generatedData.structured_task.acceptance_criteria.map((item, i) => (
                      <li key={i} className="text-foreground">{item}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{generatedData.summary}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plan" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Execution Plan</CardTitle>
                  <Badge
                    variant={generatedData.execution_plan.risk_level === 'low' ? 'success' : generatedData.execution_plan.risk_level === 'medium' ? 'warning' : 'destructive'}
                  >
                    {generatedData.execution_plan.risk_level} risk
                  </Badge>
                </div>
                <CardDescription>{generatedData.execution_plan.change_scope_summary}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-3">Files to Modify:</p>
                  <div className="space-y-2">
                    {generatedData.execution_plan.files_to_modify.map((file, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-success/10 border border-success/20 rounded">
                        <FileCode className="w-4 h-4 text-success" />
                        <code className="text-sm font-mono text-foreground">{file}</code>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-3">Files to Avoid:</p>
                  <div className="space-y-2">
                    {generatedData.execution_plan.files_to_avoid.map((file, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/20 rounded">
                        <XCircle className="w-4 h-4 text-destructive" />
                        <code className="text-sm font-mono text-foreground">{file}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="space-y-6">
            {generatedData.code_changes.map((change, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-muted-foreground">{change.description}</p>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
                <CodeDiffViewer
                  original=""
                  modified={change.diff}
                  language="javascript"
                  fileName={change.file_path}
                />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="validation">
            <ValidationResults checks={generatedData.validation_checks} />
          </TabsContent>

          <TabsContent value="rollback">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Rollback Instructions</CardTitle>
                <CardDescription>How to revert these changes if needed</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTitle>Safety Instructions</AlertTitle>
                  <AlertDescription className="mt-2">
                    {generatedData.rollback_instructions}
                  </AlertDescription>
                </Alert>
                <pre className="mt-4 bg-secondary p-4 rounded-lg text-sm font-mono overflow-x-auto">
                  {generatedData.rollback_instructions}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Actions */}
      {request.status === 'validated' && (
        <div className="flex items-center justify-end gap-4 p-6 bg-card border border-border rounded-lg">
          <Button variant="outline" onClick={handleReject} className="gap-2">
            <XCircle className="w-4 h-4" />
            Reject Changes
          </Button>
          <Button onClick={handleApprove} className="gap-2">
            <CheckCircle className="w-4 h-4" />
            Approve & Deploy
          </Button>
        </div>
      )}

      {request.status === 'approved' && (
        <Alert className="bg-success/10 border-success">
          <CheckCircle className="w-5 h-5 text-success" />
          <AlertTitle className="text-success">Code Approved!</AlertTitle>
          <AlertDescription className="text-success-foreground">
            The code changes have been approved and are ready for deployment.
          </AlertDescription>
        </Alert>
      )}

      {request.status === 'rejected' && (
        <Alert className="bg-destructive/10 border-destructive">
          <XCircle className="w-5 h-5 text-destructive" />
          <AlertTitle className="text-destructive">Code Rejected</AlertTitle>
          <AlertDescription className="text-destructive-foreground">
            The code changes were rejected. You can create a new request with updated requirements.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

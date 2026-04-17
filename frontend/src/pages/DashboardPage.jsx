import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileCode2, TrendingUp, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { DashboardCharts } from '@/components/DashboardCharts';
import { requestsService } from '@/lib/firebase-service';
import { toast } from 'sonner';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await requestsService.list();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Total Requests',
      value: requests.length,
      icon: FileCode2,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Completed',
      value: requests.filter(r => r.status === 'approved').length,
      icon: CheckCircle,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      title: 'In Progress',
      value: requests.filter(r => ['structured', 'planned', 'generated', 'validated'].includes(r.status)).length,
      icon: TrendingUp,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      title: 'Pending',
      value: requests.filter(r => r.status === 'pending').length,
      icon: Clock,
      color: 'text-info',
      bg: 'bg-info/10',
    },
  ];

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'outline',
      structured: 'info',
      planned: 'info',
      generated: 'warning',
      validated: 'warning',
      approved: 'success',
      rejected: 'destructive',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const recentRequests = requests.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Monitor your AI-powered code generation workflow</p>
        </div>
        <Button onClick={() => navigate('/create')} className="gap-2">
          <Plus className="w-4 h-4" />
          New Request
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl md:text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      {requests.length > 0 && (
        <DashboardCharts requests={requests} />
      )}

      {/* Recent Requests */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Requests</CardTitle>
              <CardDescription>Your latest code generation requests</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/history')}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : recentRequests.length === 0 ? (
            <div className="text-center py-12">
              <FileCode2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No requests yet. Create your first one!</p>
              <Button onClick={() => navigate('/create')} className="mt-4 gap-2">
                <Plus className="w-4 h-4" />
                Create Request
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/request/${request.id}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusBadge(request.status)}
                      {request.area_of_app && (
                        <Badge variant="outline" className="text-xs">
                          {request.area_of_app}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground font-medium line-clamp-2">
                      {request.raw_request}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(request.created_at).toLocaleDateString()} at{' '}
                      {new Date(request.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

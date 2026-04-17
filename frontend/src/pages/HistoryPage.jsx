import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { History as HistoryIcon, Search, Filter } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

export const HistoryPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await apiClient.get(`/requests`);
      setRequests(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

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

  const filteredRequests = requests
    .filter((req) => {
      const matchesSearch = req.raw_request.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (req.area_of_app && req.area_of_app.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Request History</h1>
        <p className="text-muted-foreground mt-1">View and manage all your code generation requests</p>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-[200px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="structured">Structured</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="generated">Generated</SelectItem>
                  <SelectItem value="validated">Validated</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>All Requests ({filteredRequests.length})</CardTitle>
          <CardDescription>Click on any request to view details</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <HistoryIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No requests found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/request/${request.id}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusBadge(request.status)}
                      {request.urgency && (
                        <Badge
                          variant={request.urgency === 'high' ? 'destructive' : request.urgency === 'medium' ? 'warning' : 'outline'}
                          className="text-xs"
                        >
                          {request.urgency} priority
                        </Badge>
                      )}
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
                      Created: {new Date(request.created_at).toLocaleDateString()} at{' '}
                      {new Date(request.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

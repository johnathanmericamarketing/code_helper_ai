import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Users, CreditCard, BarChart3, Shield, RefreshCw,
  Key, CheckCircle, AlertTriangle, Crown, UserX
} from 'lucide-react';
import { toast } from 'sonner';
import { adminService } from '@/lib/admin-service';

const PLAN_COLORS = {
  free:     'secondary',
  byok:     'default',
  platform: 'success',
};

const StatCard = ({ title, value, sub, icon: Icon, color = 'primary' }) => (
  <Card className="border-border">
    <CardContent className="pt-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg bg-${color}/10 flex items-center justify-center`}>
          <Icon className={`w-5 h-5 text-${color}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [promotingUid, setPromotingUid] = useState(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersData, statsData, paymentsData] = await Promise.all([
        adminService.getUsers(),
        adminService.getStats(),
        adminService.getPayments(),
      ]);
      setUsers(usersData);
      setStats(statsData);
      setPayments(paymentsData.payments || []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load admin data. Make sure your account has super_admin role.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleSetRole = async (uid, role) => {
    setPromotingUid(uid);
    try {
      await adminService.setUserRole(uid, role);
      toast.success(`User role updated to ${role}`);
      await loadAll();
    } catch (err) {
      toast.error(err.message || 'Failed to update role');
    } finally {
      setPromotingUid(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Shield className="w-8 h-8 text-destructive" /> Super Admin
        </h1>
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertTitle>Access Denied or Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <Crown className="w-7 h-7 text-yellow-500" />
            Super Admin
          </h1>
          <p className="text-muted-foreground mt-1">Full platform oversight — users, payments, and usage</p>
        </div>
        <Button variant="outline" onClick={loadAll} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Users" value={stats.users.total} icon={Users} />
          <StatCard title="BYOK Users" value={stats.users.byok} sub="Bring Your Own Key" icon={Key} color="blue-500" />
          <StatCard title="Platform Users" value={stats.users.platform} sub="Stripe subscribers" icon={CreditCard} color="success" />
          <StatCard title="Free Users" value={stats.users.free} icon={UserX} color="muted-foreground" />
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Requests" value={stats.usage.total_requests.toLocaleString()} icon={BarChart3} />
          <StatCard title="Input Tokens" value={(stats.usage.total_input_tokens / 1000).toFixed(1) + 'K'} icon={BarChart3} />
          <StatCard title="Output Tokens" value={(stats.usage.total_output_tokens / 1000).toFixed(1) + 'K'} icon={BarChart3} />
          <StatCard title="Total API Cost" value={'$' + stats.usage.total_cost_usd.toFixed(4)} sub="Across all users this month" icon={CreditCard} color="success" />
        </div>
      )}

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4" /> Users ({users.length})
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <CreditCard className="w-4 h-4" /> Payments
          </TabsTrigger>
          <TabsTrigger value="usage" className="gap-2">
            <BarChart3 className="w-4 h-4" /> Usage
          </TabsTrigger>
        </TabsList>

        {/* ── Users Tab ── */}
        <TabsContent value="users" className="mt-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>All Registered Users</CardTitle>
              <CardDescription>Manage user plans and roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="text-left py-3 pr-4 font-medium">Email</th>
                      <th className="text-left py-3 pr-4 font-medium">Plan</th>
                      <th className="text-left py-3 pr-4 font-medium">Role</th>
                      <th className="text-left py-3 pr-4 font-medium">API Key</th>
                      <th className="text-left py-3 pr-4 font-medium">Requests</th>
                      <th className="text-left py-3 pr-4 font-medium">Cost (MTD)</th>
                      <th className="text-left py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-muted-foreground">
                          No users found. Users appear here after their first login.
                        </td>
                      </tr>
                    ) : (
                      users.map(user => (
                        <tr key={user.uid} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="py-3 pr-4">
                            <div>
                              <p className="font-medium text-foreground">{user.email}</p>
                              <p className="text-xs text-muted-foreground font-mono">{user.uid.slice(0, 12)}...</p>
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            <Badge variant={PLAN_COLORS[user.plan] || 'secondary'} className="capitalize">
                              {user.plan}
                            </Badge>
                          </td>
                          <td className="py-3 pr-4">
                            <Badge variant={user.role === 'super_admin' ? 'default' : 'outline'} className="gap-1">
                              {user.role === 'super_admin' && <Crown className="w-3 h-3" />}
                              {user.role || 'user'}
                            </Badge>
                          </td>
                          <td className="py-3 pr-4">
                            {user.has_api_key
                              ? <span className="flex items-center gap-1 text-success text-xs"><CheckCircle className="w-3 h-3" /> Active</span>
                              : <span className="text-muted-foreground text-xs">—</span>
                            }
                          </td>
                          <td className="py-3 pr-4 text-foreground">
                            {user.usage_this_month?.requests ?? 0}
                          </td>
                          <td className="py-3 pr-4 text-foreground">
                            ${(user.usage_this_month?.cost_usd ?? 0).toFixed(4)}
                          </td>
                          <td className="py-3">
                            {user.role !== 'super_admin' ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={promotingUid === user.uid}
                                onClick={() => handleSetRole(user.uid, 'super_admin')}
                                className="text-xs gap-1"
                              >
                                <Crown className="w-3 h-3" />
                                Make Admin
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={promotingUid === user.uid}
                                onClick={() => handleSetRole(user.uid, 'user')}
                                className="text-xs text-destructive gap-1"
                              >
                                <UserX className="w-3 h-3" />
                                Revoke
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Payments Tab ── */}
        <TabsContent value="payments" className="mt-4">
          <Alert>
            <CreditCard className="w-4 h-4" />
            <AlertTitle>Stripe Not Yet Connected</AlertTitle>
            <AlertDescription>
              Add your <strong>Stripe Secret Key</strong> to Firebase Functions config to see real payment history here.
              The table below will show all successful charges, subscriptions, and refunds automatically once connected.
            </AlertDescription>
          </Alert>

          <Card className="border-border mt-4">
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Stripe transactions across all customers</CardDescription>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <div className="py-12 text-center">
                  <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No payment records yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Payments will appear here once Stripe is connected and customers subscribe.
                  </p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="text-left py-3 pr-4">Customer</th>
                      <th className="text-left py-3 pr-4">Amount</th>
                      <th className="text-left py-3 pr-4">Plan</th>
                      <th className="text-left py-3 pr-4">Date</th>
                      <th className="text-left py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-3 pr-4">{payment.customer_email}</td>
                        <td className="py-3 pr-4">${(payment.amount / 100).toFixed(2)}</td>
                        <td className="py-3 pr-4">{payment.plan}</td>
                        <td className="py-3 pr-4">{new Date(payment.created * 1000).toLocaleDateString()}</td>
                        <td className="py-3">
                          <Badge variant={payment.status === 'succeeded' ? 'success' : 'destructive'}>
                            {payment.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Usage Tab ── */}
        <TabsContent value="usage" className="mt-4 space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Platform-Wide Usage (This Month)</CardTitle>
              <CardDescription>Aggregated Claude API token consumption across all users</CardDescription>
            </CardHeader>
            <CardContent>
              {stats ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Requests', value: stats.usage.total_requests.toLocaleString() },
                    { label: 'Input Tokens', value: stats.usage.total_input_tokens.toLocaleString() },
                    { label: 'Output Tokens', value: stats.usage.total_output_tokens.toLocaleString() },
                    { label: 'Total API Cost', value: '$' + stats.usage.total_cost_usd.toFixed(4) },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-4 bg-muted/50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-foreground">{value}</p>
                      <p className="text-sm text-muted-foreground mt-1">{label}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No usage data available.</p>
              )}
            </CardContent>
          </Card>

          <Alert>
            <BarChart3 className="w-4 h-4" />
            <AlertTitle>Revenue Attribution</AlertTitle>
            <AlertDescription>
              Once Stripe is connected, this section will show estimated monthly recurring revenue (MRR),
              churn rate, and per-user profit margins based on API cost vs subscription price.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
};

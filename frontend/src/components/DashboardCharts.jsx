import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--destructive))',
];

export const DashboardCharts = ({ requests = [] }) => {
  // Process data for charts
  const statusData = [
    { name: 'Pending', value: requests.filter(r => r.status === 'pending').length },
    { name: 'Completed', value: requests.filter(r => r.status === 'approved').length },
    { name: 'In Progress', value: requests.filter(r => ['structured', 'planned', 'generated', 'validated'].includes(r.status)).length },
    { name: 'Rejected', value: requests.filter(r => r.status === 'rejected').length },
  ].filter(item => item.value > 0);

  // Timeline data (last 7 days)
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const dayRequests = requests.filter(r => {
        const reqDate = new Date(r.created_at);
        return reqDate.toDateString() === date.toDateString();
      });

      days.push({
        date: dateStr,
        requests: dayRequests.length,
        completed: dayRequests.filter(r => r.status === 'approved').length,
      });
    }
    return days;
  };

  const timelineData = getLast7Days();

  // Area distribution data
  const areaData = {};
  requests.forEach(req => {
    if (req.area_of_app) {
      areaData[req.area_of_app] = (areaData[req.area_of_app] || 0) + 1;
    }
  });

  const areaChartData = Object.entries(areaData).map(([name, value]) => ({ name, value }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Status Distribution */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Status Distribution</CardTitle>
          <CardDescription>Current state of all requests</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Request Trends */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Request Trends</CardTitle>
          <CardDescription>Requests over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="requests" stroke="hsl(var(--primary))" strokeWidth={2} name="Total" />
              <Line type="monotone" dataKey="completed" stroke="hsl(var(--success))" strokeWidth={2} name="Completed" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Area Distribution */}
      {areaChartData.length > 0 && (
        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle>Requests by Application Area</CardTitle>
            <CardDescription>Distribution across different parts of your application</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={areaChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

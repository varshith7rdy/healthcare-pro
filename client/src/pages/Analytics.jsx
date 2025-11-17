import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, Heart, Moon, Footprints } from 'lucide-react';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');

  // TODO: Remove mock data - fetch from API
  const metrics = [
    {
      name: 'Average Heart Rate',
      value: '72 bpm',
      change: '+2%',
      trend: 'up',
      status: 'normal',
      data: [68, 70, 72, 71, 73, 72, 74],
    },
    {
      name: 'Daily Steps',
      value: '8,247',
      change: '+15%',
      trend: 'up',
      status: 'good',
      data: [6500, 7200, 8100, 7800, 8500, 8200, 8900],
    },
    {
      name: 'Sleep Quality',
      value: '7.5 hrs',
      change: '+0.5h',
      trend: 'up',
      status: 'good',
      data: [6.8, 7.2, 7.0, 7.5, 7.8, 7.3, 7.9],
    },
    {
      name: 'Active Minutes',
      value: '45 min',
      change: '+12%',
      trend: 'up',
      status: 'normal',
      data: [35, 42, 40, 48, 45, 50, 52],
    },
  ];

  const weeklyComparison = [
    { metric: 'Heart Rate', thisWeek: '72 bpm', lastWeek: '70 bpm', status: 'normal' },
    { metric: 'Steps', thisWeek: '8,247', lastWeek: '7,156', status: 'improved' },
    { metric: 'Sleep', thisWeek: '7.5 hrs', lastWeek: '7.0 hrs', status: 'improved' },
    { metric: 'Active Time', thisWeek: '45 min', lastWeek: '40 min', status: 'improved' },
  ];

  const insights = [
    {
      icon: Heart,
      title: 'Heart Rate Stability',
      description: 'Your resting heart rate has been consistent this week, averaging 72 bpm.',
      type: 'positive',
    },
    {
      icon: Footprints,
      title: 'Step Goal Achievement',
      description: 'You\'ve exceeded your daily step goal 5 out of 7 days this week!',
      type: 'positive',
    },
    {
      icon: Moon,
      title: 'Sleep Improvement',
      description: 'Your sleep quality improved by 7% compared to last week.',
      type: 'positive',
    },
    {
      icon: Activity,
      title: 'Activity Recommendation',
      description: 'Consider adding 10 more minutes of activity to reach optimal levels.',
      type: 'info',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl font-bold">Analytics</h1>
          <p className="mt-2 text-muted-foreground">Track your health trends and insights</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40" data-testid="select-timerange">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="details" data-testid="tab-details">Detailed Metrics</TabsTrigger>
          <TabsTrigger value="insights" data-testid="tab-insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <Card key={metric.name} data-testid={`metric-${metric.name.toLowerCase().replace(' ', '-')}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metric.value}</div>
                  <div className={`mt-2 flex items-center text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.trend === 'up' ? (
                      <TrendingUp className="mr-1 h-3 w-3" />
                    ) : (
                      <TrendingDown className="mr-1 h-3 w-3" />
                    )}
                    {metric.change}
                  </div>
                  <div className="mt-4 h-12 flex items-end gap-1">
                    {metric.data.map((value, idx) => (
                      <div
                        key={idx}
                        className="flex-1 rounded-t bg-primary/20"
                        style={{ height: `${(value / Math.max(...metric.data)) * 100}%` }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Weekly Comparison</CardTitle>
              <CardDescription>How this week compares to last week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyComparison.map((item) => (
                  <div key={item.metric} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <p className="font-medium">{item.metric}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Last Week</p>
                        <p className="font-medium">{item.lastWeek}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">This Week</p>
                        <p className="font-medium">{item.thisWeek}</p>
                      </div>
                      <Badge variant={item.status === 'improved' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Detailed Metrics</CardTitle>
              <CardDescription>In-depth analysis of your health data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Detailed charts and analysis would be displayed here with a charting library like Recharts
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {insights.map((insight, idx) => (
              <Card key={idx} data-testid={`insight-${idx}`}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`rounded-lg p-3 ${insight.type === 'positive' ? 'bg-green-500/10' : 'bg-blue-500/10'}`}>
                      <insight.icon className={`h-6 w-6 ${insight.type === 'positive' ? 'text-green-600' : 'text-blue-600'}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <CardDescription className="mt-2">{insight.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, Heart, Moon, Footprints, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { generateHealthData, calculateMetrics, generateInsights } from '@/utils/healthDataGenerator';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');

  // Generate health data based on selected time range
  const healthData = useMemo(() => generateHealthData(timeRange), [timeRange]);
  const metrics = useMemo(() => calculateMetrics(healthData), [healthData]);
  const insights = useMemo(() => generateInsights(healthData, metrics), [healthData, metrics]);

  const metricCards = [
    {
      name: 'Average Heart Rate',
      value: `${metrics?.averageHeartRate || 0} bpm`,
      change: `${parseFloat(metrics?.heartRateChange || 0) > 0 ? '+' : ''}${metrics?.heartRateChange || 0}%`,
      trend: parseFloat(metrics?.heartRateChange || 0) >= 0 ? 'up' : 'down',
      icon: Heart,
      color: 'text-red-500',
    },
    {
      name: 'Daily Steps',
      value: metrics?.averageSteps?.toLocaleString() || '0',
      change: `${parseFloat(metrics?.stepsChange || 0) > 0 ? '+' : ''}${metrics?.stepsChange || 0}%`,
      trend: parseFloat(metrics?.stepsChange || 0) >= 0 ? 'up' : 'down',
      icon: Footprints,
      color: 'text-blue-500',
    },
    {
      name: 'Sleep Quality',
      value: `${metrics?.averageSleep || 0} hrs`,
      change: `${parseFloat(metrics?.sleepChange || 0) > 0 ? '+' : ''}${metrics?.sleepChange || 0}%`,
      trend: parseFloat(metrics?.sleepChange || 0) >= 0 ? 'up' : 'down',
      icon: Moon,
      color: 'text-purple-500',
    },
    {
      name: 'Active Minutes',
      value: `${metrics?.averageActiveMinutes || 0} min`,
      change: `${parseFloat(metrics?.activeChange || 0) > 0 ? '+' : ''}${metrics?.activeChange || 0}%`,
      trend: parseFloat(metrics?.activeChange || 0) >= 0 ? 'up' : 'down',
      icon: Activity,
      color: 'text-green-500',
    },
  ];

  const getInsightIcon = (type) => {
    switch (type) {
      case 'positive':
        return CheckCircle;
      case 'warning':
        return AlertTriangle;
      default:
        return Info;
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'positive':
        return 'bg-green-500/10 text-green-600';
      case 'warning':
        return 'bg-orange-500/10 text-orange-600';
      default:
        return 'bg-blue-500/10 text-blue-600';
    }
  };

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
            {metricCards.map((metric) => (
              <Card key={metric.name} data-testid={`metric-${metric.name.toLowerCase().replace(' ', '-')}`}>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metric.value}</div>
                  <div className={`mt-2 flex items-center text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.trend === 'up' ? (
                      <TrendingUp className="mr-1 h-3 w-3" />
                    ) : (
                      <TrendingDown className="mr-1 h-3 w-3" />
                    )}
                    {metric.change} vs previous period
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Health Trends Overview</CardTitle>
              <CardDescription>Your key health metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={healthData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="displayDate"
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="heartRate"
                    stroke="hsl(var(--chart-1))"
                    name="Heart Rate (bpm)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="sleep"
                    stroke="hsl(var(--chart-3))"
                    name="Sleep (hours)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Heart Rate Analysis</CardTitle>
                <CardDescription>Detailed heart rate metrics and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={healthData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="displayDate"
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="maxHeartRate"
                      stackId="1"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.6}
                      name="Max HR"
                    />
                    <Area
                      type="monotone"
                      dataKey="heartRate"
                      stackId="2"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2))"
                      fillOpacity={0.6}
                      name="Avg HR"
                    />
                    <Area
                      type="monotone"
                      dataKey="restingHeartRate"
                      stackId="3"
                      stroke="hsl(var(--chart-3))"
                      fill="hsl(var(--chart-3))"
                      fillOpacity={0.6}
                      name="Resting HR"
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-chart-1">{metrics?.maxHeartRate}</p>
                    <p className="text-xs text-muted-foreground">Max</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-chart-2">{metrics?.averageHeartRate}</p>
                    <p className="text-xs text-muted-foreground">Average</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-chart-3">{metrics?.minHeartRate}</p>
                    <p className="text-xs text-muted-foreground">Min</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Activity</CardTitle>
                <CardDescription>Steps and active minutes tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={healthData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="displayDate"
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="steps" fill="hsl(var(--chart-4))" name="Steps" />
                    <Bar dataKey="activeMinutes" fill="hsl(var(--chart-5))" name="Active Minutes" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-chart-4">{metrics?.totalSteps?.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Steps</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-chart-5">{metrics?.totalActiveMinutes}</p>
                    <p className="text-xs text-muted-foreground">Total Active Minutes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sleep Analysis</CardTitle>
                <CardDescription>Sleep stages and quality breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={healthData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="displayDate"
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="deepSleep"
                      stackId="1"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      name="Deep Sleep"
                    />
                    <Area
                      type="monotone"
                      dataKey="lightSleep"
                      stackId="1"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2))"
                      name="Light Sleep"
                    />
                    <Area
                      type="monotone"
                      dataKey="remSleep"
                      stackId="1"
                      stroke="hsl(var(--chart-3))"
                      fill="hsl(var(--chart-3))"
                      name="REM Sleep"
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center">
                  <p className="text-2xl font-bold">{metrics?.averageSleep} hrs</p>
                  <p className="text-xs text-muted-foreground">Average Sleep Duration</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calorie Expenditure</CardTitle>
                <CardDescription>Daily calorie burn tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={healthData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="displayDate"
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="calories"
                      stroke="hsl(var(--chart-5))"
                      strokeWidth={2}
                      name="Calories"
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-chart-5">{metrics?.totalCalories?.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Calories</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-chart-5">{metrics?.averageCalories?.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Daily Average</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {insights.map((insight, idx) => {
              const IconComponent = getInsightIcon(insight.type);
              const colorClass = getInsightColor(insight.type);
              
              return (
                <Card key={idx} data-testid={`insight-${idx}`}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`rounded-lg p-3 ${colorClass}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg">{insight.title}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {insight.category}
                          </Badge>
                        </div>
                        <CardDescription className="mt-2">{insight.description}</CardDescription>
                        <p className="mt-3 text-sm font-medium text-primary">{insight.metric}</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {insights.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No insights available yet. Keep tracking your health data!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

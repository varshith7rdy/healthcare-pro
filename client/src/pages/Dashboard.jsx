import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Heart, Moon, TrendingUp, Calendar, MessageSquare, FileText, Watch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import Loader from '@/components/Loader';

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const { data: healthMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/health/metrics'],
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ['/api/health/activity'],
  });

  const metricIcons = {
    'Heart Rate': { icon: Heart, color: 'text-red-500' },
    'Steps Today': { icon: Activity, color: 'text-blue-500' },
    'Sleep': { icon: Moon, color: 'text-purple-500' },
    'Active Minutes': { icon: TrendingUp, color: 'text-green-500' },
  };

  const activityIcons = {
    sync: Watch,
    appointment: Calendar,
    insight: MessageSquare,
    record: FileText,
  };

  const quickActions = [
    { title: 'Sync Wearables', description: 'Update your health data', icon: Watch, url: '/wearables', color: 'bg-blue-500' },
    { title: 'Health Companion', description: 'Ask health questions', icon: MessageSquare, url: '/companion', color: 'bg-green-500' },
    { title: 'View Analytics', description: 'See your health trends', icon: TrendingUp, url: '/analytics', color: 'bg-purple-500' },
    { title: 'Book Appointment', description: 'Schedule a visit', icon: Calendar, url: '/appointments', color: 'bg-orange-500' },
  ];

  if (metricsLoading || activityLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl font-bold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Welcome back! Here's your health overview.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {healthMetrics && healthMetrics.length > 0 ? (
          healthMetrics.map((metric) => {
            const config = metricIcons[metric.label] || { icon: Activity, color: 'text-gray-500' };
            return (
              <Card key={metric.label} data-testid={`metric-${metric.label.toLowerCase().replace(' ', '-')}`}>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                  <config.icon className={`h-5 w-5 ${config.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metric.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{metric.unit}</p>
                  {metric.trend && (
                    <div className="mt-2 flex items-center text-xs text-green-600">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      {metric.trend}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No health metrics available. Sync your devices to see data.
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Recent Activity</CardTitle>
            <CardDescription>Your latest health updates</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity && recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => {
                  const IconComponent = activityIcons[activity.type] || Activity;
                  return (
                    <div key={idx} className="flex items-start gap-4" data-testid={`activity-${idx}`}>
                      <div className="rounded-full bg-primary/10 p-2">
                        <IconComponent className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">{activity.text}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">No recent activity</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Quick Actions</CardTitle>
            <CardDescription>Get things done faster</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  variant="outline"
                  className="h-auto flex-col items-start gap-2 p-4 hover-elevate"
                  onClick={() => setLocation(action.url)}
                  data-testid={`action-${action.title.toLowerCase().replace(' ', '-')}`}
                >
                  <div className={`rounded-lg ${action.color} p-2`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

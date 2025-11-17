import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Watch, Smartphone, Activity, Bluetooth, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import Loader from '@/components/Loader';
import wearablesImage from '@assets/generated_images/Modern_wearable_health_devices_33453171.png';

export default function WearablesSync() {
  const { toast } = useToast();
  const [syncingDevice, setSyncingDevice] = useState(null);
  const [progress, setProgress] = useState(0);

  const { data: devices, isLoading } = useQuery({
    queryKey: ['/api/wearables/devices'],
  });

  const syncMutation = useMutation({
    mutationFn: (deviceId) => apiRequest('POST', `/api/wearables/sync/${deviceId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wearables/devices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/health/metrics'] });
      toast({
        title: 'Sync complete',
        description: 'Your health data has been updated',
      });
    },
    onError: () => {
      toast({
        title: 'Sync failed',
        description: 'Unable to sync device. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const connectMutation = useMutation({
    mutationFn: (deviceId) => apiRequest('POST', `/api/wearables/connect/${deviceId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wearables/devices'] });
      toast({
        title: 'Device connected',
        description: 'You can now sync your health data',
      });
    },
    onError: () => {
      toast({
        title: 'Connection failed',
        description: 'Unable to connect device. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSync = async (deviceId) => {
    setSyncingDevice(deviceId);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSyncingDevice(null);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
      await syncMutation.mutateAsync(deviceId);
    } catch (error) {
      clearInterval(interval);
      setSyncingDevice(null);
      setProgress(0);
    }
  };

  const deviceIcons = {
    Smartwatch: Watch,
    'Fitness Tracker': Activity,
    'Health App': Smartphone,
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl font-bold">Wearables & Devices</h1>
        <p className="mt-2 text-muted-foreground">Manage your connected health devices</p>
      </div>

      <div className="rounded-lg overflow-hidden">
        <img
          src={wearablesImage}
          alt="Wearable health devices"
          className="h-40 w-full object-cover"
        />
      </div>

      {devices && devices.length > 0 ? (
        <div className="grid gap-6">
          {devices.map((device) => {
            const IconComponent = deviceIcons[device.type] || Watch;
            return (
              <Card key={device.id} data-testid={`device-${device.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-primary/10 p-3">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{device.name}</CardTitle>
                        <CardDescription>{device.type}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={device.connected ? 'default' : 'secondary'} data-testid={`status-${device.id}`}>
                      {device.connected ? (
                        <>
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Connected
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-1 h-3 w-3" />
                          Disconnected
                        </>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <RefreshCw className="h-4 w-4" />
                      Last synced: {device.lastSync}
                    </div>
                    {device.battery && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        Battery: {device.battery}%
                      </div>
                    )}
                  </div>

                  {syncingDevice === device.id && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Syncing data...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  )}

                  <div className="flex gap-2">
                    {device.connected ? (
                      <Button
                        onClick={() => handleSync(device.id)}
                        disabled={syncingDevice === device.id}
                        data-testid={`button-sync-${device.id}`}
                      >
                        <RefreshCw className={`mr-2 h-4 w-4 ${syncingDevice === device.id ? 'animate-spin' : ''}`} />
                        {syncingDevice === device.id ? 'Syncing...' : 'Sync Now'}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => connectMutation.mutate(device.id)}
                        disabled={connectMutation.isPending}
                        data-testid={`button-connect-${device.id}`}
                      >
                        <Bluetooth className="mr-2 h-4 w-4" />
                        Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No devices connected. Add a device to get started.</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Add New Device</CardTitle>
          <CardDescription>Connect more health devices to get comprehensive insights</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" data-testid="button-add-device">
            <Bluetooth className="mr-2 h-4 w-4" />
            Scan for Devices
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
